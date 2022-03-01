const Locale = require("../../mindee/documents/fields/locale");
const expect = require("chai").expect;

describe("Test Locale field", () => {
  it("Should create a Locale", () => {
    const prediction = {
      value: "en-EN",
      language: "en",
      country: "uk",
      currency: "GBP",
      probability: 0.1,
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
      probability: 0.1,
    };
    const locale = new Locale({ prediction });
    expect(locale.language).to.be.undefined;
    expect(locale.country).to.be.undefined;
    expect(locale.currency).to.be.undefined;
  });
});
