import { Locale } from "../../src/fields";
import { expect } from "chai";

describe("Test Locale field", () => {
  it("Should create a Locale", () => {
    const prediction = {
      value: "en-EN",
      language: "en",
      country: "uk",
      currency: "GBP",
      confidence: 0.1,
    };
    const locale = new Locale({ prediction });
    expect(locale.value).to.be.equal("en-EN");
    expect(locale.language).to.be.equal("en");
    expect(locale.country).to.be.equal("uk");
    expect(locale.currency).to.be.equal("GBP");
    expect(locale.confidence).to.be.equal(0.1);
  });

  it("Should create a Locale without the value property", () => {
    const prediction = {
      language: "fr",
      country: "fr",
      currency: "EUR",
      confidence: 0.15,
    };
    const locale = new Locale({ prediction });
    expect(locale.value).to.be.be.equal("fr");
    expect(locale.language).to.be.equal("fr");
    expect(locale.country).to.be.equal("fr");
    expect(locale.currency).to.be.equal("EUR");
    expect(locale.confidence).to.be.equal(0.15);
  });

  it("Should create a Locale with mainly empty fields", () => {
    const prediction = {
      value: "en-EN",
      confidence: 0.1,
    };
    const locale = new Locale({ prediction });
    expect(locale.language).to.be.undefined;
    expect(locale.country).to.be.undefined;
    expect(locale.currency).to.be.undefined;
  });
});
