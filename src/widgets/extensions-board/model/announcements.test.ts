import { removedMessage, toggledMessage } from "./announcements";

describe("announcements", () => {
  it("describes toggles", () => {
    expect(toggledMessage("DevLens", true)).toBe("DevLens enabled.");
    expect(toggledMessage("DevLens", false)).toBe("DevLens disabled.");
  });

  it("describes removal", () => {
    expect(removedMessage("StyleSpy")).toBe("StyleSpy removed.");
  });
});
