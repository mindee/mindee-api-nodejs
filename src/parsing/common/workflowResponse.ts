import { StringDict } from "@/parsing/common/stringDict.js";
import { ApiResponse } from "./apiResponse.js";
import { Execution } from "./execution.js";
import { Inference } from "./inference.js";


/** Wrapper for workflow requests.
 *
 * @category API Response
 * @category Workflow
 */
export class WorkflowResponse<T extends Inference> extends ApiResponse {
  /**
   * Set the prediction model used to parse the document.
   * The response object will be instantiated based on this parameter.
   */
  execution: Execution<T>;

  constructor(inferenceClass: new (serverResponse: StringDict) => T, serverResponse: StringDict) {
    super(serverResponse);
    this.execution = new Execution<T>(inferenceClass, serverResponse["execution"]);
  }
}
