import { PaymentDetails } from "@mindee/documents/fields";
import { expect } from "chai";

describe("Test PaymentDetails field", () => {
  it("should create a PaymentDetails field", () => {
    const prediction = {
      account_number: "account_number",
      iban: "iban",
      routing_number: "routing_number",
      swift: "swift",
      confidence: 0.1,
      segmentation: {
        boundingBox: [
          [0.016, 0.707],
          [0.414, 0.707],
          [0.414, 0.831],
          [0.016, 0.831],
        ],
      },
    };
    const paymentDetail = new PaymentDetails({ prediction });
    expect(paymentDetail.accountNumber).to.be.equal(prediction.account_number);
    expect(paymentDetail.iban).to.be.equal(prediction.iban);
    expect(paymentDetail.routingNumber).to.be.equal(prediction.routing_number);
    expect(paymentDetail.swift).to.be.equal(prediction.swift);
    expect(typeof paymentDetail.toString()).to.be.equal("string");
  });

  it("should create a PaymentDetails field with N/A inputs", () => {
    const prediction = {
      account_number: "N/A",
      iban: "N/A",
      routing_number: "N/A",
      swift: "N/A",
      confidence: 0.1,
      segmentation: {
        bounding_box: [
          [0.016, 0.707],
          [0.414, 0.707],
          [0.414, 0.831],
          [0.016, 0.831],
        ],
      },
    };
    const paymentDetail = new PaymentDetails({ prediction });
    expect(paymentDetail.accountNumber).to.be.undefined;
    expect(paymentDetail.iban).to.be.undefined;
    expect(paymentDetail.routingNumber).to.be.undefined;
    expect(paymentDetail.swift).to.be.undefined;
  });

  it("should create a PaymentDetails field with empty inputs", () => {
    const prediction = {
      account_number: {},
      iban: {},
      routing_number: {},
      swift: {},
      confidence: 0.1,
      segmentation: {
        bounding_box: [
          [0.016, 0.707],
          [0.414, 0.707],
          [0.414, 0.831],
          [0.016, 0.831],
        ],
      },
    };
    const paymentDetail = new PaymentDetails({ prediction });
    expect(paymentDetail.accountNumber).to.be.undefined;
    expect(paymentDetail.iban).to.be.undefined;
    expect(paymentDetail.routingNumber).to.be.undefined;
    expect(paymentDetail.swift).to.be.undefined;
  });
});
