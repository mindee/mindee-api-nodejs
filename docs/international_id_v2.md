---
title: International ID OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-international-id-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [International ID API](https://platform.mindee.com/mindee/international_id).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/international_id/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![International ID sample](https://github.com/mindee/client-lib-test-data/blob/main/products/international_id/default_sample.jpg?raw=true)

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
  mindee.product.InternationalIdV2,
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
:Mindee ID: cfa20a58-20cf-43b6-8cec-9505fa69d1c2
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/international_id v2.0
:Rotation applied: No

Prediction
==========
:Document Type: IDENTIFICATION_CARD
:Document Number: 12345678A
:Surnames: MUESTRA
           MUESTRA
:Given Names: CARMEN
:Sex: F
:Birth Date: 1980-01-01
:Birth Place: CAMPO DE CRIPTANA CIUDAD REAL ESPANA
:Nationality: ESP
:Personal Number: BAB1834284<44282767Q0
:Country of Issue: ESP
:State of Issue: MADRID
:Issue Date:
:Expiration Date: 2030-01-01
:Address: C/REAL N13, 1 DCHA COLLADO VILLALBA MADRID MADRID MADRID
:MRZ Line 1: IDESPBAB1834284<44282767Q0<<<<
:MRZ Line 2: 8001010F1301017ESP<<<<<<<<<<<3
:MRZ Line 3: MUESTRA<MUESTRA<<CARMEN<<<<<<<
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


### Classification Field
The classification field `ClassificationField` does not implement all the basic `Field` attributes. It only implements **value**, **confidence** and **pageId**.

> Note: a classification field's `value is always a `string`.

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

# Attributes
The following fields are extracted for International ID V2:

## Address
**address** ([StringField](#string-field)): The physical address of the document holder.

```js
console.log(result.document.inference.prediction.address.value);
```

## Birth Date
**birthDate** ([DateField](#date-field)): The date of birth of the document holder.

```js
console.log(result.document.inference.prediction.birthDate.value);
```

## Birth Place
**birthPlace** ([StringField](#string-field)): The place of birth of the document holder.

```js
console.log(result.document.inference.prediction.birthPlace.value);
```

## Country of Issue
**countryOfIssue** ([StringField](#string-field)): The country where the document was issued.

```js
console.log(result.document.inference.prediction.countryOfIssue.value);
```

## Document Number
**documentNumber** ([StringField](#string-field)): The unique identifier assigned to the document.

```js
console.log(result.document.inference.prediction.documentNumber.value);
```

## Document Type
**documentType** ([ClassificationField](#classification-field)): The type of personal identification document.

#### Possible values include:
 - 'IDENTIFICATION_CARD'
 - 'PASSPORT'
 - 'DRIVER_LICENSE'
 - 'VISA'
 - 'RESIDENCY_CARD'
 - 'VOTER_REGISTRATION'

```js
console.log(result.document.inference.prediction.documentType.value);
```

## Expiration Date
**expiryDate** ([DateField](#date-field)): The date when the document becomes invalid.

```js
console.log(result.document.inference.prediction.expiryDate.value);
```

## Given Names
**givenNames** ([StringField](#string-field)[]): The list of the document holder's given names.

```js
for (const givenNamesElem of result.document.inference.prediction.givenNames) {
  console.log(givenNamesElem.value);
}
```

## Issue Date
**issueDate** ([DateField](#date-field)): The date when the document was issued.

```js
console.log(result.document.inference.prediction.issueDate.value);
```

## MRZ Line 1
**mrzLine1** ([StringField](#string-field)): The Machine Readable Zone, first line.

```js
console.log(result.document.inference.prediction.mrzLine1.value);
```

## MRZ Line 2
**mrzLine2** ([StringField](#string-field)): The Machine Readable Zone, second line.

```js
console.log(result.document.inference.prediction.mrzLine2.value);
```

## MRZ Line 3
**mrzLine3** ([StringField](#string-field)): The Machine Readable Zone, third line.

```js
console.log(result.document.inference.prediction.mrzLine3.value);
```

## Nationality
**nationality** ([StringField](#string-field)): The country of citizenship of the document holder.

```js
console.log(result.document.inference.prediction.nationality.value);
```

## Personal Number
**personalNumber** ([StringField](#string-field)): The unique identifier assigned to the document holder.

```js
console.log(result.document.inference.prediction.personalNumber.value);
```

## Sex
**sex** ([StringField](#string-field)): The biological sex of the document holder.

```js
console.log(result.document.inference.prediction.sex.value);
```

## State of Issue
**stateOfIssue** ([StringField](#string-field)): The state or territory where the document was issued.

```js
console.log(result.document.inference.prediction.stateOfIssue.value);
```

## Surnames
**surnames** ([StringField](#string-field)[]): The list of the document holder's family names.

```js
for (const surnamesElem of result.document.inference.prediction.surnames) {
  console.log(surnamesElem.value);
}
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
