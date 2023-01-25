import { Amount, TextField } from "../../fields";
import { IsFinancialDocumentBase } from "../common/financialDocument";
import { InvoiceV3 } from "./invoiceV3";
import { InvoiceV4 } from "./invoiceV4";

export function reconstructTotalTax(
  document: InvoiceV3 | InvoiceV4 | IsFinancialDocumentBase
) {
  if (document.taxes.length > 0) {
    const totalTax = {
      value: document.taxes.reduce((acc, tax) => {
        return tax.value !== undefined ? acc + tax.value : acc;
      }, 0),
      confidence: TextField.arrayConfidence(document.taxes),
    };
    if (totalTax.value > 0)
      document.totalTax = new Amount({
        prediction: totalTax,
        valueKey: "value",
        reconstructed: true,
      });
  }
}

export function reconstructTotalTaxFromTotals(
  document: InvoiceV3 | InvoiceV4 | IsFinancialDocumentBase
) {
  if (
    document.totalTax.value !== undefined ||
    document.totalNet.value === undefined ||
    document.totalAmount.value === undefined
  ) {
    return;
  }
  const totalTax = {
    value: document.totalAmount.value - document.totalNet.value,
    confidence: document.totalAmount.confidence * document.totalNet.confidence,
  };
  if (totalTax.value >= 0) {
    document.totalTax = new Amount({
      prediction: totalTax,
      valueKey: "value",
      reconstructed: true,
    });
  }
}

export function reconstructTotalExcl(
  document: InvoiceV3 | InvoiceV4 | IsFinancialDocumentBase
) {
  if (
    document.totalAmount.value === undefined ||
    document.taxes.length === 0 ||
    document.totalNet.value !== undefined
  ) {
    return;
  }
  const totalExcl = {
    value: document.totalAmount.value - TextField.arraySum(document.taxes),
    confidence:
      TextField.arrayConfidence(document.taxes) *
      (document.totalAmount as Amount).confidence,
  };
  document.totalNet = new Amount({
    prediction: totalExcl,
    valueKey: "value",
    reconstructed: true,
  });
}

export function reconstructTotalIncl(
  document: InvoiceV3 | InvoiceV4 | IsFinancialDocumentBase
) {
  if (
    !(
      document.totalNet.value === undefined ||
      document.taxes.length === 0 ||
      document.totalAmount.value !== undefined
    )
  ) {
    const totalIncl = {
      value:
        document.totalNet.value +
        (document.taxes as any[]).reduce((acc, tax) => {
          return tax.value ? acc + tax.value : acc;
        }, 0.0),
      confidence:
        TextField.arrayConfidence(document.taxes) *
        document.totalNet.confidence,
    };
    document.totalAmount = new Amount({
      prediction: totalIncl,
      valueKey: "value",
      reconstructed: true,
    });
  }
}
