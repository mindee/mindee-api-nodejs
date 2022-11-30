import { Amount, Field } from "../../fields";
import { InvoiceV3 } from "./invoiceV3";
import { InvoiceV4 } from "./invoiceV4";

export function reconstructTotalTax(document: InvoiceV3 | InvoiceV4) {
  if (document.taxes.length > 0) {
    const totalTax = {
      value: document.taxes.reduce((acc, tax) => {
        return tax.value !== undefined ? acc + tax.value : acc;
      }, 0),
      confidence: Field.arrayConfidence(document.taxes),
    };
    if (totalTax.value > 0)
      document.totalTax = new Amount({
        prediction: totalTax,
        valueKey: "value",
        reconstructed: true,
      });
  }
}

export function reconstructTotalTaxFromTotals(document: InvoiceV3 | InvoiceV4) {
  if (
    document.totalTax.value !== undefined ||
    document.totalExcl.value === undefined ||
    document.totalIncl.value === undefined
  ) {
    return;
  }
  const totalTax = {
    value: document.totalIncl.value - document.totalExcl.value,
    confidence: document.totalIncl.confidence * document.totalExcl.confidence,
  };
  if (totalTax.value >= 0) {
    document.totalTax = new Amount({
      prediction: totalTax,
      valueKey: "value",
      reconstructed: true,
    });
  }
}

export function reconstructTotalExcl(document: InvoiceV3 | InvoiceV4) {
  if (
    document.totalIncl.value === undefined ||
    document.taxes.length === 0 ||
    document.totalExcl.value !== undefined
  ) {
    return;
  }
  const totalExcl = {
    value: document.totalIncl.value - Field.arraySum(document.taxes),
    confidence:
      Field.arrayConfidence(document.taxes) *
      (document.totalIncl as Amount).confidence,
  };
  document.totalExcl = new Amount({
    prediction: totalExcl,
    valueKey: "value",
    reconstructed: true,
  });
}

export function reconstructTotalIncl(document: InvoiceV3 | InvoiceV4) {
  if (
    !(
      document.totalExcl.value === undefined ||
      document.taxes.length === 0 ||
      document.totalIncl.value !== undefined
    )
  ) {
    const totalIncl = {
      value:
        document.totalExcl.value +
        (document.taxes as any[]).reduce((acc, tax) => {
          return tax.value ? acc + tax.value : acc;
        }, 0.0),
      confidence:
        Field.arrayConfidence(document.taxes) * document.totalExcl.confidence,
    };
    document.totalIncl = new Amount({
      prediction: totalIncl,
      valueKey: "value",
      reconstructed: true,
    });
  }
}
