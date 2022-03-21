import { APIObject } from "@api/object";
import { Input } from "@mindee/inputs";

interface InvoiceParseProps {
  input?: string;
  inputType?: string;
  filename?: string | undefined;
  version?: string;
  cutPdf?: boolean;
  includeWords?: boolean;
}

export class APIInvoice extends APIObject {
  baseUrl: string;

  constructor(public apiToken: string | undefined = undefined) {
    super(apiToken, "invoice");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TO DO : FIX
    this.baseUrl = `${this.baseUrl}/invoices/`;
  }

  /**
   * @param {Boolean} includeWords: , extract all words into http_response
   * @param {Boolean} cutPdf: Automatically reconstruct pdf with more than 4 pages
   * @param {String} inputType: String in {'path', 'stream', 'base64'}
   * @param {String} file: Receipt filepath (allowed jpg, png, tiff, pdf)
   * @param {String} version: expense_receipt api version
   * @returns {Response} Wrapped response with Receipts objects parsed
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async parse({
    input,
    inputType = "path",
    filename = undefined,
    version = "3",
    cutPdf = true,
    includeWords = false,
  }: InvoiceParseProps) {
    super.parse();
    const inputFile = new Input({
      file: input,
      inputType: inputType,
      allowCutPdf: cutPdf,
      filename: filename,
    });
    await inputFile.init();
    const url = `v${version}/predict`;
    return await super._request(url, inputFile, includeWords);
  }

  /** 
    @param {String} inputFile - Input object
    @param {} response - HTTP response
    @param {Document} documentType - Document class in {"Receipt", "Invoice", "Financial_document"}
    @returns {Response}
  */
  wrapResponse(inputFile: string, response: any, documentType: any) {
    const result = super.wrapResponse(inputFile, response, documentType);
    result.documentType =
      result.httpResponse.data?.predictions?.[0]?.document_type?.value?.toLowerCase() ||
      result.documentType;
    return result;
  }
}
