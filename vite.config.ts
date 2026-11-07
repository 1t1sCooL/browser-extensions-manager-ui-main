import { defineConfig } from "vite";
import marko from "@marko/run/vite";
import staticAdapter from "@marko/run-adapter-static";

export default defineConfig({
  // base: "/BrowserExtensionsManagerUI/",
  plugins: [marko({ adapter: staticAdapter() })],
  build: { sourcemap: false },
});
