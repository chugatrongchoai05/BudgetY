import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";;

export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    rules: {
      "no-console": "warn",
      "import/order": "error"
    }
  }
];