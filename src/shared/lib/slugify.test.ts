import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases single words", () => {
    expect(slugify("DevLens")).toBe("devlens");
  });

  it("joins words with a dash", () => {
    expect(slugify("TabMaster Pro")).toBe("tabmaster-pro");
  });

  it("collapses runs of separators and trims them", () => {
    expect(slugify("  DOM -- Snapshot!  ")).toBe("dom-snapshot");
  });

  it("returns an empty string for punctuation only", () => {
    expect(slugify("***")).toBe("");
  });
});
