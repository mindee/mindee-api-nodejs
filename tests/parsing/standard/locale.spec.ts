import { LocaleField } from "../../../src/parsing/standard";
import { expect } from "chai";

describe("Test LocaleField field", () => {
  it("Should create a LocaleField", () => {
    const prediction = {
      value: "en-EN",
      language: "en",
      country: "uk",
      currency: "GBP",
      confidence: 0.1,
    };
    const field = new LocaleField({ prediction });
    expect(field.value).to.be.equal("en-EN");
    expect(field.language).to.be.equal("en");
    expect(field.country).to.be.equal("uk");
    expect(field.currency).to.be.equal("GBP");
    expect(field.confidence).to.be.equal(0.1);
  });

  it("Should create a LocaleField without the value property", () => {
    const prediction = {
      language: "fr",
      country: "fr",
      currency: "EUR",
      confidence: 0.15,
    };
    const field = new LocaleField({ prediction });
    expect(field.value).to.be.be.equal("fr");
    expect(field.language).to.be.equal("fr");
    expect(field.country).to.be.equal("fr");
    expect(field.currency).to.be.equal("EUR");
    expect(field.confidence).to.be.equal(0.15);
  });

  it("Should create a LocaleField with mainly empty fields", () => {
    const prediction = {
      value: "en-EN",
      confidence: 0.1,
    };
    const field = new LocaleField({ prediction });
    expect(field.language).to.be.undefined;
    expect(field.country).to.be.undefined;
    expect(field.currency).to.be.undefined;
  });
});
