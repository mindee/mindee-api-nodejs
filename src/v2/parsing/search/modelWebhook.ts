import { StringDict } from "@/parsing/index.js";

/**
 * Information about a model's webhook.
 */
export class ModelWebhook {
  /**
   * ID of the webhook.
   */
  public id: string;

  /**
   * Name of the webhook.
   */
  public name: string;

  /**
   * URL of the webhook.
   */
  public url: string;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.name = serverResponse["name"];
    this.url = serverResponse["url"];
  }
}
