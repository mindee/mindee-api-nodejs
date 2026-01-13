/**
 * Main Mindee Error custom class.
 */
export class MindeeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MindeeError";
  }
}

/**
 * Custom Mindee error relating to improper mimetypes in inputs.
 */
export class MindeeMimeTypeError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeeMimeTypeError";
  }
}

export class MindeeImageError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeeImageError";
  }
}

export class MindeeDeserializationError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeeDeserializationError";
  }
}

export class MindeeConfigurationError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeeConfigurationError";
  }
}

export class MindeePdfError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeePdfError";
  }
}
