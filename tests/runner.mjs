// Cross-version test runner entry point.
//
// Node's built-in test runner only gained glob-pattern support in Node 21,
// so `node --test 'tests/**/*.spec.ts'` fails on Node 20. This script performs
// the file discovery itself and passes explicit paths to `node --test`, which
// works on every supported Node version and every OS.
//
// Usage: node tests/runner.mjs <spec|integration> [subdir]

import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const testsDir = dirname(fileURLToPath(import.meta.url));

const suffix = process.argv[2] === "integration" ? ".integration.ts" : ".spec.ts";
const subdir = process.argv[3];
const searchDir = subdir ? join(testsDir, subdir) : testsDir;

/**
 * Recursively collect test files with the given suffix.
 * @param {string} dir Directory to search.
 * @returns {string[]} Matching file paths.
 */
function findTestFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...findTestFiles(fullPath));
    } else if (entry.name.endsWith(suffix)) {
      found.push(fullPath);
    }
  }
  return found;
}

const files = findTestFiles(searchDir);

if (files.length === 0) {
  console.error(`No '*${suffix}' test files found in ${searchDir}.`);
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--import", "tsx", "--test", ...files],
  { stdio: "inherit" }
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
