import { promises as fs } from "fs";
import path from "path";
import { Passport } from "../../mindee/documents";
import { expect } from "chai";
import * as api_path from "../data/apiPaths.json";

describe("Passport Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(api_path.passports.all_na)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const passport = new Passport({
      apiPrediction: response.document.inference.pages[0].prediction,
      documentType: "passport",
    });
    expect(passport.documentType).to.be.equals("passport");
    expect(passport.birthDate.value).to.be.undefined;
    expect(passport.isExpired()).to.be.true;
    expect(passport.surname.value).to.be.undefined;
    expect(passport.issuanceDate.value).to.be.undefined;
    expect(passport.expiryDate.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.passports.all));
    const response = JSON.parse(jsonData.toString());
    const passport = new Passport({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    const to_string = await fs.readFile(
      path.join(api_path.passports.docToString)
    );

    expect(passport.birthDate.confidence).to.be.equals(0.98);
    expect(passport.expiryDate.confidence).to.be.equals(0.98);
    expect(passport.idNumber.confidence).to.be.equals(1);
    expect(passport.surname.confidence).to.be.equals(1);
    expect(passport.country.confidence).to.be.equals(1);
    expect(passport.toString()).to.be.equals(to_string.toString());
  });
});
