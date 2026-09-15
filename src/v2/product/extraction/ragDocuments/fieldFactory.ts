/**
 * Factory helper.
 */
import { StringDict } from "@/parsing/stringDict.js";
import { MindeeDeserializationError } from "@/errors/index.js";
import { AnnotatedListField } from "./annotatedListField.js";
import { AnnotatedObjectField } from "./annotatedObjectField.js";
import { AnnotatedSimpleField } from "./annotatedSimpleField.js";

/**
 * Create an annotated field from a server response.
 * @param serverResponse Server response.
 */
export function createAnnotatedField(serverResponse: StringDict) {
  if (typeof serverResponse !== "object" || serverResponse === null) {
    throw new MindeeDeserializationError(
      `Unrecognized field format ${JSON.stringify(serverResponse)}.`
    );
  }

  if ("items" in serverResponse) {
    return new AnnotatedListField(serverResponse);
  }

  if ("fields" in serverResponse) {
    return new AnnotatedObjectField(serverResponse);
  }

  if ("value" in serverResponse) {
    return new AnnotatedSimpleField(
      serverResponse["value"],
      serverResponse["selected"],
      serverResponse["guidelines"]
    );
  }

  throw new MindeeDeserializationError(
    `Unrecognized field format in ${JSON.stringify(serverResponse)}.`
  );
}
