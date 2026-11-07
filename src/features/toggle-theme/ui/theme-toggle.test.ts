import { render, screen } from "@marko/testing-library";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./theme-toggle.marko";
import { THEME_STORAGE_KEY } from "../model/theme";

describe("ThemeToggle", () => {
  it("reads the theme the head script already applied", async () => {
    document.documentElement.dataset.theme = "light";
    await render(ThemeToggle);

    expect(await screen.findByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });

  it("defaults to dark when no theme is set", async () => {
    await render(ThemeToggle);

    expect(screen.getByRole("button", { name: "Switch to light theme" })).toHaveAttribute("type", "button");
  });

  it("switches the document theme, persists it and relabels itself", async () => {
    document.documentElement.dataset.theme = "dark";
    await render(ThemeToggle);

    await userEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("renders both icons and lets CSS pick one per theme", async () => {
    const { container } = await render(ThemeToggle);

    expect(container.querySelector(".theme-toggle__icon--sun")).toBeInTheDocument();
    expect(container.querySelector(".theme-toggle__icon--moon")).toBeInTheDocument();
  });
});
