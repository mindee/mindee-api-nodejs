import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../../parsing/common";
import { EnergyBillV1EnergySupplier } from "./energyBillV1EnergySupplier";
import { EnergyBillV1EnergyConsumer } from "./energyBillV1EnergyConsumer";
import { EnergyBillV1Subscription } from "./energyBillV1Subscription";
import { EnergyBillV1EnergyUsage } from "./energyBillV1EnergyUsage";
import { EnergyBillV1TaxesAndContribution } from "./energyBillV1TaxesAndContribution";
import { EnergyBillV1MeterDetail } from "./energyBillV1MeterDetail";
import {
  AmountField,
  DateField,
  StringField,
} from "../../../parsing/standard";

/**
 * Energy Bill API version 1.2 document data.
 */
export class EnergyBillV1Document implements Prediction {
  /** The unique identifier associated with a specific contract. */
  contractId: StringField;
  /**
   * The unique identifier assigned to each electricity or gas consumption point. It specifies the exact location where
   * the energy is delivered.
   */
  deliveryPoint: StringField;
  /** The date by which the payment for the energy invoice is due. */
  dueDate: DateField;
  /** The entity that consumes the energy. */
  energyConsumer: EnergyBillV1EnergyConsumer;
  /** The company that supplies the energy. */
  energySupplier: EnergyBillV1EnergySupplier;
  /** Details of energy consumption. */
  energyUsage: EnergyBillV1EnergyUsage[] = [];
  /** The date when the energy invoice was issued. */
  invoiceDate: DateField;
  /** The unique identifier of the energy invoice. */
  invoiceNumber: StringField;
  /** Information about the energy meter. */
  meterDetails: EnergyBillV1MeterDetail;
  /** The subscription details fee for the energy service. */
  subscription: EnergyBillV1Subscription[] = [];
  /** Details of Taxes and Contributions. */
  taxesAndContributions: EnergyBillV1TaxesAndContribution[] = [];
  /** The total amount to be paid for the energy invoice. */
  totalAmount: AmountField;
  /** The total amount to be paid for the energy invoice before taxes. */
  totalBeforeTaxes: AmountField;
  /** Total of taxes applied to the invoice. */
  totalTaxes: AmountField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.contractId = new StringField({
      prediction: rawPrediction["contract_id"],
      pageId: pageId,
    });
    this.deliveryPoint = new StringField({
      prediction: rawPrediction["delivery_point"],
      pageId: pageId,
    });
    this.dueDate = new DateField({
      prediction: rawPrediction["due_date"],
      pageId: pageId,
    });
    this.energyConsumer = new EnergyBillV1EnergyConsumer({
      prediction: rawPrediction["energy_consumer"],
      pageId: pageId,
    });
    this.energySupplier = new EnergyBillV1EnergySupplier({
      prediction: rawPrediction["energy_supplier"],
      pageId: pageId,
    });
    rawPrediction["energy_usage"] &&
      rawPrediction["energy_usage"].map(
        (itemPrediction: StringDict) =>
          this.energyUsage.push(
            new EnergyBillV1EnergyUsage({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.invoiceDate = new DateField({
      prediction: rawPrediction["invoice_date"],
      pageId: pageId,
    });
    this.invoiceNumber = new StringField({
      prediction: rawPrediction["invoice_number"],
      pageId: pageId,
    });
    this.meterDetails = new EnergyBillV1MeterDetail({
      prediction: rawPrediction["meter_details"],
      pageId: pageId,
    });
    rawPrediction["subscription"] &&
      rawPrediction["subscription"].map(
        (itemPrediction: StringDict) =>
          this.subscription.push(
            new EnergyBillV1Subscription({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    rawPrediction["taxes_and_contributions"] &&
      rawPrediction["taxes_and_contributions"].map(
        (itemPrediction: StringDict) =>
          this.taxesAndContributions.push(
            new EnergyBillV1TaxesAndContribution({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.totalAmount = new AmountField({
      prediction: rawPrediction["total_amount"],
      pageId: pageId,
    });
    this.totalBeforeTaxes = new AmountField({
      prediction: rawPrediction["total_before_taxes"],
      pageId: pageId,
    });
    this.totalTaxes = new AmountField({
      prediction: rawPrediction["total_taxes"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    let subscriptionSummary:string = "";
    if (this.subscription && this.subscription.length > 0) {
      const subscriptionColSizes:number[] = [38, 12, 12, 10, 11, 12];
      subscriptionSummary += "\n" + lineSeparator(subscriptionColSizes, "-") + "\n  ";
      subscriptionSummary += "| Description                          ";
      subscriptionSummary += "| End Date   ";
      subscriptionSummary += "| Start Date ";
      subscriptionSummary += "| Tax Rate ";
      subscriptionSummary += "| Total     ";
      subscriptionSummary += "| Unit Price ";
      subscriptionSummary += "|\n" + lineSeparator(subscriptionColSizes, "=");
      subscriptionSummary += this.subscription.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(subscriptionColSizes, "-")
      ).join("");
    }
    let energyUsageSummary:string = "";
    if (this.energyUsage && this.energyUsage.length > 0) {
      const energyUsageColSizes:number[] = [13, 38, 12, 12, 10, 11, 17, 12];
      energyUsageSummary += "\n" + lineSeparator(energyUsageColSizes, "-") + "\n  ";
      energyUsageSummary += "| Consumption ";
      energyUsageSummary += "| Description                          ";
      energyUsageSummary += "| End Date   ";
      energyUsageSummary += "| Start Date ";
      energyUsageSummary += "| Tax Rate ";
      energyUsageSummary += "| Total     ";
      energyUsageSummary += "| Unit of Measure ";
      energyUsageSummary += "| Unit Price ";
      energyUsageSummary += "|\n" + lineSeparator(energyUsageColSizes, "=");
      energyUsageSummary += this.energyUsage.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(energyUsageColSizes, "-")
      ).join("");
    }
    let taxesAndContributionsSummary:string = "";
    if (this.taxesAndContributions && this.taxesAndContributions.length > 0) {
      const taxesAndContributionsColSizes:number[] = [38, 12, 12, 10, 11, 12];
      taxesAndContributionsSummary += "\n" + lineSeparator(taxesAndContributionsColSizes, "-") + "\n  ";
      taxesAndContributionsSummary += "| Description                          ";
      taxesAndContributionsSummary += "| End Date   ";
      taxesAndContributionsSummary += "| Start Date ";
      taxesAndContributionsSummary += "| Tax Rate ";
      taxesAndContributionsSummary += "| Total     ";
      taxesAndContributionsSummary += "| Unit Price ";
      taxesAndContributionsSummary += "|\n" + lineSeparator(taxesAndContributionsColSizes, "=");
      taxesAndContributionsSummary += this.taxesAndContributions.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(taxesAndContributionsColSizes, "-")
      ).join("");
    }
    const outStr = `:Invoice Number: ${this.invoiceNumber}
:Contract ID: ${this.contractId}
:Delivery Point: ${this.deliveryPoint}
:Invoice Date: ${this.invoiceDate}
:Due Date: ${this.dueDate}
:Total Before Taxes: ${this.totalBeforeTaxes}
:Total Taxes: ${this.totalTaxes}
:Total Amount: ${this.totalAmount}
:Energy Supplier: ${this.energySupplier.toFieldList()}
:Energy Consumer: ${this.energyConsumer.toFieldList()}
:Subscription: ${subscriptionSummary}
:Energy Usage: ${energyUsageSummary}
:Taxes and Contributions: ${taxesAndContributionsSummary}
:Meter Details: ${this.meterDetails.toFieldList()}`.trimEnd();
    return cleanOutString(outStr);
  }
}
