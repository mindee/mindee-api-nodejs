import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

/* eslint-disable @typescript-eslint/naming-convention */

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  sonarjs.configs.recommended,
  security.configs.recommended,
  {
    plugins: {
      jsdoc,
      security,
      unicorn,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        Promise: true,
      },
      parser: tseslint.parser,
    },
    rules: {
      "unicorn/import-style": "error",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/text-encoding-identifier-case": "error",
      "unicorn/explicit-length-check": "error",
      "unicorn/single-line-block-comment-style": "error",
      "unicorn/prevent-abbreviations": "error",
      "unicorn/no-keyword-prefix": "error",
      "unicorn/prefer-export-from": "error",
      "unicorn/prefer-set-has": "error",
      "unicorn/no-lonely-if": "error",
      "unicorn/prefer-array-some": "error",

      semi: ["error"],
      "jsdoc/require-asterisk-prefix": "error",
      "jsdoc/check-alignment": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/no-undefined-types": "error",
      "jsdoc/require-jsdoc": "error",

      "sonarjs/no-unused-vars": "off",
      "sonarjs/no-dead-store": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
      }],
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/naming-convention": "error",

      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",

      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",

      "@/object-curly-spacing": ["error", "always"],

      quotes: ["error", "double", {
        avoidEscape: true,
        allowTemplateLiterals: false,
      }],

      camelcase: "error",
      "comma-dangle": ["error", {
        "arrays": "only-multiline",
        "objects": "only-multiline",
        "imports": "only-multiline",
        "exports": "only-multiline",
        "functions": "only-multiline",
      }],
      eqeqeq: "error",
      "no-else-return": "error",

      "no-eval": "error",
      "no-unexpected-multiline": "error",
      "eol-last": "error",
      "preserve-caught-error": "off",
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-object-injection": "off",
      "no-restricted-imports": ["error", {
        "patterns": [{
          "group": ["../*"],
          "message": "Import can be shortened. Please use the @/ path alias instead of relative parent paths.",
        }],
      }],

      indent: ["error", 2],
      "max-len": ["error", {
        code: 120,
      }],
    },
  },
  {
    files: ["tests/**/*"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
);
