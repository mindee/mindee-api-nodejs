import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LocaleField } from "@/v1/parsing/standard/index.js";

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
    assert.strictEqual(field.value, "en-EN");
    assert.strictEqual(field.language, "en");
    assert.strictEqual(field.country, "uk");
    assert.strictEqual(field.currency, "GBP");
    assert.strictEqual(field.confidence, 0.1);
  });

  it("Should create a LocaleField without the value property", () => {
    const prediction = {
      language: "fr",
      country: "fr",
      currency: "EUR",
      confidence: 0.15,
    };
    const field = new LocaleField({ prediction });
    assert.strictEqual(field.value, "fr");
    assert.strictEqual(field.language, "fr");
    assert.strictEqual(field.country, "fr");
    assert.strictEqual(field.currency, "EUR");
    assert.strictEqual(field.confidence, 0.15);
  });

  it("Should create a LocaleField with mainly empty fields", () => {
    const prediction = {
      value: "en-EN",
      confidence: 0.1,
    };
    const field = new LocaleField({ prediction });
    assert.strictEqual(field.language, undefined);
    assert.strictEqual(field.country, undefined);
    assert.strictEqual(field.currency, undefined);
  });
});
