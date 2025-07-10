import { StringDict } from "../common";
import { ListField } from "./listField";
import { ObjectField } from "./objectField";
import { SimpleField } from "./simpleField";

export class InferenceFields extends Map<string, SimpleField | ObjectField | ListField> {
  protected _indentLevel: number;

  constructor(serverResponse: StringDict, indentLevel = 0) {
    super(serverResponse.entries());
    this._indentLevel = indentLevel;
  }
}
