import { render, screen } from "@marko/testing-library";
import AppHeader from "./app-header.marko";

describe("AppHeader", () => {
  it("is a banner landmark with the logo and the theme toggle", async () => {
    await render(AppHeader);

    const banner = screen.getByRole("banner");
    expect(banner).toContainElement(screen.getByRole("img", { name: "Extensions" }));
    expect(banner).toContainElement(screen.getByRole("button", { name: /Switch to (light|dark) theme/ }));
  });
});
