/**
 * Factory helper.
 */
import { StringDict } from "@/parsing/stringDict.js";
import { MindeeDeserializationError } from "@/errors/index.js";
import { ListField } from "./listField.js";
import { ObjectField } from "./objectField.js";
import { SimpleField } from "./simpleField.js";

export function createField(serverResponse: StringDict, indentLevel = 0) {
  if (typeof serverResponse !== "object" || serverResponse === null) {
    throw new MindeeDeserializationError(
      `Unrecognized field format ${JSON.stringify(serverResponse)}.`
    );
  }

  if ("items" in serverResponse) {
    return new ListField(serverResponse, indentLevel);
  }

  if ("fields" in serverResponse) {
    return new ObjectField(serverResponse, indentLevel);
  }

  if ("value" in serverResponse) {
    return new SimpleField(serverResponse, indentLevel);
  }

  throw new MindeeDeserializationError(
    `Unrecognized field format in ${JSON.stringify(serverResponse)}.`
  );
}
