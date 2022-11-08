import { Document, DocumentConstructorProps } from "../document";
import { Field, DateField } from "../../fields";
// @ts-ignore
import * as MRZ from "mrz";

export class PassportV1 extends Document {
  /** The country of issue. */
  country: Field;
  /** The passport number. */
  idNumber: Field;
  /** The date of birth of the passport holder. */
  birthDate: DateField;
  /** The expiration date of the passport. */
  expiryDate: DateField;
  /** The issuance date.*/
  issuanceDate: DateField;
  /** The place of birth of the passport holder. */
  birthPlace: Field;
  /** The sex or gender of the passport holder. */
  gender: Field;
  /** The surname of the person. */
  surname: Field;
  /** The value of the first mrz line. */
  mrz1: Field;
  /** The value of the second mrz line. */
  mrz2: Field;
  /** The names of the person. */
  givenNames: Field[] = [];
  /** The full name of the persone. */
  fullName: Field;
  /** All the mrz values combined. */
  mrz: Field;

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      extras: extras,
    });
    this.country = new Field({
      prediction: prediction.country,
      pageId: pageId,
    });
    this.idNumber = new Field({
      prediction: prediction.id_number,
      pageId: pageId,
    });
    this.birthDate = new DateField({
      prediction: prediction.birth_date,
      pageId: pageId,
    });
    this.expiryDate = new DateField({
      prediction: prediction.expiry_date,
      pageId: pageId,
    });
    this.issuanceDate = new DateField({
      prediction: prediction.issuance_date,
      pageId: pageId,
    });
    this.birthPlace = new Field({
      prediction: prediction.birth_place,
      pageId: pageId,
    });
    this.gender = new Field({
      prediction: prediction.gender,
      pageId: pageId,
    });
    this.surname = new Field({
      prediction: prediction.surname,
      pageId: pageId,
    });
    this.mrz1 = new Field({
      prediction: prediction.mrz1,
      pageId: pageId,
    });
    this.mrz2 = new Field({
      prediction: prediction.mrz2,
      pageId: pageId,
    });
    prediction.given_names.map((prediction: { [index: string]: any }) =>
      this.givenNames.push(
        new Field({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    this.fullName = this.constructFullName(pageId) as Field;
    this.mrz = this.constructMRZ(pageId) as Field;
    this.#checklist();
  }

  #checklist() {
    if (this.mrz1.value && this.mrz2.value) {
      const mrz = MRZ.parse([this.mrz1.value, this.mrz2.value]);
      this.checklist = {
        mrzValid: this.isMRZValid(mrz),
        mrzValidBirthDate: this.isBirthDateValid(mrz),
        mrzValidExpiryDate: this.isExpiryDateValid(mrz),
        mrzValidIdNumber: this.isIdNumberValid(mrz),
        mrzValidSurname: this.isSurnameValid(mrz),
        mrzValidCountry: this.isCountryValid(mrz),
      };
    }
  }

  static convertMRZDateToDatetime(dateString: string): Date {
    const year: number = parseInt(dateString.substring(0, 2));
    const month: number = parseInt(dateString.substring(2, 4));
    const day: number = parseInt(dateString.substring(4, 6));

    // month is 0 indexed, day is 1 indexed... because JavaScript ...
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  toString(): string {
    const outStr = `-----Passport data-----
Filename: ${this.filename}
Full name: ${this.fullName}
Given names: ${this.givenNames.map((name) => name.value).join(" ")}
Surname: ${this.surname}
Country: ${this.country}
ID Number: ${this.idNumber}
Issuance date: ${this.issuanceDate}
Birth date: ${this.birthDate}
Expiry date: ${this.expiryDate}
MRZ 1: ${this.mrz1}
MRZ 2: ${this.mrz2}
MRZ: ${this.mrz}
----------------------
`;
    return PassportV1.cleanOutString(outStr);
  }

  isExpired(): boolean {
    const dateTime = new Date();
    if (this.expiryDate.dateObject) {
      return this.expiryDate.dateObject < dateTime;
    }
    return true;
  }

  private isMRZValid(mrz: any): boolean {
    const check = mrz.valid;
    if (check) this.mrz.confidence = 1.0;
    return check;
  }

  private isBirthDateValid(mrz: any): boolean {
    if (this.birthDate.dateObject === undefined || !mrz.fields.birthDate) {
      return false;
    }
    const mrzDate: Date = PassportV1.convertMRZDateToDatetime(
      mrz.fields.birthDate
    );
    const check = DateField.compareDates(this.birthDate.dateObject, mrzDate);
    if (check) {
      this.birthDate.confidence = 1.0;
    }
    return check;
  }

  private isExpiryDateValid(mrz: any): boolean {
    if (
      this.expiryDate.dateObject === undefined ||
      !mrz.fields.expirationDate
    ) {
      return false;
    }
    const mrzDate: Date = PassportV1.convertMRZDateToDatetime(
      mrz.fields.expirationDate
    );
    const check = DateField.compareDates(this.expiryDate.dateObject, mrzDate);
    if (check) {
      this.expiryDate.confidence = 1.0;
    }
    return check;
  }

  private isIdNumberValid(mrz: any): boolean {
    const check =
      mrz.fields.documentNumber &&
      mrz.fields.documentNumber === this.idNumber.value;
    if (check) this.idNumber.confidence = 1.0;
    return check;
  }

  private isSurnameValid(mrz: any): boolean {
    const check = mrz.fields.lastName === this.surname.value;
    if (check) this.surname.confidence = 1.0;
    return check;
  }

  private isCountryValid(mrz: any): boolean {
    const check = mrz.fields.nationality === this.country.value;
    if (check) this.country.confidence = 1.0;
    return check;
  }

  private constructFullName(pageNumber?: number): Field | undefined {
    if (
      this.surname &&
      this.givenNames.length > 0 &&
      this.givenNames[0].value
    ) {
      const fullName = {
        value: `${this.givenNames[0].value} ${this.surname.value}`,
        confidence: Field.arrayConfidence([this.surname, this.givenNames[0]]),
      };
      return new Field({
        prediction: fullName,
        pageId: pageNumber,
        reconstructed: true,
      });
    }
  }

  private constructMRZ(pageNumber?: number): Field | undefined {
    if (this.mrz1.value && this.mrz2.value) {
      const mrz = {
        value: `${this.mrz1.value}${this.mrz2.value}`,
        confidence: Field.arrayConfidence([this.mrz1, this.mrz2]),
      };
      return new Field({
        prediction: mrz,
        pageId: pageNumber,
        reconstructed: true,
      });
    }
  }
}
