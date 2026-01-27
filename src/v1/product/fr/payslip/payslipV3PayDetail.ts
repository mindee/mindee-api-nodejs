import { floatToString } from "@/v1/parsing/common/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * Detailed information about the pay.
 */
export class PayslipV3PayDetail {
  /** The gross salary of the employee. */
  grossSalary: number | null;
  /** The year-to-date gross salary of the employee. */
  grossSalaryYtd: number | null;
  /** The income tax rate of the employee. */
  incomeTaxRate: number | null;
  /** The income tax withheld from the employee's pay. */
  incomeTaxWithheld: number | null;
  /** The net paid amount of the employee. */
  netPaid: number | null;
  /** The net paid amount before tax of the employee. */
  netPaidBeforeTax: number | null;
  /** The net taxable amount of the employee. */
  netTaxable: number | null;
  /** The year-to-date net taxable amount of the employee. */
  netTaxableYtd: number | null;
  /** The total cost to the employer. */
  totalCostEmployer: number | null;
  /** The total taxes and deductions of the employee. */
  totalTaxesAndDeductions: number | null;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = new Polygon();

  constructor({ prediction = {} }: StringDict) {
    if (
      prediction["gross_salary"] !== undefined &&
      prediction["gross_salary"] !== null &&
      !isNaN(prediction["gross_salary"])
    ) {
      this.grossSalary = +parseFloat(prediction["gross_salary"]);
    } else {
      this.grossSalary = null;
    }
    if (
      prediction["gross_salary_ytd"] !== undefined &&
      prediction["gross_salary_ytd"] !== null &&
      !isNaN(prediction["gross_salary_ytd"])
    ) {
      this.grossSalaryYtd = +parseFloat(prediction["gross_salary_ytd"]);
    } else {
      this.grossSalaryYtd = null;
    }
    if (
      prediction["income_tax_rate"] !== undefined &&
      prediction["income_tax_rate"] !== null &&
      !isNaN(prediction["income_tax_rate"])
    ) {
      this.incomeTaxRate = +parseFloat(prediction["income_tax_rate"]);
    } else {
      this.incomeTaxRate = null;
    }
    if (
      prediction["income_tax_withheld"] !== undefined &&
      prediction["income_tax_withheld"] !== null &&
      !isNaN(prediction["income_tax_withheld"])
    ) {
      this.incomeTaxWithheld = +parseFloat(prediction["income_tax_withheld"]);
    } else {
      this.incomeTaxWithheld = null;
    }
    if (
      prediction["net_paid"] !== undefined &&
      prediction["net_paid"] !== null &&
      !isNaN(prediction["net_paid"])
    ) {
      this.netPaid = +parseFloat(prediction["net_paid"]);
    } else {
      this.netPaid = null;
    }
    if (
      prediction["net_paid_before_tax"] !== undefined &&
      prediction["net_paid_before_tax"] !== null &&
      !isNaN(prediction["net_paid_before_tax"])
    ) {
      this.netPaidBeforeTax = +parseFloat(prediction["net_paid_before_tax"]);
    } else {
      this.netPaidBeforeTax = null;
    }
    if (
      prediction["net_taxable"] !== undefined &&
      prediction["net_taxable"] !== null &&
      !isNaN(prediction["net_taxable"])
    ) {
      this.netTaxable = +parseFloat(prediction["net_taxable"]);
    } else {
      this.netTaxable = null;
    }
    if (
      prediction["net_taxable_ytd"] !== undefined &&
      prediction["net_taxable_ytd"] !== null &&
      !isNaN(prediction["net_taxable_ytd"])
    ) {
      this.netTaxableYtd = +parseFloat(prediction["net_taxable_ytd"]);
    } else {
      this.netTaxableYtd = null;
    }
    if (
      prediction["total_cost_employer"] !== undefined &&
      prediction["total_cost_employer"] !== null &&
      !isNaN(prediction["total_cost_employer"])
    ) {
      this.totalCostEmployer = +parseFloat(prediction["total_cost_employer"]);
    } else {
      this.totalCostEmployer = null;
    }
    if (
      prediction["total_taxes_and_deductions"] !== undefined &&
      prediction["total_taxes_and_deductions"] !== null &&
      !isNaN(prediction["total_taxes_and_deductions"])
    ) {
      this.totalTaxesAndDeductions = +parseFloat(prediction["total_taxes_and_deductions"]);
    } else {
      this.totalTaxesAndDeductions = null;
    }
    this.pageId = prediction["page_id"];
    this.confidence = prediction["confidence"] ? prediction.confidence : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction.polygon;
    }
  }

  /**
   * Collection of fields as representable strings.
   */
  #printableValues() {
    return {
      grossSalary:
        this.grossSalary !== undefined ? floatToString(this.grossSalary) : "",
      grossSalaryYtd:
        this.grossSalaryYtd !== undefined ? floatToString(this.grossSalaryYtd) : "",
      incomeTaxRate:
        this.incomeTaxRate !== undefined ? floatToString(this.incomeTaxRate) : "",
      incomeTaxWithheld:
        this.incomeTaxWithheld !== undefined ? floatToString(this.incomeTaxWithheld) : "",
      netPaid: this.netPaid !== undefined ? floatToString(this.netPaid) : "",
      netPaidBeforeTax:
        this.netPaidBeforeTax !== undefined ? floatToString(this.netPaidBeforeTax) : "",
      netTaxable:
        this.netTaxable !== undefined ? floatToString(this.netTaxable) : "",
      netTaxableYtd:
        this.netTaxableYtd !== undefined ? floatToString(this.netTaxableYtd) : "",
      totalCostEmployer:
        this.totalCostEmployer !== undefined ? floatToString(this.totalCostEmployer) : "",
      totalTaxesAndDeductions:
        this.totalTaxesAndDeductions !== undefined ? floatToString(this.totalTaxesAndDeductions) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Gross Salary: " +
      printable.grossSalary +
      ", Gross Salary YTD: " +
      printable.grossSalaryYtd +
      ", Income Tax Rate: " +
      printable.incomeTaxRate +
      ", Income Tax Withheld: " +
      printable.incomeTaxWithheld +
      ", Net Paid: " +
      printable.netPaid +
      ", Net Paid Before Tax: " +
      printable.netPaidBeforeTax +
      ", Net Taxable: " +
      printable.netTaxable +
      ", Net Taxable YTD: " +
      printable.netTaxableYtd +
      ", Total Cost Employer: " +
      printable.totalCostEmployer +
      ", Total Taxes and Deductions: " +
      printable.totalTaxesAndDeductions
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Gross Salary: ${printable.grossSalary}
  :Gross Salary YTD: ${printable.grossSalaryYtd}
  :Income Tax Rate: ${printable.incomeTaxRate}
  :Income Tax Withheld: ${printable.incomeTaxWithheld}
  :Net Paid: ${printable.netPaid}
  :Net Paid Before Tax: ${printable.netPaidBeforeTax}
  :Net Taxable: ${printable.netTaxable}
  :Net Taxable YTD: ${printable.netTaxableYtd}
  :Total Cost Employer: ${printable.totalCostEmployer}
  :Total Taxes and Deductions: ${printable.totalTaxesAndDeductions}`.trimEnd();
  }
}
