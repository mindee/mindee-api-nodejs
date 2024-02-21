---
title: EU Driver License OCR Node.js
---
The Node.js OCR SDK supports the [Driver License API](https://platform.mindee.com/mindee/eu_driver_license).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/eu_driver_license/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Driver License sample](https://github.com/mindee/client-lib-test-data/blob/main/products/eu_driver_license/default_sample.jpg?raw=true)

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
  mindee.product.eu.DriverLicenseV1,
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
:Mindee ID: b19cc32e-b3e6-4ff9-bdc7-619199355d54
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/eu_driver_license v1.0
:Rotation applied: Yes

Prediction
==========
:Country Code: FR
:Document ID: 13AA00002
:Driver License Category: AM A1 B1 B D BE DE
:Last Name: MARTIN
:First Name: PAUL
:Date Of Birth: 1981-07-14
:Place Of Birth: Utopiacity
:Expiry Date: 2018-12-31
:Issue Date: 2013-01-01
:Issue Authority: 99999UpiaCity
:MRZ: D1FRA13AA000026181231MARTIN<<9
:Address:

Page Predictions
================

Page 0
------
:Photo: Polygon with 4 points.
:Signature: Polygon with 4 points.
:Country Code: FR
:Document ID: 13AA00002
:Driver License Category: AM A1 B1 B D BE DE
:Last Name: MARTIN
:First Name: PAUL
:Date Of Birth: 1981-07-14
:Place Of Birth: Utopiacity
:Expiry Date: 2018-12-31
:Issue Date: 2013-01-01
:Issue Authority: 99999UpiaCity
:MRZ: D1FRA13AA000026181231MARTIN<<9
:Address:
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
* **pageId** (`number`): the ID of the page, is `undefined` when at document-level.
* **reconstructed** (`boolean`): indicates whether an object was reconstructed (not extracted as the API gave it).

> **Note:** A `Point` simply refers to an array of two numbers (`[number, number]`).


Aside from the previous attributes, all basic fields have access to a `toString()` method that can be used to print their value as a string.

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
The following fields are extracted for Driver License V1:

## Address
**address** ([StringField](#string-field)): EU driver license holders address

```js
console.log(result.document.inference.prediction.address.value);
```

## Driver License Category
**category** ([StringField](#string-field)): EU driver license holders categories

```js
console.log(result.document.inference.prediction.category.value);
```

## Country Code
**countryCode** ([StringField](#string-field)): Country code extracted as a string.

```js
console.log(result.document.inference.prediction.countryCode.value);
```

## Date Of Birth
**dateOfBirth** ([DateField](#date-field)): The date of birth of the document holder

```js
console.log(result.document.inference.prediction.dateOfBirth.value);
```

## Document ID
**documentId** ([StringField](#string-field)): ID number of the Document.

```js
console.log(result.document.inference.prediction.documentId.value);
```

## Expiry Date
**expiryDate** ([DateField](#date-field)): Date the document expires

```js
console.log(result.document.inference.prediction.expiryDate.value);
```

## First Name
**firstName** ([StringField](#string-field)): First name(s) of the driver license holder

```js
console.log(result.document.inference.prediction.firstName.value);
```

## Issue Authority
**issueAuthority** ([StringField](#string-field)): Authority that issued the document

```js
console.log(result.document.inference.prediction.issueAuthority.value);
```

## Issue Date
**issueDate** ([DateField](#date-field)): Date the document was issued

```js
console.log(result.document.inference.prediction.issueDate.value);
```

## Last Name
**lastName** ([StringField](#string-field)): Last name of the driver license holder.

```js
console.log(result.document.inference.prediction.lastName.value);
```

## MRZ
**mrz** ([StringField](#string-field)): Machine-readable license number

```js
console.log(result.document.inference.prediction.mrz.value);
```

## Photo
[📄](#page-level-fields "This field is only present on individual pages.")**photo** ([PositionField](#position-field)): Has a photo of the EU driver license holder

```js
for (const photoElem of result.document.photo) {
  console.log(photoElem.polygon);
}
```

## Place Of Birth
**placeOfBirth** ([StringField](#string-field)): Place where the driver license holder was born

```js
console.log(result.document.inference.prediction.placeOfBirth.value);
```

## Signature
[📄](#page-level-fields "This field is only present on individual pages.")**signature** ([PositionField](#position-field)): Has a signature of the EU driver license holder

```js
for (const signatureElem of result.document.signature) {
  console.log(signatureElem.polygon);
}
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
