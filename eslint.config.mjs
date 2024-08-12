import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import markdown from "eslint-plugin-markdown";

export default tseslint.config(
  {
    name: "eslint/setup/globals",
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  ...markdown.configs.recommended,
  {
    name: "eslint/recommended",
    files: ["**/*.md/*.js", "**/*.(m|c)?js"],
    ...pluginJs.configs.recommended,
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.md/*.ts"],
  })),
  {
    name: "markdown/rules",
    rules: {
      "no-console": "off",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
