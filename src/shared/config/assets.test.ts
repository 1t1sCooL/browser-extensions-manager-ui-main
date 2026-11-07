import { assetUrl } from "./assets";

describe("assetUrl", () => {
  it("joins a root base with a relative path", () => {
    expect(assetUrl("images/logo.svg", "/")).toBe("/images/logo.svg");
  });

  it("prefixes a subpath base", () => {
    expect(assetUrl("fonts/a.woff2", "/BrowserExtensionsManagerUI/")).toBe(
      "/BrowserExtensionsManagerUI/fonts/a.woff2",
    );
  });

  it("adds the missing trailing slash to the base", () => {
    expect(assetUrl("images/x.png", "/Sub")).toBe("/Sub/images/x.png");
  });

  it("strips leading ./ and / from the path", () => {
    expect(assetUrl("./images/x.png", "/")).toBe("/images/x.png");
    expect(assetUrl("/images/x.png", "/Sub/")).toBe("/Sub/images/x.png");
  });

  it("defaults to the Vite BASE_URL", () => {
    expect(assetUrl("images/x.png")).toBe(`${import.meta.env.BASE_URL}images/x.png`);
  });
});
