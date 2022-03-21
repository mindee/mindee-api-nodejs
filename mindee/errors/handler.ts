import { logger } from "@mindee/logger";

interface ErrorHandlerInterface {
  throwOnError: boolean;
  throw(error: any): void;
}

class ErrorHandler implements ErrorHandlerInterface {
  constructor(public throwOnError: boolean = true) {
    this.throwOnError = throwOnError;
  }

  throw(error: any): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (this.throwOnError || force) throw error;
    else logger.error(error.message);
  }
}

export const errorHandler = new ErrorHandler();
