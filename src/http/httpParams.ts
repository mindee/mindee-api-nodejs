import { InputSource, PageOptions } from "../input";
import { ExecutionPriority } from "../parsing/common";

interface HTTPParams {
  inputDoc: InputSource;
  fullText: boolean;
  pageOptions?: PageOptions;
  rag?: boolean;
}

export interface PredictParams extends HTTPParams {
  includeWords: boolean;
  cropper: boolean;
  workflowId?: string;
}

export interface WorkflowParams extends HTTPParams {
  alias?: string;
  priority?: ExecutionPriority;
  publicUrl?: string;
}
