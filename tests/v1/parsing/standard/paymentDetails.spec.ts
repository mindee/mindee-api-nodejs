import { PaymentDetailsField } from "@/parsing/standard/index.js";
import { expect } from "chai";

describe("Test PaymentDetailsField field", () => {
  it("should create a PaymentDetailsField field", () => {
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
    const paymentDetail = new PaymentDetailsField({ prediction });
    expect(paymentDetail.accountNumber).to.be.equal(prediction.account_number);
    expect(paymentDetail.iban).to.be.equal(prediction.iban);
    expect(paymentDetail.routingNumber).to.be.equal(prediction.routing_number);
    expect(paymentDetail.swift).to.be.equal(prediction.swift);
    expect(paymentDetail.toString()).to.be.equal(
      "account_number; iban; routing_number; swift; "
    );
  });

  it("should create a PaymentDetailsField field with N/A inputs", () => {
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
    const paymentDetail = new PaymentDetailsField({ prediction });
    expect(paymentDetail.accountNumber).to.be.undefined;
    expect(paymentDetail.iban).to.be.undefined;
    expect(paymentDetail.routingNumber).to.be.undefined;
    expect(paymentDetail.swift).to.be.undefined;
    expect(paymentDetail.toString()).to.be.equal("");
  });

  it("should create a PaymentDetailsField field with empty inputs", () => {
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
    const paymentDetail = new PaymentDetailsField({ prediction });
    expect(paymentDetail.accountNumber).to.be.undefined;
    expect(paymentDetail.iban).to.be.undefined;
    expect(paymentDetail.routingNumber).to.be.undefined;
    expect(paymentDetail.swift).to.be.undefined;
    expect(paymentDetail.toString()).to.be.equal("");
  });
});
