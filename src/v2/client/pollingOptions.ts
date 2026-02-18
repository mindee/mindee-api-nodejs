import { MindeeConfigurationError } from "@/errors/index.js";
import { logger } from "@/logger.js";

export interface TimerOptions {
  ref?: boolean,
  signal?: AbortSignal
}

export interface PollingOptionsConstructor {
  initialDelaySec?: number;
  delaySec?: number;
  maxRetries?: number;
  initialTimerOptions?: TimerOptions;
  recurringTimerOptions?: TimerOptions;
}

const minInitialDelay = 1;
const minDelaySec = 1;
const minRetries = 2;

/**
 * Parameters for the internal polling loop in `enqueueAndGetInference()`.
 *
 * Default behavior:
 * - `initialDelaySec` = 2
 * - `delaySec` = 1.5
 * - `maxRetries` = 80
 *
 * Validation rules:
 * - `initialDelaySec` >= 1
 * - `delaySec` >= 1
 * - `maxRetries` >= 2
 *
 * The `initialTimerOptions` and `recurringTimerOptions` objects let you pass an
 * `AbortSignal` or make the timer `ref`-ed to the `setTimeout()`.
 *
 * @category ClientV2
 * @example
 * ```
 * const pollingOptions = {
 *   initialDelaySec: 4,
 *   delaySec: 2,
 *   maxRetries: 50
 * };
 *
 * const inference = await client.enqueueAndGetInference(
 *   inputDoc, params, pollingOptions
 * );
 * ```
 */
export class PollingOptions {
  /** Number of seconds to wait *before the first poll*. */
  initialDelaySec: number;
  /** Interval in seconds between two consecutive polls. */
  delaySec: number;
  /** Maximum number of polling attempts (including the first one). */
  maxRetries: number;
  /** Options passed to the initial `setTimeout()`. */
  initialTimerOptions?: TimerOptions;
  /** Options passed to every recurring `setTimeout()`. */
  recurringTimerOptions?: TimerOptions;

  constructor(params?: PollingOptionsConstructor) {
    if (!params) {
      params = {};
    }
    if (!params.initialDelaySec) {
      this.initialDelaySec = 2;
    } else {
      this.initialDelaySec = params.initialDelaySec;
    }
    if (!params.delaySec) {
      this.delaySec = 1.5;
    } else {
      this.delaySec = params.delaySec;
    }
    if (!params.maxRetries) {
      this.maxRetries = 80;
    } else {
      this.maxRetries = params.maxRetries;
    }
    if (params.initialTimerOptions) {
      this.initialTimerOptions = params.initialTimerOptions;
    }
    if (params.recurringTimerOptions) {
      this.recurringTimerOptions = params.recurringTimerOptions;
    }
    this.validateOptions();
    logger.debug(`Polling options initialized: ${this.toString()}`);
  }

  validateOptions() {
    if (this.delaySec < minDelaySec) {
      throw new MindeeConfigurationError(
        `Cannot set auto-parsing delay to less than ${minDelaySec} second(s).`
      );
    }
    if (this.initialDelaySec < minInitialDelay) {
      throw new MindeeConfigurationError(
        `Cannot set initial parsing delay to less than ${minInitialDelay} second(s).`
      );
    }
    if (this.maxRetries < minRetries) {
      throw new MindeeConfigurationError(
        `Cannot set retry to less than ${minRetries}.`
      );
    }
  }

  toString(): string {
    return `{ initialDelaySec: ${this.initialDelaySec}, delaySec: ${this.delaySec}, maxRetries: ${this.maxRetries} }`;
  }
}
