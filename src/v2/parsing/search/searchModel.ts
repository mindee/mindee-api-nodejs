import { StringDict } from "@/parsing/stringDict.js";
import { ModelWebhook } from "./modelWebhook.js";

/**
 * Individual model information returned by the `search/models` endpoint.
 */
export class SearchModel {
  /** ID of the model. */
  public id: string;
  /** Name of the model. */
  public name: string;
  /** Type of the model. */
  public modelType: string;
  /** List of webhooks associated with the model. */
  public webhooks: ModelWebhook[];

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.name = serverResponse["name"];
    this.modelType = serverResponse["model_type"];
    this.webhooks = Array.isArray(serverResponse["webhooks"])
      ? serverResponse["webhooks"].map((w: StringDict) => new ModelWebhook(w))
      : [];
  }

  /**
   * String representation of the model.
   */
  toString(): string {
    return `:Name: ${this.name}\n:ID: ${this.id}\n:Model Type: ${this.modelType}`;
  }
}
