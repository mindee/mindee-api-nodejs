import { StringDict, cleanOutString } from "../../../parsing/common";
import { PositionField, StringField } from "../../../parsing/standard";

import { W9V1Document } from "./w9V1Document";

/**
 * W9 API version 1.0 page data.
 */
export class W9V1Page extends W9V1Document {
  /** The street address (number, street, and apt. or suite no.) of the applicant. */
  address: StringField;
  /** The business name or disregarded entity name, if different from Name. */
  businessName: StringField;
  /** The city, state, and ZIP code of the applicant. */
  cityStateZip: StringField;
  /** The employer identification number. */
  ein: StringField;
  /** Name as shown on the applicant's income tax return. */
  name: StringField;
  /** Position of the signature date on the document. */
  signatureDatePosition: PositionField;
  /** Position of the signature on the document. */
  signaturePosition: PositionField;
  /** The applicant's social security number. */
  ssn: StringField;
  /** The federal tax classification, which can vary depending on the revision date. */
  taxClassification: StringField;
  /** Depending on revision year, among S, C, P or D for Limited Liability Company Classification. */
  taxClassificationLlc: StringField;
  /** Tax Classification Other Details. */
  taxClassificationOtherDetails: StringField;
  /** The Revision month and year of the W9 form. */
  w9RevisionDate: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    super();

    this.address = new StringField({
      prediction: rawPrediction["address"],
      pageId: pageId,
    });
    this.businessName = new StringField({
      prediction: rawPrediction["business_name"],
      pageId: pageId,
    });
    this.cityStateZip = new StringField({
      prediction: rawPrediction["city_state_zip"],
      pageId: pageId,
    });
    this.ein = new StringField({
      prediction: rawPrediction["ein"],
      pageId: pageId,
    });
    this.name = new StringField({
      prediction: rawPrediction["name"],
      pageId: pageId,
    });
    this.signatureDatePosition = new PositionField({
      prediction: rawPrediction["signature_date_position"],
      pageId: pageId,
    });
    this.signaturePosition = new PositionField({
      prediction: rawPrediction["signature_position"],
      pageId: pageId,
    });
    this.ssn = new StringField({
      prediction: rawPrediction["ssn"],
      pageId: pageId,
    });
    this.taxClassification = new StringField({
      prediction: rawPrediction["tax_classification"],
      pageId: pageId,
    });
    this.taxClassificationLlc = new StringField({
      prediction: rawPrediction["tax_classification_llc"],
      pageId: pageId,
    });
    this.taxClassificationOtherDetails = new StringField({
      prediction: rawPrediction["tax_classification_other_details"],
      pageId: pageId,
    });
    this.w9RevisionDate = new StringField({
      prediction: rawPrediction["w9_revision_date"],
      pageId: pageId,
    });
  }

  toString(): string {
    const outStr = `:Name: ${this.name}
:SSN: ${this.ssn}
:Address: ${this.address}
:City State Zip: ${this.cityStateZip}
:Business Name: ${this.businessName}
:EIN: ${this.ein}
:Tax Classification: ${this.taxClassification}
:Tax Classification Other Details: ${this.taxClassificationOtherDetails}
:W9 Revision Date: ${this.w9RevisionDate}
:Signature Position: ${this.signaturePosition}
:Signature Date Position: ${this.signatureDatePosition}
:Tax Classification LLC: ${this.taxClassificationLlc}`.trimEnd();
    return cleanOutString(outStr);
  }
}
