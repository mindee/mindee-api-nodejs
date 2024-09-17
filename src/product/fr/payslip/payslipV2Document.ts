import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../../parsing/common";
import { PayslipV2Employee } from "./payslipV2Employee";
import { PayslipV2Employer } from "./payslipV2Employer";
import { PayslipV2BankAccountDetail } from "./payslipV2BankAccountDetail";
import { PayslipV2Employment } from "./payslipV2Employment";
import { PayslipV2SalaryDetail } from "./payslipV2SalaryDetail";
import { PayslipV2PayDetail } from "./payslipV2PayDetail";
import { PayslipV2Pto } from "./payslipV2Pto";
import { PayslipV2PayPeriod } from "./payslipV2PayPeriod";


/**
 * Payslip API version 2.0 document data.
 */
export class PayslipV2Document implements Prediction {
  /** Information about the employee's bank account. */
  bankAccountDetails: PayslipV2BankAccountDetail;
  /** Information about the employee. */
  employee: PayslipV2Employee;
  /** Information about the employer. */
  employer: PayslipV2Employer;
  /** Information about the employment. */
  employment: PayslipV2Employment;
  /** Detailed information about the pay. */
  payDetail: PayslipV2PayDetail;
  /** Information about the pay period. */
  payPeriod: PayslipV2PayPeriod;
  /** Information about paid time off. */
  pto: PayslipV2Pto;
  /** Detailed information about the earnings. */
  salaryDetails: PayslipV2SalaryDetail[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.bankAccountDetails = new PayslipV2BankAccountDetail({
      prediction: rawPrediction["bank_account_details"],
      pageId: pageId,
    });
    this.employee = new PayslipV2Employee({
      prediction: rawPrediction["employee"],
      pageId: pageId,
    });
    this.employer = new PayslipV2Employer({
      prediction: rawPrediction["employer"],
      pageId: pageId,
    });
    this.employment = new PayslipV2Employment({
      prediction: rawPrediction["employment"],
      pageId: pageId,
    });
    this.payDetail = new PayslipV2PayDetail({
      prediction: rawPrediction["pay_detail"],
      pageId: pageId,
    });
    this.payPeriod = new PayslipV2PayPeriod({
      prediction: rawPrediction["pay_period"],
      pageId: pageId,
    });
    this.pto = new PayslipV2Pto({
      prediction: rawPrediction["pto"],
      pageId: pageId,
    });
    rawPrediction["salary_details"] &&
      rawPrediction["salary_details"].map(
        (itemPrediction: StringDict) =>
          this.salaryDetails.push(
            new PayslipV2SalaryDetail({
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
      const salaryDetailsColSizes:number[] = [14, 11, 38, 11];
      salaryDetailsSummary += "\n" + lineSeparator(salaryDetailsColSizes, "-") + "\n  ";
      salaryDetailsSummary += "| Amount       ";
      salaryDetailsSummary += "| Base      ";
      salaryDetailsSummary += "| Description                          ";
      salaryDetailsSummary += "| Rate      ";
      salaryDetailsSummary += "|\n" + lineSeparator(salaryDetailsColSizes, "=");
      salaryDetailsSummary += this.salaryDetails.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(salaryDetailsColSizes, "-")
      ).join("");
    }
    const outStr = `:Employee: ${this.employee.toFieldList()}
:Employer: ${this.employer.toFieldList()}
:Bank Account Details: ${this.bankAccountDetails.toFieldList()}
:Employment: ${this.employment.toFieldList()}
:Salary Details: ${salaryDetailsSummary}
:Pay Detail: ${this.payDetail.toFieldList()}
:PTO: ${this.pto.toFieldList()}
:Pay Period: ${this.payPeriod.toFieldList()}`.trimEnd();
    return cleanOutString(outStr);
  }
}
