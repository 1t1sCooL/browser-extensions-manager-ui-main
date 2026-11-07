import { render, screen } from "@marko/testing-library";
import userEvent from "@testing-library/user-event";
import FilterTabs from "./filter-tabs.marko";

const pressed = () =>
  screen
    .getAllByRole("button")
    .filter((b) => b.getAttribute("aria-pressed") === "true")
    .map((b) => b.textContent?.trim());

describe("FilterTabs", () => {
  it("renders a labelled group of three typed buttons", async () => {
    await render(FilterTabs);

    expect(screen.getByRole("group", { name: "Filter extensions" })).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(["All", "Active", "Inactive"]);
    for (const button of buttons) expect(button).toHaveAttribute("type", "button");
  });

  it("selects All by default", async () => {
    await render(FilterTabs);

    expect(pressed()).toEqual(["All"]);
  });

  it("reflects a controlled value", async () => {
    await render(FilterTabs, { value: "inactive" });

    expect(pressed()).toEqual(["Inactive"]);
  });

  it("reports the clicked filter through valueChange", async () => {
    const valueChange = vi.fn();
    await render(FilterTabs, { value: "all", valueChange });

    await userEvent.click(screen.getByRole("button", { name: "Active" }));

    expect(valueChange).toHaveBeenCalledWith("active");
  });

  it("keeps its own state when uncontrolled", async () => {
    await render(FilterTabs);

    await userEvent.click(screen.getByRole("button", { name: "Inactive" }));

    expect(pressed()).toEqual(["Inactive"]);
  });

  it("follows a new controlled value", async () => {
    const { rerender } = await render(FilterTabs, { value: "all", valueChange: () => {} });

    await rerender({ value: "active", valueChange: () => {} });

    expect(pressed()).toEqual(["Active"]);
  });
});
