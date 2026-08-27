import { Agent, Dispatcher, getGlobalDispatcher } from "undici";
import { logger } from "@/logger.js";

/** Library-owned fallback dispatcher, shared across all components. */
let fallbackDispatcher: Dispatcher | undefined;

/**
 * Returns the global undici dispatcher, provided it was created by the same
 * undici copy this library imports.
 */
export function resolveDefaultDispatcher(): Dispatcher {
  const globalDispatcher = getGlobalDispatcher();
  if (globalDispatcher instanceof Dispatcher) {
    return globalDispatcher;
  }
  logger.debug(
    "Global dispatcher belongs to a different undici instance, using a library-owned Agent instead."
  );
  fallbackDispatcher ??= new Agent();
  return fallbackDispatcher;
}
