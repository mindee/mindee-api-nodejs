---
title: US Bank Check OCR Node.js
---
The Node.js OCR SDK supports the [Bank Check API](https://platform.mindee.com/mindee/bank_check).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/us/bank_check/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Bank Check sample](https://github.com/mindee/client-lib-test-data/blob/main/us/bank_check/default_sample.jpg?raw=true)

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
const apiResponse = mindeeClient.parse(
  mindee.product.us.BankCheckV1,
  inputSource
);

// Handle the response Promise
apiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
```

**Output (RST):**
```rst
########
Document
########
:Mindee ID: b9809586-57ae-4f84-a35d-a85b2be1f2a2
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/bank_check v1.0
:Rotation applied: Yes

Prediction
==========
:Check Issue Date: 2022-03-29
:Amount: 15332.90
:Payees: JOHN DOE
         JANE DOE
:Routing Number:
:Account Number: 7789778136
:Check Number: 0003401

Page Predictions
================

Page 0
------
:Check Position: Polygon with 21 points.
:Signature Positions: Polygon with 6 points.
:Check Issue Date: 2022-03-29
:Amount: 15332.90
:Payees: JOHN DOE
         JANE DOE
:Routing Number:
:Account Number: 7789778136
:Check Number: 0003401
```

# Field Types
## Standard Fields
These fields are generic and used in several products.

### Basic Field
Each prediction object contains a set of fields that inherit from the generic `Field` class.
A typical `Field` object will have the following attributes:

* **value** (number|string): corresponds to the field value. Can be `undefined` if no value was extracted.
* **confidence** (`number`): the confidence score of the field prediction.
* **boundingBox** (`[Point, Point, Point, Point]`): contains exactly 4 relative vertices (points) coordinates of a right rectangle containing the field in the document.
* **polygon** (`Point[]`): contains the relative vertices coordinates (`Point`) of a polygon containing the field in the image.
* **pageId** (`number`): the ID of the page, is `undefined` when at document-level.
* **reconstructed** (`boolean`): indicates whether or not an object was reconstructed (not extracted as the API gave it).

> **Note:** A `Point` simply refers to an array of two numbers (`[number, number]`).


Aside from the previous attributes, all basic fields have access to a `toString()` method that can be used to print their value as a string.


### Amount Field
The amount field `AmountField` only has one constraint: its **value** is a `number` (or `undefined`).

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.


### Position Field
The position field `PositionField` does not implement all the basic `Field` attributes, only **boundingBox**, **polygon** and **pageId**. On top of these, it has access to:

* **rectangle** (`[Point, Point, Point, Point]`): a Polygon with four points that may be oriented (even beyond canvas).
* **quadrangle** (`[Point, Point, Point, Point]`): a free polygon made up of four points.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

## Page-Level Fields
Some fields are constrained to the page level, and so will not be retrievable to through the document.

# Attributes
The following fields are extracted for Bank Check V1:

## Account Number
**accountNumber** ([StringField](#string-field)): The check payer's account number.

```js
console.log(result.document.inference.prediction.accountNumber.value);
```

## Amount
**amount** ([AmountField](#amount-field)): The amount of the check.

```js
console.log(result.document.inference.prediction.amount.value);
```

## Check Number
**checkNumber** ([StringField](#string-field)): The issuer's check number.

```js
console.log(result.document.inference.prediction.checkNumber.value);
```

## Check Position
[📄](#page-level-fields "This field is only present on individual pages.")**checkPosition** ([PositionField](#position-field)): The position of the check on the document.

```js
for (const checkPositionElem of result.document.checkPosition) {
  console.log(checkPositionElem.polygon);
}
```

## Check Issue Date
**date** ([DateField](#date-field)): The date the check was issued.

```js
console.log(result.document.inference.prediction.date.value);
```

## Payees
**payees** ([StringField](#string-field)[]): List of the check's payees (recipients).

```js
for (const payeesElem of result.document.inference.prediction.payees) {
  console.log(payeesElem.value);
}
```

## Routing Number
**routingNumber** ([StringField](#string-field)): The check issuer's routing number.

```js
console.log(result.document.inference.prediction.routingNumber.value);
```

## Signature Positions
[📄](#page-level-fields "This field is only present on individual pages.")**signaturesPositions** ([PositionField](#position-field)[]): List of signature positions

```js
for (const page of result.document.inference.pages) {
  for (const signaturesPositionsElem of page.prediction.signaturesPositions) {
    console.log(signaturesPositionsElem.polygon);
  }
}
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
