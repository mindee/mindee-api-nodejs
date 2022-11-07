import { Document, DocumentConstructorProps } from "../../document";
import { Field, DateField, BaseField } from "../../../fields";

export class IdCardV1 extends Document {
  authority: Field;
  documentSide: BaseField;
  idNumber: Field;
  birthDate: DateField;
  expiryDate: DateField;
  birthPlace: Field;
  gender: Field;
  mrz1: Field;
  mrz2: Field;
  surname: Field;
  givenNames: Field[] = [];

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
    this.authority = new Field({
      prediction: prediction.authority,
      pageId: pageId,
    });
    this.documentSide = new BaseField({
      prediction: prediction.document_side,
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
  }

  toString(): string {
    const outStr = `-----FR Id card data-----
Filename: ${this.filename}
Document side: ${this.documentSide}
Authority: ${this.authority}
Given names: ${this.givenNames.map((name) => name.value).join(" ")}
Surname: ${this.surname}
Gender: ${this.gender}
ID Number: ${this.idNumber}
Birth date: ${this.birthDate}
Birth place: ${this.birthPlace}
Expiry date: ${this.expiryDate}
MRZ 1: ${this.mrz1}
MRZ 2: ${this.mrz2}
----------------------
`;
    return IdCardV1.cleanOutString(outStr);
  }
}