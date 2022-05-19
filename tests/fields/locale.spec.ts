import { Locale } from "@mindee/documents/fields";
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
  });

  it("Should create a Locale with some empty fields", () => {
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
