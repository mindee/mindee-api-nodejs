import { InputSource, PageOptions, LocalInputSource } from "@/input/index.js";
import { ApiSettingsV1 } from "@/v1/http/apiSettingsV1.js";

export abstract class BaseEndpoint {
  /** Settings relating to the API. */
  settings: ApiSettingsV1;

  /** Root of the URL for API calls. */
  urlRoot: string;

  protected constructor(
    settings: ApiSettingsV1,
    urlRoot: string
  ) {
    this.settings = settings;
    this.urlRoot = urlRoot;
  }

  /**
   * Cuts a document's pages according to the given options.
   * @param inputDoc input document.
   * @param pageOptions page cutting options.
   */
  async cutDocPages(inputDoc: InputSource, pageOptions: PageOptions) {
    if (inputDoc instanceof LocalInputSource && inputDoc.isPdf()) {
      await inputDoc.applyPageOptions(pageOptions);
    }
  }
}
