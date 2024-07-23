import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../../parsing/common";
import { HealthcareCardV1Copay } from "./healthcareCardV1Copay";
import { DateField, StringField } from "../../../parsing/standard";

/**
 * Healthcare Card API version 1.0 document data.
 */
export class HealthcareCardV1Document implements Prediction {
  /** The name of the company that provides the healthcare plan. */
  companyName: StringField;
  /** Is a fixed amount for a covered service. */
  copays: HealthcareCardV1Copay[] = [];
  /** The list of dependents covered by the healthcare plan. */
  dependents: StringField[] = [];
  /** The date when the member enrolled in the healthcare plan. */
  enrollmentDate: DateField;
  /** The group number associated with the healthcare plan. */
  groupNumber: StringField;
  /** The organization that issued the healthcare plan. */
  issuer80840: StringField;
  /** The unique identifier for the member in the healthcare system. */
  memberId: StringField;
  /** The name of the member covered by the healthcare plan. */
  memberName: StringField;
  /** The unique identifier for the payer in the healthcare system. */
  payerId: StringField;
  /** The BIN number for prescription drug coverage. */
  rxBin: StringField;
  /** The group number for prescription drug coverage. */
  rxGrp: StringField;
  /** The PCN number for prescription drug coverage. */
  rxPcn: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.companyName = new StringField({
      prediction: rawPrediction["company_name"],
      pageId: pageId,
    });
    rawPrediction["copays"] &&
      rawPrediction["copays"].map(
        (itemPrediction: StringDict) =>
          this.copays.push(
            new HealthcareCardV1Copay({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    rawPrediction["dependents"] &&
      rawPrediction["dependents"].map(
        (itemPrediction: StringDict) =>
          this.dependents.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.enrollmentDate = new DateField({
      prediction: rawPrediction["enrollment_date"],
      pageId: pageId,
    });
    this.groupNumber = new StringField({
      prediction: rawPrediction["group_number"],
      pageId: pageId,
    });
    this.issuer80840 = new StringField({
      prediction: rawPrediction["issuer_80840"],
      pageId: pageId,
    });
    this.memberId = new StringField({
      prediction: rawPrediction["member_id"],
      pageId: pageId,
    });
    this.memberName = new StringField({
      prediction: rawPrediction["member_name"],
      pageId: pageId,
    });
    this.payerId = new StringField({
      prediction: rawPrediction["payer_id"],
      pageId: pageId,
    });
    this.rxBin = new StringField({
      prediction: rawPrediction["rx_bin"],
      pageId: pageId,
    });
    this.rxGrp = new StringField({
      prediction: rawPrediction["rx_grp"],
      pageId: pageId,
    });
    this.rxPcn = new StringField({
      prediction: rawPrediction["rx_pcn"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const dependents = this.dependents.join("\n             ");
    let copaysSummary:string = "";
    if (this.copays && this.copays.length > 0) {
      const copaysColSizes:number[] = [14, 14];
      copaysSummary += "\n" + lineSeparator(copaysColSizes, "-") + "\n  ";
      copaysSummary += "| Service Fees ";
      copaysSummary += "| Service Name ";
      copaysSummary += "|\n" + lineSeparator(copaysColSizes, "=");
      copaysSummary += this.copays.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(copaysColSizes, "-")
      ).join("");
    }
    const outStr = `:Company Name: ${this.companyName}
:Member Name: ${this.memberName}
:Member ID: ${this.memberId}
:Issuer 80840: ${this.issuer80840}
:Dependents: ${dependents}
:Group Number: ${this.groupNumber}
:Payer ID: ${this.payerId}
:RX BIN: ${this.rxBin}
:RX GRP: ${this.rxGrp}
:RX PCN: ${this.rxPcn}
:copays: ${copaysSummary}
:Enrollment Date: ${this.enrollmentDate}`.trimEnd();
    return cleanOutString(outStr);
  }
}
