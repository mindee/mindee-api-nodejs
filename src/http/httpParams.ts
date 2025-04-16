import { InputSource, PageOptions } from "../input";
import { ExecutionPriority } from "../parsing/common";

interface HTTPParams {
  inputDoc: InputSource;
  fullText: boolean;
  pageOptions?: PageOptions;
}

export interface PredictParams extends HTTPParams {
  includeWords: boolean;
  cropper: boolean;
}

export interface WorkflowParams extends HTTPParams {
  alias?: string;
  priority?: ExecutionPriority;
  publicUrl?: string;
  rag?: boolean;
}
