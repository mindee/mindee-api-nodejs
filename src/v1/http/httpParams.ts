import { InputSource, PageOptions } from "@/input/index.js";
import { ExecutionPriority } from "@/v1/parsing/common/index.js";

interface HTTPParams {
  /** Input source to submit to the API. */
  inputDoc: InputSource;
  /** Enables full-text OCR output when supported. */
  fullText: boolean;
  /** Optional local page filtering options applied before upload. */
  pageOptions?: PageOptions;
  /** Enables Retrieval-Augmented Generation when supported. */
  rag?: boolean;
}

/** Parameters sent to synchronous/asynchronous prediction endpoints. */
export interface PredictParams extends HTTPParams {
  /** Enables word-level OCR details in the response. */
  includeWords: boolean;
  /** Enables cropper extras in the response. */
  cropper: boolean;
  /** Optional workflow ID used for workflow-backed inference. */
  workflowId?: string;
}

/** Parameters sent to workflow execution endpoints. */
export interface WorkflowParams extends HTTPParams {
  /** Custom alias assigned to the submitted file. */
  alias?: string;
  /** Processing priority of the workflow execution. */
  priority?: ExecutionPriority;
  /** Whether to request a public validation URL. */
  publicUrl?: string;
}
