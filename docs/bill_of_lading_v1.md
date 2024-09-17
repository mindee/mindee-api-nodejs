---
title: Bill of Lading OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-bill-of-lading-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Bill of Lading API](https://platform.mindee.com/mindee/bill_of_lading).

The [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/bill_of_lading/default_sample.jpg) can be used for testing purposes.
![Bill of Lading sample](https://github.com/mindee/client-lib-test-data/blob/main/products/bill_of_lading/default_sample.jpg?raw=true)

# Quick-Start
```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "my-api-key" });

// Load a file from disk
const inputSource = mindeeClient.docFromPath("/path/to/the/file.ext");

// Parse the file
const apiResponse = mindeeClient.enqueueAndParse(
  mindee.product.BillOfLadingV1,
  inputSource
);

// Handle the response Promise
apiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
```
# Field Types
## Standard Fields
These fields are generic and used in several products.

### Basic Field
Each prediction object contains a set of fields that inherit from the generic `Field` class.
A typical `Field` object will have the following attributes:

* **value** (`number | string`): corresponds to the field value. Can be `undefined` if no value was extracted.
* **confidence** (`number`): the confidence score of the field prediction.
* **boundingBox** (`[Point, Point, Point, Point]`): contains exactly 4 relative vertices (points) coordinates of a right rectangle containing the field in the document.
* **polygon** (`Point[]`): contains the relative vertices coordinates (`Point`) of a polygon containing the field in the image.
* **pageId** (`number`): the ID of the page, always `undefined` when at document-level.
* **reconstructed** (`boolean`): indicates whether an object was reconstructed (not extracted as the API gave it).

> **Note:** A `Point` simply refers to an array of two numbers (`[number, number]`).


Aside from the previous attributes, all basic fields have access to a `toString()` method that can be used to print their value as a string.

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

## Specific Fields
Fields which are specific to this product; they are not used in any other product.

### Carrier Field
The shipping company responsible for transporting the goods.

A `BillOfLadingV1Carrier` implements the following attributes:

* `name` (string): The name of the carrier.
* `professionalNumber` (string): The professional number of the carrier.
* `scac` (string): The Standard Carrier Alpha Code (SCAC) of the carrier.
Fields which are specific to this product; they are not used in any other product.

### Consignee Field
The party to whom the goods are being shipped.

A `BillOfLadingV1Consignee` implements the following attributes:

* `address` (string): The address of the consignee.
* `email` (string): The  email of the shipper.
* `name` (string): The name of the consignee.
* `phone` (string): The phone number of the consignee.
Fields which are specific to this product; they are not used in any other product.

### Items Field
The goods being shipped.

A `BillOfLadingV1CarrierItem` implements the following attributes:

* `description` (string): A description of the item.
* `grossWeight` (number): The gross weight of the item.
* `measurement` (number): The measurement of the item.
* `measurementUnit` (string): The unit of measurement for the measurement.
* `quantity` (number): The quantity of the item being shipped.
* `weightUnit` (string): The unit of measurement for weights.
Fields which are specific to this product; they are not used in any other product.

### Notify Party Field
The party to be notified of the arrival of the goods.

A `BillOfLadingV1NotifyParty` implements the following attributes:

* `address` (string): The address of the notify party.
* `email` (string): The  email of the shipper.
* `name` (string): The name of the notify party.
* `phone` (string): The phone number of the notify party.
Fields which are specific to this product; they are not used in any other product.

### Shipper Field
The party responsible for shipping the goods.

A `BillOfLadingV1Shipper` implements the following attributes:

* `address` (string): The address of the shipper.
* `email` (string): The  email of the shipper.
* `name` (string): The name of the shipper.
* `phone` (string): The phone number of the shipper.

# Attributes
The following fields are extracted for Bill of Lading V1:

## Bill of Lading Number
**billOfLadingNumber** ([StringField](#string-field)): A unique identifier assigned to a Bill of Lading document.

```js
console.log(result.document.inference.prediction.billOfLadingNumber.value);
```

## Carrier
**carrier** ([BillOfLadingV1Carrier](#carrier-field)): The shipping company responsible for transporting the goods.

```js
console.log(result.document.inference.prediction.carrier.value);
```

## Items
**carrierItems** ([BillOfLadingV1CarrierItem](#items-field)[]): The goods being shipped.

```js
for (const carrierItemsElem of result.document.inference.prediction.carrierItems) {
  console.log(carrierItemsElem.value);
}
```

## Consignee
**consignee** ([BillOfLadingV1Consignee](#consignee-field)): The party to whom the goods are being shipped.

```js
console.log(result.document.inference.prediction.consignee.value);
```

## Date of issue
**dateOfIssue** ([DateField](#date-field)): The date when the bill of lading is issued.

```js
console.log(result.document.inference.prediction.dateOfIssue.value);
```

## Departure Date
**departureDate** ([DateField](#date-field)): The date when the vessel departs from the port of loading.

```js
console.log(result.document.inference.prediction.departureDate.value);
```

## Notify Party
**notifyParty** ([BillOfLadingV1NotifyParty](#notify-party-field)): The party to be notified of the arrival of the goods.

```js
console.log(result.document.inference.prediction.notifyParty.value);
```

## Place of Delivery
**placeOfDelivery** ([StringField](#string-field)): The place where the goods are to be delivered.

```js
console.log(result.document.inference.prediction.placeOfDelivery.value);
```

## Port of Discharge
**portOfDischarge** ([StringField](#string-field)): The port where the goods are unloaded from the vessel.

```js
console.log(result.document.inference.prediction.portOfDischarge.value);
```

## Port of Loading
**portOfLoading** ([StringField](#string-field)): The port where the goods are loaded onto the vessel.

```js
console.log(result.document.inference.prediction.portOfLoading.value);
```

## Shipper
**shipper** ([BillOfLadingV1Shipper](#shipper-field)): The party responsible for shipping the goods.

```js
console.log(result.document.inference.prediction.shipper.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
