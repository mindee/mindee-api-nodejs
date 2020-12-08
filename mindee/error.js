class ErrorHandler {
  constructor(throwOnError) {
    this.throwOnError = throwOnError;
  }

  throw(error) {
    if (this.throwOnError) throw error;
  }
}

module.exports = ErrorHandler;
