import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../../parsing/common";
import { DateField, StringField } from "../../../parsing/standard";

/**
 * Carte Grise API version 1.1 document data.
 */
export class CarteGriseV1Document implements Prediction {
  /** The vehicle's license plate number. */
  a: StringField;
  /** The vehicle's first release date. */
  b: DateField;
  /** The vehicle owner's full name including maiden name. */
  c1: StringField;
  /** The vehicle owner's address. */
  c3: StringField;
  /** Number of owners of the license certificate. */
  c41: StringField;
  /** Mentions about the ownership of the vehicle. */
  c4A: StringField;
  /** The vehicle's brand. */
  d1: StringField;
  /** The vehicle's commercial name. */
  d3: StringField;
  /** The Vehicle Identification Number (VIN). */
  e: StringField;
  /** The vehicle's maximum admissible weight. */
  f1: StringField;
  /** The vehicle's maximum admissible weight within the license's state. */
  f2: StringField;
  /** The vehicle's maximum authorized weight with coupling. */
  f3: StringField;
  /** The document's formula number. */
  formulaNumber: StringField;
  /** The vehicle's weight with coupling if tractor different than category M1. */
  g: StringField;
  /** The vehicle's national empty weight. */
  g1: StringField;
  /** The car registration date of the given certificate. */
  i: DateField;
  /** The vehicle's category. */
  j: StringField;
  /** The vehicle's national type. */
  j1: StringField;
  /** The vehicle's body type (CE). */
  j2: StringField;
  /** The vehicle's body type (National designation). */
  j3: StringField;
  /** Machine Readable Zone, first line. */
  mrz1: StringField;
  /** Machine Readable Zone, second line. */
  mrz2: StringField;
  /** The vehicle's owner first name. */
  ownerFirstName: StringField;
  /** The vehicle's owner surname. */
  ownerSurname: StringField;
  /** The vehicle engine's displacement (cm3). */
  p1: StringField;
  /** The vehicle's maximum net power (kW). */
  p2: StringField;
  /** The vehicle's fuel type or energy source. */
  p3: StringField;
  /** The vehicle's administrative power (fiscal horsepower). */
  p6: StringField;
  /** The vehicle's power to weight ratio. */
  q: StringField;
  /** The vehicle's number of seats. */
  s1: StringField;
  /** The vehicle's number of standing rooms (person). */
  s2: StringField;
  /** The vehicle's sound level (dB). */
  u1: StringField;
  /** The vehicle engine's rotation speed (RPM). */
  u2: StringField;
  /** The vehicle's CO2 emission (g/km). */
  v7: StringField;
  /** Next technical control date. */
  x1: StringField;
  /** Amount of the regional proportional tax of the registration (in euros). */
  y1: StringField;
  /** Amount of the additional parafiscal tax of the registration (in euros). */
  y2: StringField;
  /** Amount of the additional CO2 tax of the registration (in euros). */
  y3: StringField;
  /** Amount of the fee for managing the registration (in euros). */
  y4: StringField;
  /** Amount of the fee for delivery of the registration certificate in euros. */
  y5: StringField;
  /** Total amount of registration fee to be paid in euros. */
  y6: StringField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.a = new StringField({
      prediction: rawPrediction["a"],
      pageId: pageId,
    });
    this.b = new DateField({
      prediction: rawPrediction["b"],
      pageId: pageId,
    });
    this.c1 = new StringField({
      prediction: rawPrediction["c1"],
      pageId: pageId,
    });
    this.c3 = new StringField({
      prediction: rawPrediction["c3"],
      pageId: pageId,
    });
    this.c41 = new StringField({
      prediction: rawPrediction["c41"],
      pageId: pageId,
    });
    this.c4A = new StringField({
      prediction: rawPrediction["c4a"],
      pageId: pageId,
    });
    this.d1 = new StringField({
      prediction: rawPrediction["d1"],
      pageId: pageId,
    });
    this.d3 = new StringField({
      prediction: rawPrediction["d3"],
      pageId: pageId,
    });
    this.e = new StringField({
      prediction: rawPrediction["e"],
      pageId: pageId,
    });
    this.f1 = new StringField({
      prediction: rawPrediction["f1"],
      pageId: pageId,
    });
    this.f2 = new StringField({
      prediction: rawPrediction["f2"],
      pageId: pageId,
    });
    this.f3 = new StringField({
      prediction: rawPrediction["f3"],
      pageId: pageId,
    });
    this.formulaNumber = new StringField({
      prediction: rawPrediction["formula_number"],
      pageId: pageId,
    });
    this.g = new StringField({
      prediction: rawPrediction["g"],
      pageId: pageId,
    });
    this.g1 = new StringField({
      prediction: rawPrediction["g1"],
      pageId: pageId,
    });
    this.i = new DateField({
      prediction: rawPrediction["i"],
      pageId: pageId,
    });
    this.j = new StringField({
      prediction: rawPrediction["j"],
      pageId: pageId,
    });
    this.j1 = new StringField({
      prediction: rawPrediction["j1"],
      pageId: pageId,
    });
    this.j2 = new StringField({
      prediction: rawPrediction["j2"],
      pageId: pageId,
    });
    this.j3 = new StringField({
      prediction: rawPrediction["j3"],
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
    this.ownerFirstName = new StringField({
      prediction: rawPrediction["owner_first_name"],
      pageId: pageId,
    });
    this.ownerSurname = new StringField({
      prediction: rawPrediction["owner_surname"],
      pageId: pageId,
    });
    this.p1 = new StringField({
      prediction: rawPrediction["p1"],
      pageId: pageId,
    });
    this.p2 = new StringField({
      prediction: rawPrediction["p2"],
      pageId: pageId,
    });
    this.p3 = new StringField({
      prediction: rawPrediction["p3"],
      pageId: pageId,
    });
    this.p6 = new StringField({
      prediction: rawPrediction["p6"],
      pageId: pageId,
    });
    this.q = new StringField({
      prediction: rawPrediction["q"],
      pageId: pageId,
    });
    this.s1 = new StringField({
      prediction: rawPrediction["s1"],
      pageId: pageId,
    });
    this.s2 = new StringField({
      prediction: rawPrediction["s2"],
      pageId: pageId,
    });
    this.u1 = new StringField({
      prediction: rawPrediction["u1"],
      pageId: pageId,
    });
    this.u2 = new StringField({
      prediction: rawPrediction["u2"],
      pageId: pageId,
    });
    this.v7 = new StringField({
      prediction: rawPrediction["v7"],
      pageId: pageId,
    });
    this.x1 = new StringField({
      prediction: rawPrediction["x1"],
      pageId: pageId,
    });
    this.y1 = new StringField({
      prediction: rawPrediction["y1"],
      pageId: pageId,
    });
    this.y2 = new StringField({
      prediction: rawPrediction["y2"],
      pageId: pageId,
    });
    this.y3 = new StringField({
      prediction: rawPrediction["y3"],
      pageId: pageId,
    });
    this.y4 = new StringField({
      prediction: rawPrediction["y4"],
      pageId: pageId,
    });
    this.y5 = new StringField({
      prediction: rawPrediction["y5"],
      pageId: pageId,
    });
    this.y6 = new StringField({
      prediction: rawPrediction["y6"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const outStr = `:a: ${this.a}
:b: ${this.b}
:c1: ${this.c1}
:c3: ${this.c3}
:c41: ${this.c41}
:c4a: ${this.c4A}
:d1: ${this.d1}
:d3: ${this.d3}
:e: ${this.e}
:f1: ${this.f1}
:f2: ${this.f2}
:f3: ${this.f3}
:g: ${this.g}
:g1: ${this.g1}
:i: ${this.i}
:j: ${this.j}
:j1: ${this.j1}
:j2: ${this.j2}
:j3: ${this.j3}
:p1: ${this.p1}
:p2: ${this.p2}
:p3: ${this.p3}
:p6: ${this.p6}
:q: ${this.q}
:s1: ${this.s1}
:s2: ${this.s2}
:u1: ${this.u1}
:u2: ${this.u2}
:v7: ${this.v7}
:x1: ${this.x1}
:y1: ${this.y1}
:y2: ${this.y2}
:y3: ${this.y3}
:y4: ${this.y4}
:y5: ${this.y5}
:y6: ${this.y6}
:Formula Number: ${this.formulaNumber}
:Owner's First Name: ${this.ownerFirstName}
:Owner's Surname: ${this.ownerSurname}
:MRZ Line 1: ${this.mrz1}
:MRZ Line 2: ${this.mrz2}`.trimEnd();
    return cleanOutString(outStr);
  }
}
