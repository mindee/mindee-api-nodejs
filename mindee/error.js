class ErrorHandler {
  constructor(throw_on_error) {
    this.throw_on_error = throw_on_error;
  }

  throw(error) {
    if (this.throw_on_error) throw error;
  }
}

module.exports = ErrorHandler;
