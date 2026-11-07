import { render } from "@marko/testing-library";
import IconSun from "./icon-sun.marko";
import IconMoon from "./icon-moon.marko";

describe.each([
  ["IconSun", IconSun],
  ["IconMoon", IconMoon],
])("%s", (_, Icon) => {
  it("is decorative and hidden from assistive tech", async () => {
    const { container } = await render(Icon);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("strokes with currentColor", async () => {
    const { container } = await render(Icon);

    expect(container.querySelector("path")).toHaveAttribute("stroke", "currentColor");
  });

  it("forwards the class attribute", async () => {
    const { container } = await render(Icon, { class: "icon-x" });

    expect(container.querySelector("svg")).toHaveClass("icon-x");
  });
});
