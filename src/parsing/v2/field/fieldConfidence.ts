/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Confidence level of a field as returned by the V2 API.
 */
export enum FieldConfidence {
  Certain = "Certain",
  High    = "High",
  Medium  = "Medium",
  Low     = "Low",
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FieldConfidence {
  /**
   * Converts a FieldConfidence value to an integer.
   * @param confidence The FieldConfidence value to convert
   * @returns Integer representation (Certain=4, High=3, Medium=2, Low=1)
   */
  export function toInt(confidence: FieldConfidence | undefined): number {
    switch (confidence) {
    case FieldConfidence.Certain:
      return 4;
    case FieldConfidence.High:
      return 3;
    case FieldConfidence.Medium:
      return 2;
    case FieldConfidence.Low:
      return 1;
    default:
      throw new Error(`Unknown FieldConfidence value: ${confidence}`);
    }
  }

  /**
   * Checks if the first FieldConfidence is greater than the second.
   * @param a First FieldConfidence value
   * @param b Second FieldConfidence value
   * @returns true if a > b
   */
  export function greaterThan(a: FieldConfidence | undefined, b: FieldConfidence | undefined): boolean {
    return toInt(a) > toInt(b);
  }

  /**
   * Checks if the first FieldConfidence is greater than or equal to the second.
   * @param a First FieldConfidence value
   * @param b Second FieldConfidence value
   * @returns true if a >= b
   */
  export function greaterThanOrEqual(a: FieldConfidence | undefined, b: FieldConfidence | undefined): boolean {
    return toInt(a) >= toInt(b);
  }

  /**
   * Checks if the first FieldConfidence is less than the second.
   * @param a First FieldConfidence value
   * @param b Second FieldConfidence value
   * @returns true if a < b
   */
  export function lessThan(a: FieldConfidence | undefined, b: FieldConfidence | undefined): boolean {
    return toInt(a) < toInt(b);
  }

  /**
   * Checks if the first FieldConfidence is less than or equal to the second.
   * @param a First FieldConfidence value
   * @param b Second FieldConfidence value
   * @returns true if a <= b
   */
  export function lessThanOrEqual(a: FieldConfidence | undefined, b: FieldConfidence | undefined): boolean {
    return toInt(a) <= toInt(b);
  }

}
