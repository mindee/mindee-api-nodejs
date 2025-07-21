/**
 * Factory helper.
 */
import { StringDict } from "../../common";
import { MindeeApiV2Error } from "../../../errors/mindeeError";
import { ListField } from "./listField";
import { ObjectField } from "./objectField";
import { SimpleField } from "./simpleField";

export function createField(serverResponse: StringDict, indentLevel = 0) {
  if (typeof serverResponse !== "object" || serverResponse === null) {
    throw new MindeeApiV2Error(
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

  throw new MindeeApiV2Error(
    `Unrecognized field format in ${JSON.stringify(serverResponse)}.`
  );
}
