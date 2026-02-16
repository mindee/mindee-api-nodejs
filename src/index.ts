// Core
export {
  InputSource,
  Base64Input,
  BufferInput,
  BytesInput,
  PathInput,
  StreamInput,
  UrlInput,
  PageOptionsOperation,
} from "./input/index.js";
export type { PageOptions } from "./input/index.js";
export * as image from "./image/index.js";
export * as pdf from "./pdf/index.js";
export * as geometry from "./geometry/index.js";

// V1
export * as v1 from "./v1/index.js";

// V2
export * as v2 from "./v2/index.js";

// Consider v2 the default
export * as product from "./v2/product/index.js";
export {
  Client,
  JobResponse,
  ErrorResponse,
} from "./v2/index.js";
export type { PollingOptions } from "./v2/index.js";
