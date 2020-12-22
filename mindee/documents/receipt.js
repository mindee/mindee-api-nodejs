const Document = require("./document");
const Field = require("./fields").field;
const Date = require("./fields").date;
const Amount = require("./fields").amount;
const Locale = require("./fields").locale;
const Orientation = require("./fields").orientation;
const Tax = require("./fields").tax;

console.log(Document.mergePages);

class Receipt extends Document {
  /**
   *  @param {Object} apiPrediction - Json parsed prediction from HTTP response
   *  @param {Input} input - Input object
   *  @param {Integer} pageNumber - Page number for multi pages pdf input
   *  @param locale - locale value for creating Receipt object from scratch
   *  @param totalIncl - total_incl value for creating Receipt object from scratch
   *  @param date - date value for creating Receipt object from scratch
   *  @param category - category value for creating Receipt object from scratch
   *  @param merchantName - merchant_name value for creating Receipt object from scratch
   *  @param time - time value for creating Receipt object from scratch
   *  @param taxes - taxes value for creating Receipt object from scratch
   *  @param orientation - orientation value for creating Receipt object from scratch
   *  @param totalTax - total_tax value for creating Receipt object from scratch
   *  @param totalExcl - total_excl value for creating Receipt object from scratch
   */
  constructor({
    apiPrediction = undefined,
    inputFile = undefined,
    locale = undefined,
    totalIncl = undefined,
    date = undefined,
    category = undefined,
    merchantName = undefined,
    time = undefined,
    taxes = undefined,
    orientation = undefined,
    totalTax = undefined,
    totalExcl = undefined,
    pageNumber = 0,
  }) {
    super(inputFile);
    if (apiPrediction === undefined) {
      this.initFromScratch({
        locale,
        totalExcl,
        totalIncl,
        date,
        category,
        merchantName,
        time,
        taxes,
        orientation,
        totalTax,
        pageNumber,
      });
    } else {
      this.initFromApiPrediction(apiPrediction);
    }
  }

  initFromScratch({
    locale,
    totalExcl,
    totalIncl,
    date,
    category,
    merchantName,
    time,
    taxes,
    orientation,
    totalTax,
    pageNumber,
  }) {
    const constructPrediction = (item) => ({
      prediction: { value: item },
      valueKey: "value",
      pageNumber,
    });
    this.locale = new Locale(constructPrediction(locale));
    this.totalIncl = new Amount(constructPrediction(totalIncl));
    this.date = new Date(constructPrediction(date));
    this.category = new Field(constructPrediction(category));
    this.merchantName = new Field(constructPrediction(merchantName));
    this.time = new Field(constructPrediction(time));
    if (taxes !== undefined) {
      this.taxes = [];
      for (const t in taxes) {
        taxes.push(
          new Tax({
            prediction: { value: t[0], rate: t[1] },
            pageNumber,
            valueKey: "value",
            rateKey: "rate",
          })
        );
      }
    }
    this.orientation = new Orientation(constructPrediction(orientation));
    this.totalTax = new Amount(constructPrediction(totalTax));
    this.totalExcl = new Amount(constructPrediction(totalExcl));
  }

  /**
    Set the object attributes with api prediction values
    @param apiPrediction: Raw prediction from HTTP response
    @param pageNumber: Page number for multi pages pdf input
   */
  initFromApiPrediction(apiPrediction, pageNumber) {
    this.locale = new Locale({ prediction: apiPrediction.locale, pageNumber });
    this.totalIncl = new Amount({
      prediction: apiPrediction.total_incl,
      valueKey: "value",
      pageNumber,
    });
    this.date = new Date({
      prediction: apiPrediction.date,
      valueKey: "value",
      pageNumber,
    });
    this.category = new Field({
      prediction: apiPrediction.category,
      pageNumber,
    });
    this.merchantName = new Field({
      prediction: apiPrediction.supplier,
      valueKey: "value",
      pageNumber,
    });
    this.time = new Field({
      prediction: apiPrediction.time,
      valueKey: "value",
      pageNumber,
    });
    this.taxes = apiPrediction.taxes.map(
      (taxPrediction) =>
        new Tax({
          prediction: taxPrediction,
          pageNumber,
          valueKey: "value",
          rateKey: "rate",
          codeKey: "code",
        })
    );
    this.orientation = new Orientation({
      prediction: apiPrediction.orientation,
      pageNumber,
    });
    this.totalTax = new Amount({
      prediction: { value: undefined, probability: 0 },
      valueKey: "value",
      pageNumber,
    });
    this.totalExcl = new Amount({
      prediction: { value: undefined, probability: 0 },
      valueKey: "value",
      pageNumber,
    });
  }
}

module.exports = Receipt;
