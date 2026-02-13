/**
 * Helper to load optional peer dependencies.
 * @param packageName The name of the npm package to load
 * @param featureName A human-readable name of the feature requiring this package
 */
export async function loadOptionalDependency<T>(packageName: string, featureName: string): Promise<T> {
  try {
    return await (new Function("specifier", "return import(specifier)")(packageName));
  } catch (error: any) {
    if (
      error.code === "MODULE_NOT_FOUND" ||
      error.code === "ERR_MODULE_NOT_FOUND" ||
      error.message?.includes("Cannot find module") ||
      error.message?.includes("Cannot find package")
    ) {
      throw new Error(
        `The feature '${featureName}' requires the optional dependency '${packageName}'. ` +
        "Please install optional dependencies: `npm install --include=optional`"
      );
    }
    throw error;
  }
}
