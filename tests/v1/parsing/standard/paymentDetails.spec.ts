import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PaymentDetailsField } from "@/v1/parsing/standard/index.js";

describe("Test PaymentDetailsField field", () => {
  it("should create a PaymentDetailsField field", () => {
    /* eslint-disable @typescript-eslint/naming-convention,camelcase */
    const prediction = {
      account_number: "account_number",
      iban: "iban",
      routing_number: "routing_number",
      swift: "swift",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    /* eslint-enable @typescript-eslint/naming-convention,camelcase */
    const paymentDetail = new PaymentDetailsField({ prediction });
    assert.strictEqual(paymentDetail.accountNumber, prediction.account_number);
    assert.strictEqual(paymentDetail.iban, prediction.iban);
    assert.strictEqual(paymentDetail.routingNumber, prediction.routing_number);
    assert.strictEqual(paymentDetail.swift, prediction.swift);
    assert.strictEqual(paymentDetail.toString(), "account_number; iban; routing_number; swift; ");
  });

  it("should create a PaymentDetailsField field with N/A inputs", () => {
    /* eslint-disable @typescript-eslint/naming-convention,camelcase */
    const prediction = {
      account_number: "N/A",
      iban: "N/A",
      routing_number: "N/A",
      swift: "N/A",
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    /* eslint-enable @typescript-eslint/naming-convention,camelcase */
    const paymentDetail = new PaymentDetailsField({ prediction });
    assert.strictEqual(paymentDetail.accountNumber, undefined);
    assert.strictEqual(paymentDetail.iban, undefined);
    assert.strictEqual(paymentDetail.routingNumber, undefined);
    assert.strictEqual(paymentDetail.swift, undefined);
    assert.strictEqual(paymentDetail.toString(), "");
  });

  it("should create a PaymentDetailsField field with empty inputs", () => {
    /* eslint-disable @typescript-eslint/naming-convention,camelcase */
    const prediction = {
      account_number: {},
      iban: {},
      routing_number: {},
      swift: {},
      confidence: 0.1,
      polygon: [
        [0.016, 0.707],
        [0.414, 0.707],
        [0.414, 0.831],
        [0.016, 0.831],
      ],
    };
    /* eslint-enable @typescript-eslint/naming-convention,camelcase */
    const paymentDetail = new PaymentDetailsField({ prediction });
    assert.strictEqual(paymentDetail.accountNumber, undefined);
    assert.strictEqual(paymentDetail.iban, undefined);
    assert.strictEqual(paymentDetail.routingNumber, undefined);
    assert.strictEqual(paymentDetail.swift, undefined);
    assert.strictEqual(paymentDetail.toString(), "");
  });
});
