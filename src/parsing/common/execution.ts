import { Inference } from "./inference";
import { GeneratedV1Document } from "../../product/generated/generatedV1Document";
import { ExecutionFile } from "./executionFile";
import { StringDict } from "./stringDict";
import { ExecutionPriority } from "./executionPriority";
import { parseDate } from "./dateParser";

/**
 * Representation of an execution for a workflow.
 * @category Workflow
 */
export class Execution<T extends Inference> {
  /** Identifier for the batch to which the execution belongs. */
  batchName: string;

  /** The time at which the execution started. */
  createdAt: Date | null;

  /** File representation within a workflow execution. */
  file: ExecutionFile;

  /** Identifier for the execution. */
  id: string;

  /** Deserialized inference object. */
  inference: T | null;

  /** Priority of the execution. */
  priority: ExecutionPriority | null;

  /** The time at which the file was tagged as reviewed. */
  reviewedAt: Date | null;

  /** The time at which the file was uploaded to a workflow. */
  availableAt: Date | null;

  /** Reviewed fields and values. */
  reviewedPrediction: GeneratedV1Document | null;

  /** Execution Status. */
  status: string;

  /** Execution type. */
  type: string | null;

  /** The time at which the file was uploaded to a workflow. */
  uploadedAt: Date | null;

  /** Identifier for the workflow. */
  workflowId: string;

  constructor(inferenceClass: new (serverResponse: StringDict) => T, jsonResponse: StringDict) {
    this.batchName = jsonResponse["batch_name"];
    this.createdAt = parseDate(jsonResponse["created_at"]);
    this.file = jsonResponse["file"];
    this.id = jsonResponse["id"];
    this.inference = jsonResponse["inference"] ? new inferenceClass(jsonResponse["inference"]) : null;
    this.priority = jsonResponse["priority"];
    this.reviewedAt = parseDate(jsonResponse["reviewed_at"]);
    this.availableAt = parseDate(jsonResponse["available_at"]);
    this.reviewedPrediction = jsonResponse["reviewed_prediction"] ?
      new GeneratedV1Document(jsonResponse["reviewed_prediction"]) : null;
    this.status = jsonResponse["status"];
    this.type = jsonResponse["type"];
    this.uploadedAt = parseDate(jsonResponse["uploaded_at"]);
    this.workflowId = jsonResponse["workflow_id"];
  }
}
