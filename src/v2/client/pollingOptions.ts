/**
 * Parameters for the internal polling loop in {@link v2.Client.enqueueAndGetInference | enqueueAndGetInference()}.
 *
 * Default behavior:
 * - `initialDelaySec` = 2s
 * - `delaySec` = 1.5s
 * - `maxRetries` = 80
 *
 * Validation rules:
 * - `initialDelaySec` >= 1
 * - `delaySec` >= 1
 * - `maxRetries` >= 2
 *
 * The `initialTimerOptions` and `recurringTimerOptions` objects let you pass an
 * `AbortSignal` or make the timer `unref`-ed to the `setTimeout()`.
 *
 * @category ClientV2
 * @example
 * const params = {
 *   initialDelaySec: 4,
 *   delaySec: 2,
 *   maxRetries: 50
 * };
 *
 * const inference = await client.enqueueAndGetInference(inputDoc, params);
 */
export interface PollingOptions {
  /** Number of seconds to wait *before the first poll*. */
  initialDelaySec?: number;
  /** Interval in seconds between two consecutive polls. */
  delaySec?: number;
  /** Maximum number of polling attempts (including the first one). */
  maxRetries?: number;
  /** Options passed to the initial `setTimeout()`. */
  initialTimerOptions?: {
    ref?: boolean,
    signal?: AbortSignal
  };
  /** Options passed to every recurring `setTimeout()`. */
  recurringTimerOptions?: {
    ref?: boolean,
    signal?: AbortSignal
  }
}

export interface ValidatedPollingOptions extends PollingOptions {
  initialDelaySec: number;
  delaySec: number;
  maxRetries: number;
}
