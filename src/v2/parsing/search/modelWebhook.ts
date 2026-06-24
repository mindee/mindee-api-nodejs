import { StringDict } from "@/parsing/stringDict.js";

/**
 * Information about a model's webhook.
 */
export class ModelWebhook {
  /** ID of the webhook. */
  public id: string;
  /** Name of the webhook. */
  public name: string;
  /** URL of the webhook. */
  public url: string;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.name = serverResponse["name"];
    this.url = serverResponse["url"];
  }

  /**
   * String representation of the webhook.
   */
  toString(): string {
    return `:Name: ${this.name}\n:ID: ${this.id}\n:URL: ${this.url}`;
  }
}
