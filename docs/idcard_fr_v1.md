---
title: Carte Nationale d'Identité OCR Node.js
---
The Node.js OCR SDK supports the [Carte Nationale d'Identité API](https://platform.mindee.com/mindee/idcard_fr).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/fr/id_card/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Carte Nationale d'Identité sample](https://github.com/mindee/client-lib-test-data/blob/main/fr/id_card/default_sample.jpg?raw=true)

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
  mindee.product.fr.IdCardV1,
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
:Mindee ID: ef79c45b-1300-474f-af28-de65519cabd7
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/idcard_fr v1.0
:Rotation applied: Yes

Prediction
==========
:Identity Number: 175775H55790
:Given Name(s): VICTOR
:Surname: DAMBARD
:Date of Birth: 1994-04-24
:Place of Birth: LYON 4E ARRONDISSEMT
:Expiry Date: 2030-04-02
:Issuing Authority: SOUS-PREFECTURE DE BELLE (02)
:Gender:
:MRZ Line 1: IDFRADAMBARD<<<<<<<<<<<<<<<<<<075025
:MRZ Line 2: 170775H557903VICTOR<<MARIE<9404246M5

Page Predictions
================

Page 0
------
:Document Side: RECTO & VERSO
:Identity Number: 175775H55790
:Given Name(s): VICTOR
:Surname: DAMBARD
:Date of Birth: 1994-04-24
:Place of Birth: LYON 4E ARRONDISSEMT
:Expiry Date: 2030-04-02
:Issuing Authority: SOUS-PREFECTURE DE BELLE (02)
:Gender:
:MRZ Line 1: IDFRADAMBARD<<<<<<<<<<<<<<<<<<075025
:MRZ Line 2: 170775H557903VICTOR<<MARIE<9404246M5
```

# Field Types
## Standard Fields
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
The text field `StringField` only has one constraint: it's **value** is a `string` (or `undefined`).

## Page-Level Fields
Some fields are constrained to the page level, and so will not be retrievable to through the document.

# Attributes
The following fields are extracted for Carte Nationale d'Identité V1:

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

## Document Side
[📄](#page-level-fields "This field is only present on individual pages.")**documentSide** ([ClassificationField](#classification-field)): The side of the document which is visible.

```js
console.log(result.document.inference.pages[0].prediction.documentSide.value);
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
**givenNames** ([StringField](#string-field)): The given name(s) of the card holder.

```js
console.log(result.document.inference.prediction.givenNames.value);
```

## Identity Number
**idNumber** ([StringField](#string-field)): The identification card number.

```js
console.log(result.document.inference.prediction.idNumber.value);
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
**surname** ([StringField](#string-field)): The surname of the card holder.

```js
console.log(result.document.inference.prediction.surname.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
