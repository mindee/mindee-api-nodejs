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

// V1
export * as v1 from "./v1/index.js";

// V2
export * as v2 from "./v2/index.js";
export {
  Client,
  ExtractionParameters,
  DataSchema,
  InferenceFile,
  InferenceModel,
  ClassificationInference,
  ClassificationResponse,
  CropInference,
  CropResponse,
  ExtractionInference,
  ExtractionResponse,
  OcrInference,
  OcrResponse,
  SplitInference,
  SplitResponse,
  JobResponse,
  ErrorResponse,
} from "./v2/index.js";
export type { PollingOptions } from "./v2/index.js";
