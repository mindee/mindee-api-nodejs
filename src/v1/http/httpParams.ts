import { InputSource, PageOptions } from "@/input/index.js";
import { ExecutionPriority } from "@/v1/parsing/common/index.js";

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
