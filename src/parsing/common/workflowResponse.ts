import { StringDict } from "./stringDict";
import { ApiResponse } from "./apiResponse";
import { Execution } from "./execution";
import { Inference } from "./inference";


/** Wrapper for workflow requests.
 *
 * @category API Response
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
