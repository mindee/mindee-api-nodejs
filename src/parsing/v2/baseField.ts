export abstract class BaseField {
  protected _indentLevel: number;

  protected constructor(indentLevel = 0) {
    this._indentLevel = indentLevel;
  }
}
