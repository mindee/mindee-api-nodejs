---
title: FR Carte Vitale OCR Node.js
---
The Node.js OCR SDK supports the [Carte Vitale API](https://platform.mindee.com/mindee/carte_vitale).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/fr/carte_vitale/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Carte Vitale sample](https://github.com/mindee/client-lib-test-data/blob/main/fr/carte_vitale/default_sample.jpg?raw=true)

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
  mindee.product.fr.CarteVitaleV1,
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
:Mindee ID: 8c25cc63-212b-4537-9c9b-3fbd3bd0ee20
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/carte_vitale v1.0
:Rotation applied: Yes

Prediction
==========
:Given Name(s): NATHALIE
:Surname: DURAND
:Social Security Number: 269054958815780
:Issuance Date: 2007-01-01

Page Predictions
================

Page 0
------
:Given Name(s): NATHALIE
:Surname: DURAND
:Social Security Number: 269054958815780
:Issuance Date: 2007-01-01
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

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.

### String Field
The text field `StringField` only has one constraint: it's **value** is a `string` (or `undefined`).

# Attributes
The following fields are extracted for Carte Vitale V1:

## Given Name(s)
**givenNames** ([StringField](#string-field)): The given name(s) of the card holder.

```js
console.log(result.document.inference.prediction.givenNames.value);
```

## Issuance Date
**issuanceDate** ([DateField](#date-field)): The date the card was issued.

```js
console.log(result.document.inference.prediction.issuanceDate.value);
```

## Social Security Number
**socialSecurity** ([StringField](#string-field)): The Social Security Number (Numéro de Sécurité Sociale) of the card holder

```js
console.log(result.document.inference.prediction.socialSecurity.value);
```

## Surname
**surname** ([StringField](#string-field)): The surname of the card holder.

```js
console.log(result.document.inference.prediction.surname.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
