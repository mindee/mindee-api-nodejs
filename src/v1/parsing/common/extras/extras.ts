export abstract class ExtraField {
}

interface ExtraDict<T extends ExtraField> {
  [key: string]: T | (() => string);
}

export class Extras<ExtraT extends ExtraField = ExtraField>
implements ExtraDict<ExtraT> {
  [key: string]: ExtraT | (() => string);

  constructor(fields: Record<string, ExtraT>) {
    if (Object.keys(fields).length > 0) {
      Object.keys(fields).forEach(
        (name: string) => (this[name] = fields[name])
      );
    }
  }

  /**
   * Default string representation.
   */
  toString(): string {
    return (
      Object.entries(this)
        .map(([name, extraField]) => name + ":\n" + extraField.toString())
        .join("\n") + "\n"
    );
  }
}
