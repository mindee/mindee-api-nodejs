
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Information about the employee.
 */
export class PayslipV2Employee {
  /** The address of the employee. */
  address: string | null;
  /** The date of birth of the employee. */
  dateOfBirth: string | null;
  /** The first name of the employee. */
  firstName: string | null;
  /** The last name of the employee. */
  lastName: string | null;
  /** The phone number of the employee. */
  phoneNumber: string | null;
  /** The registration number of the employee. */
  registrationNumber: string | null;
  /** The social security number of the employee. */
  socialSecurityNumber: string | null;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = [];

  constructor({ prediction = {} }: StringDict) {
    this.address = prediction["address"];
    this.dateOfBirth = prediction["date_of_birth"];
    this.firstName = prediction["first_name"];
    this.lastName = prediction["last_name"];
    this.phoneNumber = prediction["phone_number"];
    this.registrationNumber = prediction["registration_number"];
    this.socialSecurityNumber = prediction["social_security_number"];
    this.pageId = prediction["page_id"];
    this.confidence = prediction["confidence"] ? prediction.confidence : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction.polygon;
    }
  }

  /**
   * Collection of fields as representable strings.
   */
  #printableValues() {
    return {
      address: this.address ?? "",
      dateOfBirth: this.dateOfBirth ?? "",
      firstName: this.firstName ?? "",
      lastName: this.lastName ?? "",
      phoneNumber: this.phoneNumber ?? "",
      registrationNumber: this.registrationNumber ?? "",
      socialSecurityNumber: this.socialSecurityNumber ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Address: " +
      printable.address +
      ", Date of Birth: " +
      printable.dateOfBirth +
      ", First Name: " +
      printable.firstName +
      ", Last Name: " +
      printable.lastName +
      ", Phone Number: " +
      printable.phoneNumber +
      ", Registration Number: " +
      printable.registrationNumber +
      ", Social Security Number: " +
      printable.socialSecurityNumber
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Address: ${printable.address}
  :Date of Birth: ${printable.dateOfBirth}
  :First Name: ${printable.firstName}
  :Last Name: ${printable.lastName}
  :Phone Number: ${printable.phoneNumber}
  :Registration Number: ${printable.registrationNumber}
  :Social Security Number: ${printable.socialSecurityNumber}`.trimEnd();
  }
}
