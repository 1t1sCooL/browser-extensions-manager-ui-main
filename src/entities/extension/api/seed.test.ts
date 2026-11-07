import records from "./data.json";
import { loadInitialExtensions } from "./seed";

describe("loadInitialExtensions", () => {
  it("returns every record from data.json in order", () => {
    const extensions = loadInitialExtensions("/");

    expect(extensions.map((e) => e.name)).toEqual(records.map((r) => r.name));
  });

  it("produces unique ids", () => {
    const ids = loadInitialExtensions("/").map((e) => e.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points logos at the public images folder", () => {
    for (const extension of loadInitialExtensions("/Sub/")) {
      expect(extension.logo).toMatch(/^\/Sub\/images\/logo-[a-z-]+\.svg$/);
    }
  });

  it("matches the design: 8 active and 4 inactive", () => {
    const extensions = loadInitialExtensions();

    expect(extensions.filter((e) => e.isActive)).toHaveLength(8);
    expect(extensions.filter((e) => !e.isActive)).toHaveLength(4);
  });

  it("returns a fresh array each call", () => {
    expect(loadInitialExtensions()).not.toBe(loadInitialExtensions());
  });
});
