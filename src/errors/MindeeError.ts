export class MindeeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MindeeError";
  }
}

export class MindeeMimeTypeError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeeMimeTypeError";
  }
}
