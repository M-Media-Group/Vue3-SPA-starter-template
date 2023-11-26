import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "https://localhost:4173",
    // Viewport for mobile
    viewportWidth: 375,
  },
});
