import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyTheme,
  isTheme,
  nextTheme,
  readTheme,
  restoreTheme,
  themeActionLabel,
  themeInitScript,
} from "./theme";

const makeRoot = (theme?: string) => ({ dataset: theme ? { theme } : {} }) as Pick<HTMLElement, "dataset">;

describe("theme helpers", () => {
  it("recognises valid themes", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("blue")).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });

  it("flips the theme", () => {
    expect(nextTheme("dark")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
  });

  it("labels the action, not the current state", () => {
    expect(themeActionLabel("dark")).toBe("Switch to light theme");
    expect(themeActionLabel("light")).toBe("Switch to dark theme");
  });
});

describe("readTheme", () => {
  it("reads data-theme from the root", () => {
    expect(readTheme(makeRoot("light"))).toBe("light");
  });

  it("falls back to the default for missing or invalid values", () => {
    expect(readTheme(makeRoot())).toBe(DEFAULT_THEME);
    expect(readTheme(makeRoot("sepia"))).toBe(DEFAULT_THEME);
  });

  it("uses document.documentElement by default", () => {
    document.documentElement.dataset.theme = "light";

    expect(readTheme()).toBe("light");
  });
});

describe("applyTheme", () => {
  it("writes data-theme and persists the choice", () => {
    const root = makeRoot();
    const storage = { getItem: vi.fn(), setItem: vi.fn() };

    applyTheme("light", root, storage);

    expect(root.dataset.theme).toBe("light");
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, "light");
  });

  it("still applies the theme when storage throws", () => {
    const root = makeRoot();
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new Error("denied");
      }),
    };

    expect(() => applyTheme("dark", root, storage)).not.toThrow();
    expect(root.dataset.theme).toBe("dark");
  });

  it("defaults to the document and localStorage", () => {
    applyTheme("light");

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});

describe("restoreTheme", () => {
  it("prefers the stored theme", () => {
    const root = makeRoot();

    expect(restoreTheme("k", root, { getItem: () => "light" }, () => false)).toBe("light");
    expect(root.dataset.theme).toBe("light");
  });

  it("falls back to the system preference", () => {
    expect(restoreTheme("k", makeRoot(), { getItem: () => null }, () => true)).toBe("light");
    expect(restoreTheme("k", makeRoot(), { getItem: () => "junk" }, () => false)).toBe("dark");
  });

  it("survives a throwing storage", () => {
    const storage = {
      getItem: () => {
        throw new Error("denied");
      },
    };

    expect(restoreTheme("k", makeRoot(), storage, () => false)).toBe("dark");
  });
});

describe("themeInitScript", () => {
  const matchMediaFor = (light: boolean) =>
    vi.fn().mockReturnValue({ matches: light } as MediaQueryList);

  it("is a self-contained script that restores the stored theme", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    vi.stubGlobal("matchMedia", matchMediaFor(false));

    new Function(themeInitScript)();

    expect(document.documentElement.dataset.theme).toBe("light");
    vi.unstubAllGlobals();
  });

  it("uses prefers-color-scheme when nothing is stored", () => {
    const matchMedia = matchMediaFor(true);
    vi.stubGlobal("matchMedia", matchMedia);

    new Function(themeInitScript)();

    expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: light)");
    expect(document.documentElement.dataset.theme).toBe("light");
    vi.unstubAllGlobals();
  });
});
