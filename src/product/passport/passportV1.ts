import { Document, DocumentConstructorProps } from "../../parsing/common";
import { DateField, TextField, StringDict } from "../../parsing/standard";
import * as MRZ from "mrz";

export class PassportV1 extends Document {
  /** The country of issue. */
  country: TextField;
  /** The passport number. */
  idNumber: TextField;
  /** The date of birth of the passport holder. */
  birthDate: DateField;
  /** The expiration date of the passport. */
  expiryDate: DateField;
  /** The issuance date of the passport. */
  issuanceDate: DateField;
  /** The place of birth of the passport holder. */
  birthPlace: TextField;
  /** The sex or gender of the passport holder. */
  gender: TextField;
  /** The surname (last name) of the passport holder. */
  surname: TextField;
  /** The value of the first MRZ line. */
  mrz1: TextField;
  /** The value of the second MRZ line. */
  mrz2: TextField;
  /** List of first (given) names of the passport holder. */
  givenNames: TextField[] = [];
  /** The full name of the passport holder. */
  fullName: TextField;
  /** All the MRZ values combined. */
  mrz: TextField;

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
    this.country = new TextField({
      prediction: prediction.country,
      pageId: pageId,
    });
    this.idNumber = new TextField({
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
    this.birthPlace = new TextField({
      prediction: prediction.birth_place,
      pageId: pageId,
    });
    this.gender = new TextField({
      prediction: prediction.gender,
      pageId: pageId,
    });
    this.surname = new TextField({
      prediction: prediction.surname,
      pageId: pageId,
    });
    this.mrz1 = new TextField({
      prediction: prediction.mrz1,
      pageId: pageId,
    });
    this.mrz2 = new TextField({
      prediction: prediction.mrz2,
      pageId: pageId,
    });
    prediction.given_names.map((prediction: StringDict) =>
      this.givenNames.push(
        new TextField({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
    this.fullName = this.constructFullName(pageId) as TextField;
    this.mrz = this.constructMRZ(pageId) as TextField;
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
    const outStr = `----- Passport V1 -----
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

  private constructFullName(pageNumber?: number): TextField | undefined {
    if (
      this.surname &&
      this.givenNames.length > 0 &&
      this.givenNames[0].value
    ) {
      const fullName = {
        value: `${this.givenNames[0].value} ${this.surname.value}`,
        confidence: TextField.arrayConfidence([
          this.surname,
          this.givenNames[0],
        ]),
      };
      return new TextField({
        prediction: fullName,
        pageId: pageNumber,
        reconstructed: true,
      });
    }
  }

  private constructMRZ(pageNumber?: number): TextField | undefined {
    if (this.mrz1.value && this.mrz2.value) {
      const mrz = {
        value: `${this.mrz1.value}${this.mrz2.value}`,
        confidence: TextField.arrayConfidence([this.mrz1, this.mrz2]),
      };
      return new TextField({
        prediction: mrz,
        pageId: pageNumber,
        reconstructed: true,
      });
    }
  }
}
