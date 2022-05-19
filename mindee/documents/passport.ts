import { Document } from "./document";
import { Field, DateField } from "./fields";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as MRZ from "mrz";

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
  givenNames: Field[];
  fullName: Field;
  mrz: Field;

  constructor({ apiPrediction, inputFile, pageNumber, documentType }: any) {
    super(documentType, inputFile);
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
    this.givenNames = this.#getGivenNames(
      apiPrediction.given_names,
      pageNumber
    );
    this.fullName = this.constructFullName(pageNumber) as Field;
    this.mrz = this.constructMRZ(pageNumber) as Field;
    this.#checkMRZ();
  }

  #getGivenNames(givenNames: any, pageNumber: number): Field[] {
    const result: Field[] = [];
    givenNames.forEach((givenName: any) => {
      result.push(new Field({ prediction: givenName, pageNumber }));
    });
    return result;
  }

  #checkMRZ() {
    let checks = {};
    if (this.mrz1.value && this.mrz2.value) {
      const mrz = MRZ.parse([this.mrz1.value, this.mrz2.value]);
      checks = {
        mrzValid: this.isMRZValid(mrz),
        mrzValidBirthDate: this.isBirthDateValid(mrz),
        mrzValidExpiryDate: this.isExpiryDateValid(mrz),
        mrzValidIdNumber: this.isIdNumberValid(mrz),
        mrzValidSurname: this.isSurnameValid(mrz),
        mrzValidCountry: this.isCountryValid(mrz),
      };
      this.checklist = { ...checks };
      return this.checklist;
    }
  }

  static convertMRZDateToDatetime(dateString: string): Date {
    const year = dateString.substring(0, 2) as string;
    const month = dateString.substring(2, 4) as string;
    const day = dateString.substring(4, 6) as string;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Date(Number(year), Number(month) - 1, Number(day) + 1);
  }

  #compareDates(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  toString() {
    return `-----Passport data-----
Full name: ${this.fullName.value}
Given names: ${this.givenNames.map((name) => name.value)}
Surname: ${this.surname.value}
Country: ${this.country.value}
ID Number: ${this.idNumber.value}
Issuance date: ${this.issuanceDate.value}
Birth date: ${this.birthDate.value}
Expiry date: ${this.expiryDate.value}
MRZ 1: ${this.mrz1.value}
MRZ 2: ${this.mrz2.value}
MRZ: ${this.mrz.value}
----------------------
`;
  }

  isExpired(): boolean {
    const dateTime = new Date();
    if (this.expiryDate.dateObject) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (this.expiryDate as DateField).dateObject < dateTime;
    }
    return true;
  }

  isMRZValid(mrz: any): boolean {
    const check = mrz.valid;
    if (check) this.mrz.confidence = 1.0;
    return check;
  }

  isBirthDateValid(mrz: any): boolean {
    const check =
      mrz.fields.birthDate &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Passport.convertMRZDateToDatetime(mrz.fields.birthDate) ===
        this.birthDate.dateObject;
    if (check) this.birthDate.confidence = 1.0;
    return check;
  }

  isExpiryDateValid(mrz: any): boolean {
    const check =
      mrz.fields.expirationDate &&
      mrz.fields.expirationDate === this.expiryDate.value;
    if (check) this.expiryDate.confidence = 1.0;
    return check;
  }

  isIdNumberValid(mrz: any): boolean {
    const check =
      mrz.fields.documentNumber &&
      mrz.fields.documentNumber === this.idNumber.value;
    if (check) this.idNumber.confidence = 1.0;
    return check;
  }

  isSurnameValid(mrz: any): boolean {
    const check = mrz.fields.lastName === this.surname.value;
    if (check) this.surname.confidence = 1.0;
    return check;
  }

  isCountryValid(mrz: any): boolean {
    const check = mrz.fields.nationality === this.country.value;
    if (check) this.country.confidence = 1.0;
    return check;
  }

  constructFullName(pageNumber: number): Field | undefined {
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

  constructMRZ(pageNumber: number): Field | undefined {
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
