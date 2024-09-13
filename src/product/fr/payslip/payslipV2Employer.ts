import { cleanSpaces } from "../../../parsing/common/summaryHelper";
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Information about the employer.
 */
export class PayslipV2Employer {
  /** The address of the employer. */
  address: string | undefined;
  /** The company ID of the employer. */
  companyId: string | undefined;
  /** The site of the company. */
  companySite: string | undefined;
  /** The NAF code of the employer. */
  nafCode: string | undefined;
  /** The name of the employer. */
  name: string | undefined;
  /** The phone number of the employer. */
  phoneNumber: string | undefined;
  /** The URSSAF number of the employer. */
  urssafNumber: string | undefined;
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
    this.companyId = prediction["company_id"];
    this.companySite = prediction["company_site"];
    this.nafCode = prediction["naf_code"];
    this.name = prediction["name"];
    this.phoneNumber = prediction["phone_number"];
    this.urssafNumber = prediction["urssaf_number"];
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
      companyId: this.companyId ?? "",
      companySite: this.companySite ?? "",
      nafCode: this.nafCode ?? "",
      name: this.name ?? "",
      phoneNumber: this.phoneNumber ?? "",
      urssafNumber: this.urssafNumber ?? "",
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
      ", Company ID: " +
      printable.companyId +
      ", Company Site: " +
      printable.companySite +
      ", NAF Code: " +
      printable.nafCode +
      ", Name: " +
      printable.name +
      ", Phone Number: " +
      printable.phoneNumber +
      ", URSSAF Number: " +
      printable.urssafNumber
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Address: ${printable.address}
  :Company ID: ${printable.companyId}
  :Company Site: ${printable.companySite}
  :NAF Code: ${printable.nafCode}
  :Name: ${printable.name}
  :Phone Number: ${printable.phoneNumber}
  :URSSAF Number: ${printable.urssafNumber}`.trimEnd();
  }
}
