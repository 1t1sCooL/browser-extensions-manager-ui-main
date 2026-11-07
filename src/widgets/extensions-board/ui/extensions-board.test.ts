import { render, screen, within } from "@marko/testing-library";
import userEvent from "@testing-library/user-event";
import ExtensionsBoard from "./extensions-board.marko";
import type { Extension } from "../../../entities/extension";

const make = (name: string, isActive: boolean): Extension => ({
  id: name.toLowerCase(),
  name,
  description: `${name} does things.`,
  logo: `/images/${name}.svg`,
  isActive,
});

const fixtures = () => [make("Alpha", true), make("Beta", false), make("Gamma", true)];

const names = () => screen.queryAllByRole("heading", { level: 2 }).map((h) => h.textContent?.trim());

describe("ExtensionsBoard", () => {
  it("renders the title, filters and all twelve extensions from data.json", async () => {
    await render(ExtensionsBoard);

    expect(screen.getByRole("heading", { level: 1, name: "Extensions List" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Filter extensions" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(12);
  });

  it("is a labelled region", async () => {
    await render(ExtensionsBoard, { extensions: fixtures() });

    expect(screen.getByRole("region", { name: "Extensions List" })).toBeInTheDocument();
  });

  it("filters active and inactive extensions", async () => {
    await render(ExtensionsBoard, { extensions: fixtures() });

    await userEvent.click(screen.getByRole("button", { name: "Active" }));
    expect(names()).toEqual(["Alpha", "Gamma"]);

    await userEvent.click(screen.getByRole("button", { name: "Inactive" }));
    expect(names()).toEqual(["Beta"]);

    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(names()).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it("moves a toggled extension between filters", async () => {
    await render(ExtensionsBoard, { extensions: fixtures() });

    await userEvent.click(screen.getByRole("button", { name: "Active" }));
    await userEvent.click(screen.getByRole("switch", { name: "Alpha enabled" }));

    expect(names()).toEqual(["Gamma"]);

    await userEvent.click(screen.getByRole("button", { name: "Inactive" }));
    expect(names()).toEqual(["Alpha", "Beta"]);
    expect(screen.getByRole("switch", { name: "Alpha enabled" })).not.toBeChecked();
  });

  it("removes an extension and announces it", async () => {
    await render(ExtensionsBoard, { extensions: fixtures() });

    await userEvent.click(screen.getByRole("button", { name: "Remove Beta" }));

    expect(names()).toEqual(["Alpha", "Gamma"]);
    expect(screen.getByRole("status")).toHaveTextContent("Beta removed.");
  });

  it("announces toggles", async () => {
    await render(ExtensionsBoard, { extensions: fixtures() });

    await userEvent.click(screen.getByRole("switch", { name: "Beta enabled" }));

    expect(screen.getByRole("status")).toHaveTextContent("Beta enabled.");
  });

  it("keeps removals when switching filters", async () => {
    await render(ExtensionsBoard, { extensions: fixtures() });

    await userEvent.click(screen.getByRole("button", { name: "Remove Alpha" }));
    await userEvent.click(screen.getByRole("button", { name: "Active" }));

    expect(names()).toEqual(["Gamma"]);
  });

  it("shows an empty message when a filter has no matches", async () => {
    await render(ExtensionsBoard, { extensions: [make("Solo", true)] });

    await userEvent.click(screen.getByRole("button", { name: "Inactive" }));

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByText("No inactive extensions.")).toBeInTheDocument();
  });

  it("shows an empty message after removing everything", async () => {
    await render(ExtensionsBoard, { extensions: [make("Solo", true)] });

    await userEvent.click(screen.getByRole("button", { name: "Remove Solo" }));

    expect(screen.getByText("No extensions left.")).toBeInTheDocument();
  });

  it("keeps each card's controls scoped to its own extension", async () => {
    await render(ExtensionsBoard, { extensions: fixtures() });

    const gamma = screen.getByRole("article", { name: "Gamma" });
    await userEvent.click(within(gamma).getByRole("switch"));

    expect(screen.getByRole("switch", { name: "Alpha enabled" })).toBeChecked();
    expect(within(gamma).getByRole("switch")).not.toBeChecked();
  });
});
