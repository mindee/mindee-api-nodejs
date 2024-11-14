---
title: Delivery note OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-delivery-note-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Delivery note API](https://platform.mindee.com/mindee/delivery_notes).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/delivery_notes/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Delivery note sample](https://github.com/mindee/client-lib-test-data/blob/main/products/delivery_notes/default_sample.jpg?raw=true)

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
  mindee.product.DeliveryNoteV1,
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
:Mindee ID: d5ead821-edec-4d31-a69a-cf3998d9a506
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/delivery_notes v1.0
:Rotation applied: Yes

Prediction
==========
:Delivery Date: 2019-10-02
:Delivery Number: INT-001
:Supplier Name: John Smith
:Supplier Address: 4490 Oak Drive, Albany, NY 12210
:Customer Name: Jessie M Horne
:Customer Address: 4312 Wood Road, New York, NY 10031
:Total Amount: 204.75
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


### Amount Field
The amount field `AmountField` only has one constraint: its **value** is a `number` (or `undefined`).

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

# Attributes
The following fields are extracted for Delivery note V1:

## Customer Address
**customerAddress** ([StringField](#string-field)): The address of the customer receiving the goods.

```js
console.log(result.document.inference.prediction.customerAddress.value);
```

## Customer Name
**customerName** ([StringField](#string-field)): The name of the customer receiving the goods.

```js
console.log(result.document.inference.prediction.customerName.value);
```

## Delivery Date
**deliveryDate** ([DateField](#date-field)): The date on which the delivery is scheduled to arrive.

```js
console.log(result.document.inference.prediction.deliveryDate.value);
```

## Delivery Number
**deliveryNumber** ([StringField](#string-field)): A unique identifier for the delivery note.

```js
console.log(result.document.inference.prediction.deliveryNumber.value);
```

## Supplier Address
**supplierAddress** ([StringField](#string-field)): The address of the supplier providing the goods.

```js
console.log(result.document.inference.prediction.supplierAddress.value);
```

## Supplier Name
**supplierName** ([StringField](#string-field)): The name of the supplier providing the goods.

```js
console.log(result.document.inference.prediction.supplierName.value);
```

## Total Amount
**totalAmount** ([AmountField](#amount-field)): The total monetary value of the goods being delivered.

```js
console.log(result.document.inference.prediction.totalAmount.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
