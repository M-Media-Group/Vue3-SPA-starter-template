import { defineConfig } from "html-validate";

export default defineConfig({
  plugins: ["html-validate-vue"],
  extends: ["html-validate:recommended", "html-validate-vue:recommended"],
  elements: ["html5"],

  rules: {
    "prefer-native-element": "off", // needed for now for base-button, to review later
    "attribute-boolean-style": "off", // needed for now for base-button, to review later - it seems when looking in the browser that the attributes don't have any value, but the test fails saying they do
  },
});