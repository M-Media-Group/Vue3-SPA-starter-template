/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  overrides: [
    {
      files: ["cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}"],
      extends: ["plugin:cypress/recommended"],
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["unused-imports"],
  rules: {
    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "no-unneeded-ternary": "error",
    "no-useless-rename": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
      },
    ],
    "spaced-comment": ["error", "always", { markers: ["/"] }],
    yoda: "error",
    "no-trailing-spaces": "error",
    "dot-notation": "error",
    "no-lonely-if": "error",
    "no-undef-init": "error",
    "prefer-const": "error",
  },
};
