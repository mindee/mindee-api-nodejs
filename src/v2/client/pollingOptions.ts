/**
 * Parameters for the internal polling loop in {@link ClientV2.enqueueAndGetInference | enqueueAndGetInference()}.
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

/**
 * Checks the values for asynchronous parsing. Returns their corrected value if they are undefined.
 * @param asyncParams parameters related to asynchronous parsing
 * @returns A valid `AsyncOptions`.
 */
export function setAsyncParams(asyncParams: PollingOptions | undefined = undefined): ValidatedPollingOptions {
  const minDelaySec = 1;
  const minInitialDelay = 1;
  const minRetries = 2;
  let newAsyncParams: PollingOptions;
  if (asyncParams === undefined) {
    newAsyncParams = {
      delaySec: 1.5,
      initialDelaySec: 2,
      maxRetries: 80
    };
  } else {
    newAsyncParams = { ...asyncParams };
    if (
      !newAsyncParams.delaySec ||
      !newAsyncParams.initialDelaySec ||
      !newAsyncParams.maxRetries
    ) {
      throw Error("Invalid polling options.");
    }
    if (newAsyncParams.delaySec < minDelaySec) {
      throw Error(`Cannot set auto-parsing delay to less than ${minDelaySec} second(s).`);
    }
    if (newAsyncParams.initialDelaySec < minInitialDelay) {
      throw Error(`Cannot set initial parsing delay to less than ${minInitialDelay} second(s).`);
    }
    if (newAsyncParams.maxRetries < minRetries) {
      throw Error(`Cannot set retry to less than ${minRetries}.`);
    }
  }
  return newAsyncParams as ValidatedPollingOptions;
}
