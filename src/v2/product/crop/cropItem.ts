import { FieldLocation } from "@/v2/parsing/inference/field/index.js";
import { StringDict } from "@/parsing/index.js";

export class CropItem {
  objectType: string;
  location: FieldLocation;

  constructor(serverResponse: StringDict) {
    this.objectType = serverResponse["objectType"];
    this.location = new FieldLocation(serverResponse["location"]);
  }

  toString(): string {
    return `${this.objectType}: ${this.location}`;
  }
}
