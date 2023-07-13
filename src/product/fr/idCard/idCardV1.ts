import { Inference, DocumentConstructorProps } from "../../../parsing/common";
import { TextField, DateField, BaseField } from "../../../parsing/standard";

export class IdCardV1 extends Inference {
  endpointName ='idcard_fr';
  endpointVersion = '1';
  /** The authority which has issued the card. */
  authority: TextField;
  /** Indicates if it is the recto side, the verso side or both. */
  documentSide: BaseField;
  /** The id number of the card. */
  idNumber: TextField;
  /** The birth date of the person. */
  birthDate: DateField;
  /** The expiry date of the card. */
  expiryDate: DateField;
  /** The birth place of the person. */
  birthPlace: TextField;
  /** The gender of the person. */
  gender: TextField;
  /** The first mrz value. */
  mrz1: TextField;
  /** The second mrz value. */
  mrz2: TextField;
  /** The surname of the person. */
  surname: TextField;
  /** The list of the names of the person. */
  givenNames: TextField[] = [];

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
    this.authority = new TextField({
      prediction: prediction.authority,
      pageId: pageId,
    });
    this.documentSide = new BaseField({
      prediction: prediction.document_side,
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
    prediction.given_names.map((prediction: { [index: string]: any }) =>
      this.givenNames.push(
        new TextField({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const outStr = `----- FR Carte Nationale d'Identité V1 -----
Filename: ${this.filename}
Document Side: ${this.documentSide}
Identity Number: ${this.idNumber}
Given Name(s): ${this.givenNames.map((name) => name.value).join(" ")}
Surname: ${this.surname}
Date of Birth: ${this.birthDate}
Place of Birth: ${this.birthPlace}
Expiry Date: ${this.expiryDate}
Issuing Authority: ${this.authority}
Gender: ${this.gender}
MRZ Line 1: ${this.mrz1}
MRZ Line 2: ${this.mrz2}
----------------------
`;
    return IdCardV1.cleanOutString(outStr);
  }
}
