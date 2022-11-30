import { InvoiceV3 } from "./invoiceV3";
import { InvoiceV4 } from "./invoiceV4";

export function taxesMatchTotalIncl(document: InvoiceV4 | InvoiceV3): boolean {
  // Check taxes and total include exist
  if (document.taxes.length === 0 || document.totalIncl.value === undefined)
    return false;

  // Reconstruct totalIncl from taxes
  let totalVat = 0;
  let reconstructedTotal = 0;
  document.taxes.forEach((tax) => {
    if (tax.value === undefined || !tax.rate) return false;
    totalVat += tax.value;
    reconstructedTotal += tax.value + (100 * tax.value) / tax.rate;
  });

  // Sanity check
  if (totalVat <= 0) return false;

  // Crate epsilon
  const eps = 1 / (100 * totalVat);

  if (
    document.totalIncl.value * (1 - eps) - 0.02 <= reconstructedTotal &&
    reconstructedTotal <= document.totalIncl.value * (1 + eps) + 0.02
  ) {
    document.taxes.forEach((tax) => {
      tax.confidence = 1.0;
    });
    document.totalTax.confidence = 1.0;
    document.totalIncl.confidence = 1.0;
    return true;
  }
  return false;
}

export function taxesMatchTotalExcl(document: InvoiceV4 | InvoiceV3): boolean {
  // Check taxes and total amount exist
  if (document.taxes.length === 0 || document.totalExcl.value === undefined) {
    return false;
  }

  // Reconstruct total_incl from taxes
  let totalVat = 0;
  let reconstructedTotal = 0;
  document.taxes.forEach((tax) => {
    if (tax.value === undefined || !tax.rate) {
      return false;
    }
    totalVat += tax.value;
    reconstructedTotal += (100 * tax.value) / tax.rate;
  });

  // Sanity check
  if (totalVat <= 0) return false;

  // Crate epsilon
  const eps = 1 / (100 * totalVat);

  if (
    document.totalExcl.value * (1 - eps) - 0.02 <= reconstructedTotal &&
    reconstructedTotal <= document.totalExcl.value * (1 + eps) + 0.02
  ) {
    document.taxes.forEach((tax) => {
      tax.confidence = 1.0;
    });
    document.totalTax.confidence = 1.0;
    document.totalExcl.confidence = 1.0;
    return true;
  }
  return false;
}

export function taxesAndTotalExclMatchTotalIncl(
  document: InvoiceV4 | InvoiceV3
): boolean {
  if (
    document.totalExcl.value === undefined ||
    document.taxes.length === 0 ||
    document.totalIncl.value === undefined
  )
    return false;
  let totalVat = 0;
  document.taxes.forEach((tax) => (totalVat += tax.value || 0));
  const reconstructedTotal = totalVat + document.totalExcl.value;

  if (totalVat <= 0) return false;

  if (
    document.totalIncl.value - 0.01 <= reconstructedTotal &&
    reconstructedTotal <= document.totalIncl.value + 0.01
  ) {
    document.taxes.forEach((tax) => {
      tax.confidence = 1.0;
    });
    document.totalTax.confidence = 1.0;
    document.totalIncl.confidence = 1.0;
    return true;
  }
  return false;
}
