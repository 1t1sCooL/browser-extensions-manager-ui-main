import "@testing-library/jest-dom/vitest";
import { cleanup } from "@marko/testing-library";

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});
