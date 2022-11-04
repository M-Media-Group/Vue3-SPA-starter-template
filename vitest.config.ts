// This file, and the unit.setup.ts one, are here for setting up locales in testing, see https://stackoverflow.com/a/73424585/7410951
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig(
  mergeConfig(viteConfig, {
    // extending app vite config
    test: {
      setupFiles: ["../unit.setup.ts"],
      environment: "jsdom",
      coverage: {
        provider: "istanbul", // or 'c8'
      },
    },
  })
);
