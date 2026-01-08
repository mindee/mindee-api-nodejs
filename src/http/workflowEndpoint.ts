import { URLSearchParams } from "url";
import { InputSource, LocalInputSource } from "@/input/index.js";
import { ExecutionPriority } from "@/parsing/common/index.js";
import { cutDocPages, sendRequestAndReadResponse, EndpointResponse } from "./apiCore.js";
import { ApiSettings } from "./apiSettings.js";
import { handleError } from "./error.js";
import { WorkflowParams } from "./httpParams.js";
import { isValidSyncResponse } from "./responseValidation.js";

/**
 * Endpoint for a workflow.
 */
export class WorkflowEndpoint {
  /** Settings relating to the API. */
  settings: ApiSettings;
  /** Root of the URL for API calls. */
  urlRoot: string;

  constructor(
    settings: ApiSettings,
    workflowId: string
  ) {
    this.settings = settings;
    this.urlRoot = `/v1/workflows/${workflowId}/executions`;
  }

  /**
   * Sends a document to a workflow execution.
   * Throws an error if the server's response contains one.
   * @param {WorkflowParams} params parameters relating to prediction options.
   * @category Synchronous
   * @returns a `Promise` containing parsing results.
   */
  async executeWorkflow(params: WorkflowParams): Promise<EndpointResponse> {
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.#workflowReqPost(params);
    if (!isValidSyncResponse(response)) {
      handleError(this.urlRoot, response, response.messageObj?.statusMessage);
    }
    return response;
  }

  /**
   * Make a request to POST a document for workflow.
   *
   * @param {WorkflowParams} params parameters relating to prediction options.
   */
  #workflowReqPost(params: WorkflowParams): Promise<EndpointResponse> {
    return this.sendFileForPrediction(
      params.inputDoc,
      params.alias,
      params.priority,
      params.fullText,
      params.publicUrl,
      params.rag
    );
  }

  /**
   * Send a file to a prediction API.
   * @param input
   * @param alias
   * @param priority
   * @param fullText
   * @param publicUrl
   * @param rag
   */
  protected async sendFileForPrediction(
    input: InputSource,
    alias: string | null = null,
    priority: ExecutionPriority | null = null,
    fullText: boolean = false,
    publicUrl: string | null = null,
    rag: boolean | null = null,
  ): Promise<EndpointResponse> {
    const searchParams = new URLSearchParams();
    if (fullText) {
      searchParams.append("full_text_ocr", "true");
    }
    if (rag) {
      searchParams.append("rag", "true");
    }

    const form = new FormData();
    if (input instanceof LocalInputSource && input.fileObject instanceof Buffer) {
      form.append("document", new Blob([input.fileObject]), input.filename);
    } else {
      form.append("document", input.fileObject);
    }
    if (alias) {
      form.append("alias", alias);
    }
    if (publicUrl) {
      form.append("public_url", publicUrl);
    }
    if (priority) {
      form.append("priority", priority.toString());
    }

    let path = this.urlRoot;
    if (searchParams.toString().length > 0) {
      path += `?${searchParams}`;
    }

    const options = {
      method: "POST",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: path,
      timeout: this.settings.timeout,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }
}
