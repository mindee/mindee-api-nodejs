import { StringDict } from "@/parsing/index.js";
import { ModelWebhook } from "./modelWebhook.js";

/**
 * Models search response.
 */
export class SearchModel {
  /**
   * ID of the model.
   */
  public id: string;

  /**
   * Name of the model.
   */
  public name: string;

  /**
   * Type of the model.
   */
  public modelType: string;

  /**
   * Webhooks associated with the model.
   */
  public webhooks: ModelWebhook[];

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.name = serverResponse["name"];
    this.modelType = serverResponse["model_type"];
    this.webhooks = (serverResponse["webhooks"] ?? []).map(
      (webhook: StringDict) => new ModelWebhook(webhook)
    );
  }

  toString(): string {
    return [
      `:Name: ${this.name}`,
      `:ID: ${this.id}`,
      `:Model Type: ${this.modelType}`,
    ].join("\n");
  }
}
