const logger = require("../logger");

class ErrorHandler {
  constructor(throwOnError = true) {
    this.throwOnError = throwOnError;
  }

  throw(error) {
    if (this.throwOnError) throw error;
    else logger.error(error.message);
  }
}

const errorHandler = new ErrorHandler();

module.exports = errorHandler;
