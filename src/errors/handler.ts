import { logger } from "../logger";

/**
 * Custom Error handling class.
 * @deprecated Clashes with current implementation of some errors, which may cause unexpected behaviors.
 */
export class ErrorHandler {
  public throwOnError: boolean;

  constructor(throwOnError: boolean = true) {
    this.throwOnError = throwOnError;
  }

  throw(error: Error) {
    if (this.throwOnError) {
      throw error;
    } else {
      logger.error(error.message);
    }
  }
}

export const errorHandler = new ErrorHandler();
