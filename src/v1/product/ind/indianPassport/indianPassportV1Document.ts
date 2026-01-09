import {
  Prediction,
  StringDict,
  cleanOutString,
} from "@/v1/parsing/common/index.js";
import {
  ClassificationField,
  DateField,
  StringField,
} from "@/v1/parsing/standard/index.js";

/**
 * Passport - India API version 1.2 document data.
 */
export class IndianPassportV1Document implements Prediction {
  /** The first line of the address of the passport holder. */
  address1: StringField;
  /** The second line of the address of the passport holder. */
  address2: StringField;
  /** The third line of the address of the passport holder. */
  address3: StringField;
  /** The birth date of the passport holder, ISO format: YYYY-MM-DD. */
  birthDate: DateField;
  /** The birth place of the passport holder. */
  birthPlace: StringField;
  /** ISO 3166-1 alpha-3 country code (3 letters format). */
  country: StringField;
  /** The date when the passport will expire, ISO format: YYYY-MM-DD. */
  expiryDate: DateField;
  /** The file number of the passport document. */
  fileNumber: StringField;
  /** The gender of the passport holder. */
  gender: ClassificationField;
  /** The given names of the passport holder. */
  givenNames: StringField;
  /** The identification number of the passport document. */
  idNumber: StringField;
  /** The date when the passport was issued, ISO format: YYYY-MM-DD. */
  issuanceDate: DateField;
  /** The place where the passport was issued. */
  issuancePlace: StringField;
  /** The name of the legal guardian of the passport holder (if applicable). */
  legalGuardian: StringField;
  /** The first line of the machine-readable zone (MRZ) of the passport document. */
  mrz1: StringField;
  /** The second line of the machine-readable zone (MRZ) of the passport document. */
  mrz2: StringField;
  /** The name of the mother of the passport holder. */
  nameOfMother: StringField;
  /** The name of the spouse of the passport holder (if applicable). */
  nameOfSpouse: StringField;
  /** The date of issue of the old passport (if applicable), ISO format: YYYY-MM-DD. */
  oldPassportDateOfIssue: DateField;
  /** The number of the old passport (if applicable). */
  oldPassportNumber: StringField;
  /** The place of issue of the old passport (if applicable). */
  oldPassportPlaceOfIssue: StringField;
  /** The page number of the passport document. */
  pageNumber: ClassificationField;
  /** The surname of the passport holder. */
  surname: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.address1 = new StringField({
      prediction: rawPrediction["address1"],
      pageId: pageId,
    });
    this.address2 = new StringField({
      prediction: rawPrediction["address2"],
      pageId: pageId,
    });
    this.address3 = new StringField({
      prediction: rawPrediction["address3"],
      pageId: pageId,
    });
    this.birthDate = new DateField({
      prediction: rawPrediction["birth_date"],
      pageId: pageId,
    });
    this.birthPlace = new StringField({
      prediction: rawPrediction["birth_place"],
      pageId: pageId,
    });
    this.country = new StringField({
      prediction: rawPrediction["country"],
      pageId: pageId,
    });
    this.expiryDate = new DateField({
      prediction: rawPrediction["expiry_date"],
      pageId: pageId,
    });
    this.fileNumber = new StringField({
      prediction: rawPrediction["file_number"],
      pageId: pageId,
    });
    this.gender = new ClassificationField({
      prediction: rawPrediction["gender"],
    });
    this.givenNames = new StringField({
      prediction: rawPrediction["given_names"],
      pageId: pageId,
    });
    this.idNumber = new StringField({
      prediction: rawPrediction["id_number"],
      pageId: pageId,
    });
    this.issuanceDate = new DateField({
      prediction: rawPrediction["issuance_date"],
      pageId: pageId,
    });
    this.issuancePlace = new StringField({
      prediction: rawPrediction["issuance_place"],
      pageId: pageId,
    });
    this.legalGuardian = new StringField({
      prediction: rawPrediction["legal_guardian"],
      pageId: pageId,
    });
    this.mrz1 = new StringField({
      prediction: rawPrediction["mrz1"],
      pageId: pageId,
    });
    this.mrz2 = new StringField({
      prediction: rawPrediction["mrz2"],
      pageId: pageId,
    });
    this.nameOfMother = new StringField({
      prediction: rawPrediction["name_of_mother"],
      pageId: pageId,
    });
    this.nameOfSpouse = new StringField({
      prediction: rawPrediction["name_of_spouse"],
      pageId: pageId,
    });
    this.oldPassportDateOfIssue = new DateField({
      prediction: rawPrediction["old_passport_date_of_issue"],
      pageId: pageId,
    });
    this.oldPassportNumber = new StringField({
      prediction: rawPrediction["old_passport_number"],
      pageId: pageId,
    });
    this.oldPassportPlaceOfIssue = new StringField({
      prediction: rawPrediction["old_passport_place_of_issue"],
      pageId: pageId,
    });
    this.pageNumber = new ClassificationField({
      prediction: rawPrediction["page_number"],
    });
    this.surname = new StringField({
      prediction: rawPrediction["surname"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const outStr = `:Page Number: ${this.pageNumber}
:Country: ${this.country}
:ID Number: ${this.idNumber}
:Given Names: ${this.givenNames}
:Surname: ${this.surname}
:Birth Date: ${this.birthDate}
:Birth Place: ${this.birthPlace}
:Issuance Place: ${this.issuancePlace}
:Gender: ${this.gender}
:Issuance Date: ${this.issuanceDate}
:Expiry Date: ${this.expiryDate}
:MRZ Line 1: ${this.mrz1}
:MRZ Line 2: ${this.mrz2}
:Legal Guardian: ${this.legalGuardian}
:Name of Spouse: ${this.nameOfSpouse}
:Name of Mother: ${this.nameOfMother}
:Old Passport Date of Issue: ${this.oldPassportDateOfIssue}
:Old Passport Number: ${this.oldPassportNumber}
:Old Passport Place of Issue: ${this.oldPassportPlaceOfIssue}
:Address Line 1: ${this.address1}
:Address Line 2: ${this.address2}
:Address Line 3: ${this.address3}
:File Number: ${this.fileNumber}`.trimEnd();
    return cleanOutString(outStr);
  }
}
