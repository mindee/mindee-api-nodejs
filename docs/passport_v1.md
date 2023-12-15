---
title: Passport OCR Node.js
---
The Node.js OCR SDK supports the [Passport API](https://platform.mindee.com/mindee/passport).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/passport/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Passport sample](https://github.com/mindee/client-lib-test-data/blob/main/products/passport/default_sample.jpg?raw=true)

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
  mindee.product.PassportV1,
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
:Mindee ID: 18e41f6c-16cd-4f8e-8cd2-00ca02a35764
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/passport v1.0
:Rotation applied: Yes

Prediction
==========
:Country Code: GBR
:ID Number: 707797979
:Given Name(s): HENERT
:Surname: PUDARSAN
:Date of Birth: 1995-05-20
:Place of Birth: CAMTETH
:Gender: M
:Date of Issue: 2012-04-22
:Expiry Date: 2017-04-22
:MRZ Line 1: P<GBRPUDARSAN<<HENERT<<<<<<<<<<<<<<<<<<<<<<<
:MRZ Line 2: 7077979792GBR9505209M1704224<<<<<<<<<<<<<<00

Page Predictions
================

Page 0
------
:Country Code: GBR
:ID Number: 707797979
:Given Name(s): HENERT
:Surname: PUDARSAN
:Date of Birth: 1995-05-20
:Place of Birth: CAMTETH
:Gender: M
:Date of Issue: 2012-04-22
:Expiry Date: 2017-04-22
:MRZ Line 1: P<GBRPUDARSAN<<HENERT<<<<<<<<<<<<<<<<<<<<<<<
:MRZ Line 2: 7077979792GBR9505209M1704224<<<<<<<<<<<<<<00
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

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

# Attributes
The following fields are extracted for Passport V1:

## Date of Birth
**birthDate** ([DateField](#date-field)): The date of birth of the passport holder.

```js
console.log(result.document.inference.prediction.birthDate.value);
```

## Place of Birth
**birthPlace** ([StringField](#string-field)): The place of birth of the passport holder.

```js
console.log(result.document.inference.prediction.birthPlace.value);
```

## Country Code
**country** ([StringField](#string-field)): The country's 3 letter code (ISO 3166-1 alpha-3).

```js
console.log(result.document.inference.prediction.country.value);
```

## Expiry Date
**expiryDate** ([DateField](#date-field)): The expiry date of the passport.

```js
console.log(result.document.inference.prediction.expiryDate.value);
```

## Gender
**gender** ([StringField](#string-field)): The gender of the passport holder.

```js
console.log(result.document.inference.prediction.gender.value);
```

## Given Name(s)
**givenNames** ([StringField](#string-field)[]): The given name(s) of the passport holder.

```js
for (const givenNamesElem of result.document.inference.prediction.givenNames) {
  console.log(givenNamesElem.value);
}
```

## ID Number
**idNumber** ([StringField](#string-field)): The passport's identification number.

```js
console.log(result.document.inference.prediction.idNumber.value);
```

## Date of Issue
**issuanceDate** ([DateField](#date-field)): The date the passport was issued.

```js
console.log(result.document.inference.prediction.issuanceDate.value);
```

## MRZ Line 1
**mrz1** ([StringField](#string-field)): Machine Readable Zone, first line

```js
console.log(result.document.inference.prediction.mrz1.value);
```

## MRZ Line 2
**mrz2** ([StringField](#string-field)): Machine Readable Zone, second line

```js
console.log(result.document.inference.prediction.mrz2.value);
```

## Surname
**surname** ([StringField](#string-field)): The surname of the passport holder.

```js
console.log(result.document.inference.prediction.surname.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
