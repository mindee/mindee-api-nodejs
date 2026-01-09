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
export * as imageOperations from "./imageOperations/index.js";

// V1
export * as v1 from "./v1/index.js";
export {
  Client,
  AsyncPredictResponse,
  PredictResponse,
  Inference,
  Prediction,
  Document,
  Page,
  product,
} from "./v1/index.js";
export type { PredictOptions, WorkflowOptions } from "./v1/client.js";

// V2
export * as v2 from "./v2/index.js";
export {
  ClientV2,
  InferenceFile,
  InferenceResponse,
  JobResponse,
  RawText,
  RagMetadata,
} from "./v2/index.js";
export type { InferenceParameters, PollingOptions } from "./v2/clientV2.js";
