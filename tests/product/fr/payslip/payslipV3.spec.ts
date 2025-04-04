import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/payslip_fra/response_v3/complete.json",
  empty: "tests/data/products/payslip_fra/response_v3/empty.json",
  docString: "tests/data/products/payslip_fra/response_v3/summary_full.rst",
  page0String: "tests/data/products/payslip_fra/response_v3/summary_page0.rst",
};

describe("PayslipV3 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.PayslipV3, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.payPeriod.endDate).to.be.null;
    expect(docPrediction.payPeriod.month).to.be.null;
    expect(docPrediction.payPeriod.paymentDate).to.be.null;
    expect(docPrediction.payPeriod.startDate).to.be.null;
    expect(docPrediction.payPeriod.year).to.be.null;
    expect(docPrediction.employee.address).to.be.null;
    expect(docPrediction.employee.dateOfBirth).to.be.null;
    expect(docPrediction.employee.firstName).to.be.null;
    expect(docPrediction.employee.lastName).to.be.null;
    expect(docPrediction.employee.phoneNumber).to.be.null;
    expect(docPrediction.employee.registrationNumber).to.be.null;
    expect(docPrediction.employee.socialSecurityNumber).to.be.null;
    expect(docPrediction.employer.address).to.be.null;
    expect(docPrediction.employer.companyId).to.be.null;
    expect(docPrediction.employer.companySite).to.be.null;
    expect(docPrediction.employer.nafCode).to.be.null;
    expect(docPrediction.employer.name).to.be.null;
    expect(docPrediction.employer.phoneNumber).to.be.null;
    expect(docPrediction.employer.urssafNumber).to.be.null;
    expect(docPrediction.bankAccountDetails.bankName).to.be.null;
    expect(docPrediction.bankAccountDetails.iban).to.be.null;
    expect(docPrediction.bankAccountDetails.swift).to.be.null;
    expect(docPrediction.employment.category).to.be.null;
    expect(docPrediction.employment.coefficient).to.be.null;
    expect(docPrediction.employment.collectiveAgreement).to.be.null;
    expect(docPrediction.employment.jobTitle).to.be.null;
    expect(docPrediction.employment.positionLevel).to.be.null;
    expect(docPrediction.employment.seniorityDate).to.be.null;
    expect(docPrediction.employment.startDate).to.be.null;
    expect(docPrediction.salaryDetails.length).to.be.equals(0);
    expect(docPrediction.payDetail.grossSalary).to.be.null;
    expect(docPrediction.payDetail.grossSalaryYtd).to.be.null;
    expect(docPrediction.payDetail.incomeTaxRate).to.be.null;
    expect(docPrediction.payDetail.incomeTaxWithheld).to.be.null;
    expect(docPrediction.payDetail.netPaid).to.be.null;
    expect(docPrediction.payDetail.netPaidBeforeTax).to.be.null;
    expect(docPrediction.payDetail.netTaxable).to.be.null;
    expect(docPrediction.payDetail.netTaxableYtd).to.be.null;
    expect(docPrediction.payDetail.totalCostEmployer).to.be.null;
    expect(docPrediction.payDetail.totalTaxesAndDeductions).to.be.null;
    expect(docPrediction.paidTimeOff.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.PayslipV3, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
