---
title: US W9 OCR Node.js
---
The Node.js OCR SDK supports the [US W9 API](https://platform.mindee.com/mindee/us_w9).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/us_w9/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![US W9 sample](https://github.com/mindee/client-lib-test-data/blob/main/products/us_w9/default_sample.jpg?raw=true)

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
  mindee.product.us.W9V1,
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


### Position Field
The position field `PositionField` does not implement all the basic `Field` attributes, only **boundingBox**, **polygon** and **pageId**. On top of these, it has access to:

* **rectangle** (`[Point, Point, Point, Point]`): a Polygon with four points that may be oriented (even beyond canvas).
* **quadrangle** (`[Point, Point, Point, Point]`): a free polygon made up of four points.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

## Page-Level Fields
Some fields are constrained to the page level, and so will not be retrievable to through the document.

# Attributes
The following fields are extracted for US W9 V1:

## Address
[📄](#page-level-fields "This field is only present on individual pages.")**address** ([StringField](#string-field)): The street address (number, street, and apt. or suite no.) of the applicant.

```js
for (const addressElem of result.document.address) {
  console.log(addressElem.value);
}
```

## Business Name
[📄](#page-level-fields "This field is only present on individual pages.")**businessName** ([StringField](#string-field)): The business name or disregarded entity name, if different from Name.

```js
for (const businessNameElem of result.document.businessName) {
  console.log(businessNameElem.value);
}
```

## City State Zip
[📄](#page-level-fields "This field is only present on individual pages.")**cityStateZip** ([StringField](#string-field)): The city, state, and ZIP code of the applicant.

```js
for (const cityStateZipElem of result.document.cityStateZip) {
  console.log(cityStateZipElem.value);
}
```

## EIN
[📄](#page-level-fields "This field is only present on individual pages.")**ein** ([StringField](#string-field)): The employer identification number.

```js
for (const einElem of result.document.ein) {
  console.log(einElem.value);
}
```

## Name
[📄](#page-level-fields "This field is only present on individual pages.")**name** ([StringField](#string-field)): Name as shown on the applicant's income tax return.

```js
for (const nameElem of result.document.name) {
  console.log(nameElem.value);
}
```

## Signature Date Position
[📄](#page-level-fields "This field is only present on individual pages.")**signatureDatePosition** ([PositionField](#position-field)): Position of the signature date on the document.

```js
for (const signatureDatePositionElem of result.document.signatureDatePosition) {
  console.log(signatureDatePositionElem.polygon);
}
```

## Signature Position
[📄](#page-level-fields "This field is only present on individual pages.")**signaturePosition** ([PositionField](#position-field)): Position of the signature on the document.

```js
for (const signaturePositionElem of result.document.signaturePosition) {
  console.log(signaturePositionElem.polygon);
}
```

## SSN
[📄](#page-level-fields "This field is only present on individual pages.")**ssn** ([StringField](#string-field)): The applicant's social security number.

```js
for (const ssnElem of result.document.ssn) {
  console.log(ssnElem.value);
}
```

## Tax Classification
[📄](#page-level-fields "This field is only present on individual pages.")**taxClassification** ([StringField](#string-field)): The federal tax classification, which can vary depending on the revision date.

```js
for (const taxClassificationElem of result.document.taxClassification) {
  console.log(taxClassificationElem.value);
}
```

## Tax Classification LLC
[📄](#page-level-fields "This field is only present on individual pages.")**taxClassificationLlc** ([StringField](#string-field)): Depending on revision year, among S, C, P or D for Limited Liability Company Classification.

```js
for (const taxClassificationLlcElem of result.document.taxClassificationLlc) {
  console.log(taxClassificationLlcElem.value);
}
```

## Tax Classification Other Details
[📄](#page-level-fields "This field is only present on individual pages.")**taxClassificationOtherDetails** ([StringField](#string-field)): Tax Classification Other Details.

```js
for (const taxClassificationOtherDetailsElem of result.document.taxClassificationOtherDetails) {
  console.log(taxClassificationOtherDetailsElem.value);
}
```

## W9 Revision Date
[📄](#page-level-fields "This field is only present on individual pages.")**w9RevisionDate** ([StringField](#string-field)): The Revision month and year of the W9 form.

```js
for (const w9RevisionDateElem of result.document.w9RevisionDate) {
  console.log(w9RevisionDateElem.value);
}
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
