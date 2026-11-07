import { render, screen } from "@marko/testing-library";
import userEvent from "@testing-library/user-event";
import ExtensionCard from "./extension-card.marko";
import type { Extension } from "../model/types";

const extension: Extension = {
  id: "devlens",
  name: "DevLens",
  description: "Quickly inspect page layouts and visualize element boundaries.",
  logo: "/images/logo-devlens.svg",
  isActive: true,
};

describe("ExtensionCard", () => {
  it("renders the name as a heading that labels the card", async () => {
    await render(ExtensionCard, { extension });

    expect(screen.getByRole("heading", { level: 2, name: "DevLens" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "DevLens" })).toBeInTheDocument();
  });

  it("renders the description", async () => {
    await render(ExtensionCard, { extension });

    expect(screen.getByText(extension.description)).toBeInTheDocument();
  });

  it("renders a decorative logo with intrinsic size", async () => {
    const { container } = await render(ExtensionCard, { extension });
    const img = container.querySelector("img");

    expect(img).toHaveAttribute("src", extension.logo);
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("width", "60");
    expect(img).toHaveAttribute("height", "60");
  });

  it("reflects isActive in the switch", async () => {
    await render(ExtensionCard, { extension: { ...extension, isActive: false } });

    expect(screen.getByRole("switch", { name: "DevLens enabled" })).not.toBeChecked();
  });

  it("calls onToggle with the next state", async () => {
    const onToggle = vi.fn();
    await render(ExtensionCard, { extension, onToggle });

    await userEvent.click(screen.getByRole("switch", { name: "DevLens enabled" }));

    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("calls onRemove from a typed button whose name includes the visible label", async () => {
    const onRemove = vi.fn();
    await render(ExtensionCard, { extension, onRemove });

    const button = screen.getByRole("button", { name: "Remove DevLens" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveTextContent("Remove");

    await userEvent.click(button);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("works without handlers", async () => {
    await render(ExtensionCard, { extension });

    await userEvent.click(screen.getByRole("button", { name: "Remove DevLens" }));
    await userEvent.click(screen.getByRole("switch"));

    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("updates when the extension input changes", async () => {
    const { rerender } = await render(ExtensionCard, { extension });

    await rerender({ extension: { ...extension, isActive: false, name: "DevLens 2" } });

    expect(screen.getByRole("heading", { name: "DevLens 2" })).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toBeChecked();
  });
});
