import { logger } from "../logger";

class ErrorHandler {
  public throwOnError: boolean;

  constructor(throwOnError: boolean = true) {
    this.throwOnError = throwOnError;
  }

  throw(error: Error): void {
    if (this.throwOnError) {
      throw error;
    } else {
      logger.error(error.message);
    }
  }
}

export const errorHandler = new ErrorHandler();
