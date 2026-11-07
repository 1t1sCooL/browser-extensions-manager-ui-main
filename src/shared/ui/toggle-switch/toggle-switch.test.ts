import { render, screen } from "@marko/testing-library";
import userEvent from "@testing-library/user-event";
import ToggleSwitch from "./toggle-switch.marko";

describe("ToggleSwitch", () => {
  it("renders an accessible switch reflecting the checked prop", async () => {
    await render(ToggleSwitch, { checked: true, label: "DevLens enabled" });

    const control = screen.getByRole("switch", { name: "DevLens enabled" });
    expect(control).toBeChecked();
  });

  it("renders unchecked when checked is false", async () => {
    await render(ToggleSwitch, { checked: false, label: "SpeedBoost enabled" });

    expect(screen.getByRole("switch", { name: "SpeedBoost enabled" })).not.toBeChecked();
  });

  it("reports the next value through checkedChange", async () => {
    const checkedChange = vi.fn();
    await render(ToggleSwitch, { checked: false, label: "Switch", checkedChange });

    await userEvent.click(screen.getByRole("switch", { name: "Switch" }));

    expect(checkedChange).toHaveBeenCalledWith(true);
  });

  it("can be toggled from the keyboard", async () => {
    const checkedChange = vi.fn();
    await render(ToggleSwitch, { checked: true, label: "Switch", checkedChange });

    screen.getByRole("switch").focus();
    await userEvent.keyboard(" ");

    expect(checkedChange).toHaveBeenCalledWith(false);
  });

  it("keeps the decorative track out of the accessibility tree", async () => {
    const { container } = await render(ToggleSwitch, { checked: true, label: "Switch" });

    expect(container.querySelector(".switch__track")).toHaveAttribute("aria-hidden", "true");
  });
});
