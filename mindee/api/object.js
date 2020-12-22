const Response = require("./response");
const errorHandler = require("../errors/handler");
const request = require("./request");

/**
 * Base class for APIs (APIReceipt & APIInvoice)
 *  @param {String} apiToken - Token of the API used for parsing document
 *  @param {String} apiName - Name of the API used for parsing document
 */
class APIObject {
  constructor(apiToken = undefined, apiName = "") {
    this.apiToken = apiToken;
    this.baseUrl = "https://api.mindee.net/products";
    this.apiName = apiName;
  }

  /**
   */
  parse() {
    if (!this.apiToken) {
      errorHandler.throw({
        error: new Error(
          `Missing API token for ${this.apiName}. \
          Have you create a mindee Client with a ${this.apiName}Token in parameters ?`
        ),
      });
    }
  }

  /** 
    @param {String} url - API url for request
    @param {Input} inputFile - input file for API
    @param {Boolean} includeWords - Include Mindee vision words in Response
    @returns {Response}
  */
  async _request(url, inputFile, includeWords = false) {
    const files = { file: inputFile.file_object.read() }; // TODO read object here
    const headers = {
      "X-Inferuser-Token": this.apiToken,
    };
    const params = {};
    if (includeWords) params["include_mvision"] = "true";
    const response = await request(url, "post", headers, files);
    return this.wrapResponse(inputFile, response, this.apiName);
  }

  /** 
    @param {String} inputFile - Input object
    @param {} response - HTTP response
    @param {Document} documentType - Document class in {"Receipt", "Invoice", "Financial_document"}
    @returns {Response}
  */
  wrapResponse(inputFile, response, documentType) {
    console.debug(response.statusCode);
    if (response.statusCode != 200) {
      // TODO Change Error to a Specific HTTPError
      errorHandler.throw(
        new Error(
          "Receipt API %s HTTP error: %s" %
            (response.statusCode, JSON.stringify(response.data))
        ),
        false
      );
      return new Response({
        httpResponse: response,
        documentType: documentType,
        document: undefined,
        input: inputFile,
        error: true,
      });
    }
    return new Response({
      httpResponse: response,
      documentType: documentType,
      document: inputFile,
      input: inputFile,
    });
  }
}

module.exports = APIObject;
