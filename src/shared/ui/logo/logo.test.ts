import { render, screen } from "@marko/testing-library";
import Logo from "./logo.marko";

describe("Logo", () => {
  it("is announced as an image named Extensions", async () => {
    await render(Logo);

    expect(screen.getByRole("img", { name: "Extensions" })).toBeInTheDocument();
  });

  it("accepts a custom label", async () => {
    await render(Logo, { label: "Home" });

    expect(screen.getByRole("img", { name: "Home" })).toBeInTheDocument();
  });

  it("colours the wordmark with currentColor so it follows the theme", async () => {
    const { container } = await render(Logo);

    expect(container.querySelector(".logo__text")).toHaveAttribute("fill", "currentColor");
    expect(container.querySelector(".logo__mark")).not.toHaveAttribute("fill");
  });

  it("keeps the design's intrinsic size", async () => {
    const { container } = await render(Logo);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "179");
    expect(svg).toHaveAttribute("height", "41");
  });
});
