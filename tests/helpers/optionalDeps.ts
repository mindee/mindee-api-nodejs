import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const OPTIONAL_DEPENDENCIES = [
  "sharp",
  "pdf.js-extract",
  "@cantoo/pdf-lib",
  "node-poppler",
] as const;

/**
 * Checks whether the optional dependencies are present.
 * @param moduleName Name of the module to check.
 */
export function hasOptionalDependency(moduleName: string): boolean {
  try {
    require.resolve(moduleName);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether all the optional dependencies are present.
 */
export function hasAllOptionalDependencies(): boolean {
  return OPTIONAL_DEPENDENCIES.every(hasOptionalDependency);
}

