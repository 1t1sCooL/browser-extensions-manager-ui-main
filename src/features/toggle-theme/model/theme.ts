export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "extensions-manager-theme";
export const DEFAULT_THEME: Theme = "dark";

type ThemeRoot = Pick<HTMLElement, "dataset">;
type ThemeStorage = Pick<Storage, "getItem" | "setItem">;

export const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

export const nextTheme = (theme: Theme): Theme => (theme === "dark" ? "light" : "dark");

export const themeActionLabel = (theme: Theme): string => `Switch to ${nextTheme(theme)} theme`;

export const readTheme = (root: ThemeRoot = document.documentElement): Theme => {
  const theme = root.dataset.theme;
  return isTheme(theme) ? theme : DEFAULT_THEME;
};

export const applyTheme = (
  theme: Theme,
  root: ThemeRoot = document.documentElement,
  storage?: ThemeStorage,
): void => {
  root.dataset.theme = theme;
  try {
    (storage ?? localStorage).setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / disabled storage: the theme still applies for this visit.
  }
};

// Serialized into <head> with Function#toString, so it may only touch its own
// parameters and browser globals — no imports or module-level constants.
export const restoreTheme = (
  key: string,
  root?: ThemeRoot,
  storage?: Pick<Storage, "getItem">,
  prefersLight?: () => boolean,
): string => {
  let theme: string | null = null;
  try {
    theme = (storage ?? localStorage).getItem(key);
  } catch {
    theme = null;
  }
  if (theme !== "light" && theme !== "dark") {
    theme = (prefersLight ?? (() => matchMedia("(prefers-color-scheme: light)").matches))()
      ? "light"
      : "dark";
  }
  (root ?? document.documentElement).dataset.theme = theme;
  return theme;
};

export const themeInitScript = `(${restoreTheme.toString()})(${JSON.stringify(THEME_STORAGE_KEY)});`;
