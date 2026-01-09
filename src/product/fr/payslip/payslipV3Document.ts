import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "@/parsing/common/index.js";
import { PayslipV3PayPeriod } from "./payslipV3PayPeriod.js";
import { PayslipV3Employee } from "./payslipV3Employee.js";
import { PayslipV3Employer } from "./payslipV3Employer.js";
import { PayslipV3BankAccountDetail } from "./payslipV3BankAccountDetail.js";
import { PayslipV3Employment } from "./payslipV3Employment.js";
import { PayslipV3SalaryDetail } from "./payslipV3SalaryDetail.js";
import { PayslipV3PayDetail } from "./payslipV3PayDetail.js";
import { PayslipV3PaidTimeOff } from "./payslipV3PaidTimeOff.js";


/**
 * Payslip API version 3.0 document data.
 */
export class PayslipV3Document implements Prediction {
  /** Information about the employee's bank account. */
  bankAccountDetails: PayslipV3BankAccountDetail;
  /** Information about the employee. */
  employee: PayslipV3Employee;
  /** Information about the employer. */
  employer: PayslipV3Employer;
  /** Information about the employment. */
  employment: PayslipV3Employment;
  /** Information about paid time off. */
  paidTimeOff: PayslipV3PaidTimeOff[] = [];
  /** Detailed information about the pay. */
  payDetail: PayslipV3PayDetail;
  /** Information about the pay period. */
  payPeriod: PayslipV3PayPeriod;
  /** Detailed information about the earnings. */
  salaryDetails: PayslipV3SalaryDetail[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.bankAccountDetails = new PayslipV3BankAccountDetail({
      prediction: rawPrediction["bank_account_details"],
      pageId: pageId,
    });
    this.employee = new PayslipV3Employee({
      prediction: rawPrediction["employee"],
      pageId: pageId,
    });
    this.employer = new PayslipV3Employer({
      prediction: rawPrediction["employer"],
      pageId: pageId,
    });
    this.employment = new PayslipV3Employment({
      prediction: rawPrediction["employment"],
      pageId: pageId,
    });
    rawPrediction["paid_time_off"] &&
      rawPrediction["paid_time_off"].map(
        (itemPrediction: StringDict) =>
          this.paidTimeOff.push(
            new PayslipV3PaidTimeOff({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.payDetail = new PayslipV3PayDetail({
      prediction: rawPrediction["pay_detail"],
      pageId: pageId,
    });
    this.payPeriod = new PayslipV3PayPeriod({
      prediction: rawPrediction["pay_period"],
      pageId: pageId,
    });
    rawPrediction["salary_details"] &&
      rawPrediction["salary_details"].map(
        (itemPrediction: StringDict) =>
          this.salaryDetails.push(
            new PayslipV3SalaryDetail({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    let salaryDetailsSummary:string = "";
    if (this.salaryDetails && this.salaryDetails.length > 0) {
      const salaryDetailsColSizes:number[] = [14, 11, 38, 8, 11];
      salaryDetailsSummary += "\n" + lineSeparator(salaryDetailsColSizes, "-") + "\n  ";
      salaryDetailsSummary += "| Amount       ";
      salaryDetailsSummary += "| Base      ";
      salaryDetailsSummary += "| Description                          ";
      salaryDetailsSummary += "| Number ";
      salaryDetailsSummary += "| Rate      ";
      salaryDetailsSummary += "|\n" + lineSeparator(salaryDetailsColSizes, "=");
      salaryDetailsSummary += this.salaryDetails.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(salaryDetailsColSizes, "-")
      ).join("");
    }
    let paidTimeOffSummary:string = "";
    if (this.paidTimeOff && this.paidTimeOff.length > 0) {
      const paidTimeOffColSizes:number[] = [11, 8, 13, 11, 11];
      paidTimeOffSummary += "\n" + lineSeparator(paidTimeOffColSizes, "-") + "\n  ";
      paidTimeOffSummary += "| Accrued   ";
      paidTimeOffSummary += "| Period ";
      paidTimeOffSummary += "| Type        ";
      paidTimeOffSummary += "| Remaining ";
      paidTimeOffSummary += "| Used      ";
      paidTimeOffSummary += "|\n" + lineSeparator(paidTimeOffColSizes, "=");
      paidTimeOffSummary += this.paidTimeOff.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(paidTimeOffColSizes, "-")
      ).join("");
    }
    const outStr = `:Pay Period: ${this.payPeriod.toFieldList()}
:Employee: ${this.employee.toFieldList()}
:Employer: ${this.employer.toFieldList()}
:Bank Account Details: ${this.bankAccountDetails.toFieldList()}
:Employment: ${this.employment.toFieldList()}
:Salary Details: ${salaryDetailsSummary}
:Pay Detail: ${this.payDetail.toFieldList()}
:Paid Time Off: ${paidTimeOffSummary}`.trimEnd();
    return cleanOutString(outStr);
  }
}
