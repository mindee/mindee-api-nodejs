---
title: FR Carte Nationale d'Identité OCR Node.js
---
The Node.js OCR SDK supports the [Carte Nationale d'Identité API](https://platform.mindee.com/mindee/idcard_fr).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/idcard_fr/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Carte Nationale d'Identité sample](https://github.com/mindee/client-lib-test-data/blob/main/products/idcard_fr/default_sample.jpg?raw=true)

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
  mindee.product.fr.IdCardV2,
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


### Classification Field
The classification field `ClassificationField` does not implement all the basic `Field` attributes. It only implements **value**, **confidence** and **pageId**.

> Note: a classification field's `value is always a `string`.

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

## Page-Level Fields
Some fields are constrained to the page level, and so will not be retrievable to through the document.

# Attributes
The following fields are extracted for Carte Nationale d'Identité V2:

## Alternate Name
**alternateName** ([StringField](#string-field)): The alternate name of the card holder.

```js
console.log(result.document.inference.prediction.alternateName.value);
```

## Issuing Authority
**authority** ([StringField](#string-field)): The name of the issuing authority.

```js
console.log(result.document.inference.prediction.authority.value);
```

## Date of Birth
**birthDate** ([DateField](#date-field)): The date of birth of the card holder.

```js
console.log(result.document.inference.prediction.birthDate.value);
```

## Place of Birth
**birthPlace** ([StringField](#string-field)): The place of birth of the card holder.

```js
console.log(result.document.inference.prediction.birthPlace.value);
```

## Card Access Number
**cardAccessNumber** ([StringField](#string-field)): The card access number (CAN).

```js
console.log(result.document.inference.prediction.cardAccessNumber.value);
```

## Document Number
**documentNumber** ([StringField](#string-field)): The document number.

```js
console.log(result.document.inference.prediction.documentNumber.value);
```

## Document Sides
[📄](#page-level-fields "This field is only present on individual pages.")**documentSide** ([ClassificationField](#classification-field)): The sides of the document which are visible.

```js
for (const documentSideElem of result.document.documentSide) {
  console.log(documentSideElem.value);
}
```

## Document Type
[📄](#page-level-fields "This field is only present on individual pages.")**documentType** ([ClassificationField](#classification-field)): The document type or format.

```js
for (const documentTypeElem of result.document.documentType) {
  console.log(documentTypeElem.value);
}
```

## Expiry Date
**expiryDate** ([DateField](#date-field)): The expiry date of the identification card.

```js
console.log(result.document.inference.prediction.expiryDate.value);
```

## Gender
**gender** ([StringField](#string-field)): The gender of the card holder.

```js
console.log(result.document.inference.prediction.gender.value);
```

## Given Name(s)
**givenNames** ([StringField](#string-field)[]): The given name(s) of the card holder.

```js
for (const givenNamesElem of result.document.inference.prediction.givenNames) {
  console.log(givenNamesElem.value);
}
```

## Date of Issue
**issueDate** ([DateField](#date-field)): The date of issue of the identification card.

```js
console.log(result.document.inference.prediction.issueDate.value);
```

## Mrz Line 1
**mrz1** ([StringField](#string-field)): The Machine Readable Zone, first line.

```js
console.log(result.document.inference.prediction.mrz1.value);
```

## Mrz Line 2
**mrz2** ([StringField](#string-field)): The Machine Readable Zone, second line.

```js
console.log(result.document.inference.prediction.mrz2.value);
```

## Mrz Line 3
**mrz3** ([StringField](#string-field)): The Machine Readable Zone, third line.

```js
console.log(result.document.inference.prediction.mrz3.value);
```

## Nationality
**nationality** ([StringField](#string-field)): The nationality of the card holder.

```js
console.log(result.document.inference.prediction.nationality.value);
```

## Surname
**surname** ([StringField](#string-field)): The surname of the card holder.

```js
console.log(result.document.inference.prediction.surname.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
