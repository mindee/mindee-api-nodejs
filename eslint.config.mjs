import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [],
}, ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        jsdoc,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
            Promise: true,
        },

        parser: tsParser,
    },

    rules: {
        "max-len": ["error", {
            code: 120,
        }],

        semi: ["error"],
        "jsdoc/check-alignment": 1,
        "jsdoc/check-param-names": 1,
        "jsdoc/check-types": 1,
        "jsdoc/no-undefined-types": 1,
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/naming-convention": "error",
        "@/object-curly-spacing": ["error", "always"],

        quotes: ["error", "double", {
            avoidEscape: true,
            allowTemplateLiterals: false,
        }],

        camelcase: "error",
        "comma-dangle": ["error", "always-multiline"],
        eqeqeq: "error",
        "no-else-return": "error",

        "no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "no-eval": "error",
        "no-unexpected-multiline": "off",
        indent: ["error", 2],
        "eol-last": "error",
    },
}];