import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../parsing/common";
import { BillOfLadingV1Shipper } from "./billOfLadingV1Shipper";
import { BillOfLadingV1Consignee } from "./billOfLadingV1Consignee";
import { BillOfLadingV1NotifyParty } from "./billOfLadingV1NotifyParty";
import { BillOfLadingV1Carrier } from "./billOfLadingV1Carrier";
import { BillOfLadingV1CarrierItem } from "./billOfLadingV1CarrierItem";
import { DateField, StringField } from "../../parsing/standard";

/**
 * Bill of Lading API version 1.1 document data.
 */
export class BillOfLadingV1Document implements Prediction {
  /** A unique identifier assigned to a Bill of Lading document. */
  billOfLadingNumber: StringField;
  /** The shipping company responsible for transporting the goods. */
  carrier: BillOfLadingV1Carrier;
  /** The goods being shipped. */
  carrierItems: BillOfLadingV1CarrierItem[] = [];
  /** The party to whom the goods are being shipped. */
  consignee: BillOfLadingV1Consignee;
  /** The date when the bill of lading is issued. */
  dateOfIssue: DateField;
  /** The date when the vessel departs from the port of loading. */
  departureDate: DateField;
  /** The party to be notified of the arrival of the goods. */
  notifyParty: BillOfLadingV1NotifyParty;
  /** The place where the goods are to be delivered. */
  placeOfDelivery: StringField;
  /** The port where the goods are unloaded from the vessel. */
  portOfDischarge: StringField;
  /** The port where the goods are loaded onto the vessel. */
  portOfLoading: StringField;
  /** The party responsible for shipping the goods. */
  shipper: BillOfLadingV1Shipper;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.billOfLadingNumber = new StringField({
      prediction: rawPrediction["bill_of_lading_number"],
      pageId: pageId,
    });
    this.carrier = new BillOfLadingV1Carrier({
      prediction: rawPrediction["carrier"],
      pageId: pageId,
    });
    rawPrediction["carrier_items"] &&
      rawPrediction["carrier_items"].map(
        (itemPrediction: StringDict) =>
          this.carrierItems.push(
            new BillOfLadingV1CarrierItem({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.consignee = new BillOfLadingV1Consignee({
      prediction: rawPrediction["consignee"],
      pageId: pageId,
    });
    this.dateOfIssue = new DateField({
      prediction: rawPrediction["date_of_issue"],
      pageId: pageId,
    });
    this.departureDate = new DateField({
      prediction: rawPrediction["departure_date"],
      pageId: pageId,
    });
    this.notifyParty = new BillOfLadingV1NotifyParty({
      prediction: rawPrediction["notify_party"],
      pageId: pageId,
    });
    this.placeOfDelivery = new StringField({
      prediction: rawPrediction["place_of_delivery"],
      pageId: pageId,
    });
    this.portOfDischarge = new StringField({
      prediction: rawPrediction["port_of_discharge"],
      pageId: pageId,
    });
    this.portOfLoading = new StringField({
      prediction: rawPrediction["port_of_loading"],
      pageId: pageId,
    });
    this.shipper = new BillOfLadingV1Shipper({
      prediction: rawPrediction["shipper"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    let carrierItemsSummary:string = "";
    if (this.carrierItems && this.carrierItems.length > 0) {
      const carrierItemsColSizes:number[] = [38, 14, 13, 18, 10, 13];
      carrierItemsSummary += "\n" + lineSeparator(carrierItemsColSizes, "-") + "\n  ";
      carrierItemsSummary += "| Description                          ";
      carrierItemsSummary += "| Gross Weight ";
      carrierItemsSummary += "| Measurement ";
      carrierItemsSummary += "| Measurement Unit ";
      carrierItemsSummary += "| Quantity ";
      carrierItemsSummary += "| Weight Unit ";
      carrierItemsSummary += "|\n" + lineSeparator(carrierItemsColSizes, "=");
      carrierItemsSummary += this.carrierItems.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(carrierItemsColSizes, "-")
      ).join("");
    }
    const outStr = `:Bill of Lading Number: ${this.billOfLadingNumber}
:Shipper: ${this.shipper.toFieldList()}
:Consignee: ${this.consignee.toFieldList()}
:Notify Party: ${this.notifyParty.toFieldList()}
:Carrier: ${this.carrier.toFieldList()}
:Items: ${carrierItemsSummary}
:Port of Loading: ${this.portOfLoading}
:Port of Discharge: ${this.portOfDischarge}
:Place of Delivery: ${this.placeOfDelivery}
:Date of issue: ${this.dateOfIssue}
:Departure Date: ${this.departureDate}`.trimEnd();
    return cleanOutString(outStr);
  }
}
