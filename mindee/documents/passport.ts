import { Document, DocumentConstructorProps } from "./document";
import { Field, DateField } from "./fields";
// @ts-ignore
import * as MRZ from "mrz";

interface PassportConstructorProps extends DocumentConstructorProps {
  documentType?: string;
}

export class Passport extends Document {
  country: Field;
  idNumber: Field;
  birthDate: DateField;
  expiryDate: DateField;
  issuanceDate: DateField;
  birthPlace: Field;
  gender: Field;
  surname: Field;
  mrz1: Field;
  mrz2: Field;
  givenNames: Field[] = [];
  fullName: Field;
  mrz: Field;

  constructor({
    apiPrediction,
    inputFile = undefined,
    pageNumber = undefined,
    documentType = "",
  }: PassportConstructorProps) {
    super(documentType, inputFile, pageNumber);
    this.country = new Field({ prediction: apiPrediction.country, pageNumber });
    this.idNumber = new Field({
      prediction: apiPrediction.id_number,
      pageNumber,
    });
    this.birthDate = new DateField({
      prediction: apiPrediction.birth_date,
      valueKey: "value",
      pageNumber,
    });
    this.expiryDate = new DateField({
      prediction: apiPrediction.expiry_date,
      valueKey: "value",
      pageNumber,
    });
    this.issuanceDate = new DateField({
      prediction: apiPrediction.issuance_date,
      valueKey: "value",
      pageNumber,
    });
    this.birthPlace = new Field({
      prediction: apiPrediction.birth_place,
      pageNumber,
    });
    this.gender = new Field({ prediction: apiPrediction.gender, pageNumber });
    this.surname = new Field({ prediction: apiPrediction.surname, pageNumber });
    this.mrz1 = new Field({ prediction: apiPrediction.mrz1, pageNumber });
    this.mrz2 = new Field({ prediction: apiPrediction.mrz2, pageNumber });
    apiPrediction.given_names.map((prediction: { [index: string]: any }) =>
      this.givenNames.push(
        new Field({
          prediction: prediction,
          pageNumber,
        })
      )
    );
    this.fullName = this.constructFullName(pageNumber) as Field;
    this.mrz = this.constructMRZ(pageNumber) as Field;
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
    return Passport.cleanOutString(outStr);
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
    const mrzDate: Date = Passport.convertMRZDateToDatetime(
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
    const mrzDate: Date = Passport.convertMRZDateToDatetime(
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
        pageNumber: pageNumber,
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
        pageNumber: pageNumber,
        reconstructed: true,
      });
    }
  }
}
