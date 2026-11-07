import { render, screen } from "@marko/testing-library";
import userEvent from "@testing-library/user-event";
import ExtensionsManagerPage from "./extensions-manager-page.marko";
import { THEME_STORAGE_KEY } from "../../../features/toggle-theme";

describe("ExtensionsManagerPage", () => {
  it("exposes banner, main and contentinfo landmarks", async () => {
    await render(ExtensionsManagerPage);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveTextContent(/Challenge by Frontend Mentor/);
  });

  it("opens attribution links safely in a new tab", async () => {
    await render(ExtensionsManagerPage);

    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("runs the full flow: filter, toggle, remove and switch theme", async () => {
    document.documentElement.dataset.theme = "dark";
    await render(ExtensionsManagerPage);
    const cards = () => screen.getAllByRole("article");

    expect(cards()).toHaveLength(12);

    await userEvent.click(screen.getByRole("button", { name: "Inactive" }));
    expect(cards()).toHaveLength(4);

    await userEvent.click(screen.getByRole("switch", { name: "SpeedBoost enabled" }));
    expect(cards()).toHaveLength(3);

    await userEvent.click(screen.getByRole("button", { name: "Active" }));
    expect(cards()).toHaveLength(9);

    await userEvent.click(screen.getByRole("button", { name: "Remove DevLens" }));
    expect(cards()).toHaveLength(8);
    expect(screen.queryByRole("heading", { name: "DevLens" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");

    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(cards()).toHaveLength(11);
  });

  it("supports keyboard-only use", async () => {
    await render(ExtensionsManagerPage);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: /Switch to/ })).toHaveFocus();

    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Active" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(screen.getAllByRole("article")).toHaveLength(8);
  });
});
