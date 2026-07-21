import { parseDate, StringDict } from "@/parsing/index.js";
import { ErrorResponse } from "@/v2/index.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";

/**
 * Webhook payload returned when an inference fails before producing a result.
 */
export class FailedInferenceResponse extends BaseResponse {
  /**
   * UUID of the failed inference.
   */
  public inferenceId: string;

  /**
   * UUID of the model used.
   */
  public modelId: string;

  /**
   * Name of the input file.
   */
  public fileName: string;

  /**
   * Alias sent for the file, if any.
   */
  public fileAlias?: string;

  /**
   * Problem details for the failure, if available.
   */
  public error: ErrorResponse;

  /**
   * Date and time when the inference was started.
   */
  public createdAt: Date | null;


  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inferenceId = serverResponse["inference_id"];
    this.modelId = serverResponse["model_id"];
    this.fileName = serverResponse["file_name"];
    this.fileAlias = serverResponse["file_alias"];
    this.error = new ErrorResponse(serverResponse["error"]);
    this.createdAt = parseDate(serverResponse["created_at"]);
  }
}
