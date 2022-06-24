const { logger } = require("../logger");

class ErrorHandler {
  constructor(throwOnError = true) {
    this.throwOnError = throwOnError;
  }

  throw(error, force = true) {
    if (this.throwOnError || force) throw error;
    else logger.error(error.message);
  }
}

const errorHandler = new ErrorHandler();

module.exports = errorHandler;
