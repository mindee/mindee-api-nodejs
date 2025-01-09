---
title: Driver License OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-driver-license-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Driver License API](https://platform.mindee.com/mindee/driver_license).

The [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/driver_license/default_sample.jpg) can be used for testing purposes.
![Driver License sample](https://github.com/mindee/client-lib-test-data/blob/main/products/driver_license/default_sample.jpg?raw=true)

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
  mindee.product.DriverLicenseV1,
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

# Attributes
The following fields are extracted for Driver License V1:

## Category
**category** ([StringField](#string-field)): The category or class of the driver license.

```js
console.log(result.document.inference.prediction.category.value);
```

## Country Code
**countryCode** ([StringField](#string-field)): The alpha-3 ISO 3166 code of the country where the driver license was issued.

```js
console.log(result.document.inference.prediction.countryCode.value);
```

## Date of Birth
**dateOfBirth** ([DateField](#date-field)): The date of birth of the driver license holder.

```js
console.log(result.document.inference.prediction.dateOfBirth.value);
```

## DD Number
**ddNumber** ([StringField](#string-field)): The DD number of the driver license.

```js
console.log(result.document.inference.prediction.ddNumber.value);
```

## Expiry Date
**expiryDate** ([DateField](#date-field)): The expiry date of the driver license.

```js
console.log(result.document.inference.prediction.expiryDate.value);
```

## First Name
**firstName** ([StringField](#string-field)): The first name of the driver license holder.

```js
console.log(result.document.inference.prediction.firstName.value);
```

## ID
**id** ([StringField](#string-field)): The unique identifier of the driver license.

```js
console.log(result.document.inference.prediction.id.value);
```

## Issued Date
**issuedDate** ([DateField](#date-field)): The date when the driver license was issued.

```js
console.log(result.document.inference.prediction.issuedDate.value);
```

## Issuing Authority
**issuingAuthority** ([StringField](#string-field)): The authority that issued the driver license.

```js
console.log(result.document.inference.prediction.issuingAuthority.value);
```

## Last Name
**lastName** ([StringField](#string-field)): The last name of the driver license holder.

```js
console.log(result.document.inference.prediction.lastName.value);
```

## MRZ
**mrz** ([StringField](#string-field)): The Machine Readable Zone (MRZ) of the driver license.

```js
console.log(result.document.inference.prediction.mrz.value);
```

## Place of Birth
**placeOfBirth** ([StringField](#string-field)): The place of birth of the driver license holder.

```js
console.log(result.document.inference.prediction.placeOfBirth.value);
```

## State
**state** ([StringField](#string-field)): Second part of the ISO 3166-2 code, consisting of two letters indicating the US State.

```js
console.log(result.document.inference.prediction.state.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
