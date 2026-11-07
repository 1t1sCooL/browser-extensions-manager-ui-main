import { defineConfig } from "vitest/config";
import marko from "@marko/vite";

export default defineConfig({
  plugins: [marko({ linked: false })],
  resolve: { conditions: ["browser"] },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts"],
  },
});
