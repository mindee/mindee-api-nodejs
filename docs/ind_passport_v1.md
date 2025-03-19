---
title: IND Passport - India OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-ind-passport---india-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Passport - India API](https://platform.mindee.com/mindee/ind_passport).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/ind_passport/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Passport - India sample](https://github.com/mindee/client-lib-test-data/blob/main/products/ind_passport/default_sample.jpg?raw=true)

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
  mindee.product.ind.IndianPassportV1,
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
:Mindee ID: cf88fd43-eaa1-497a-ba29-a9569a4edaa7
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/ind_passport v1.0
:Rotation applied: Yes

Prediction
==========
:Page Number: 1
:Country: IND
:ID Number: J8369854
:Given Names: JOCELYN MICHELLE
:Surname: DOE
:Birth Date: 1959-09-23
:Birth Place: GUNDUGOLANU
:Issuance Place: HYDERABAD
:Gender: F
:Issuance Date: 2011-10-11
:Expiry Date: 2021-10-10
:MRZ Line 1: P<DOE<<JOCELYNMICHELLE<<<<<<<<<<<<<<<<<<<<<
:MRZ Line 2: J8369854<4IND5909234F2110101<<<<<<<<<<<<<<<8
:Legal Guardian:
:Name of Spouse:
:Name of Mother:
:Old Passport Date of Issue:
:Old Passport Number:
:Address Line 1:
:Address Line 2:
:Address Line 3:
:Old Passport Place of Issue:
:File Number:
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
The following fields are extracted for Passport - India V1:

## Address Line 1
**address1** ([StringField](#string-field)): The first line of the address of the passport holder.

```js
console.log(result.document.inference.prediction.address1.value);
```

## Address Line 2
**address2** ([StringField](#string-field)): The second line of the address of the passport holder.

```js
console.log(result.document.inference.prediction.address2.value);
```

## Address Line 3
**address3** ([StringField](#string-field)): The third line of the address of the passport holder.

```js
console.log(result.document.inference.prediction.address3.value);
```

## Birth Date
**birthDate** ([DateField](#date-field)): The birth date of the passport holder, ISO format: YYYY-MM-DD.

```js
console.log(result.document.inference.prediction.birthDate.value);
```

## Birth Place
**birthPlace** ([StringField](#string-field)): The birth place of the passport holder.

```js
console.log(result.document.inference.prediction.birthPlace.value);
```

## Country
**country** ([StringField](#string-field)): ISO 3166-1 alpha-3 country code (3 letters format).

```js
console.log(result.document.inference.prediction.country.value);
```

## Expiry Date
**expiryDate** ([DateField](#date-field)): The date when the passport will expire, ISO format: YYYY-MM-DD.

```js
console.log(result.document.inference.prediction.expiryDate.value);
```

## File Number
**fileNumber** ([StringField](#string-field)): The file number of the passport document.

```js
console.log(result.document.inference.prediction.fileNumber.value);
```

## Gender
**gender** ([ClassificationField](#classification-field)): The gender of the passport holder.

#### Possible values include:
 - 'M'
 - 'F'

```js
console.log(result.document.inference.prediction.gender.value);
```

## Given Names
**givenNames** ([StringField](#string-field)): The given names of the passport holder.

```js
console.log(result.document.inference.prediction.givenNames.value);
```

## ID Number
**idNumber** ([StringField](#string-field)): The identification number of the passport document.

```js
console.log(result.document.inference.prediction.idNumber.value);
```

## Issuance Date
**issuanceDate** ([DateField](#date-field)): The date when the passport was issued, ISO format: YYYY-MM-DD.

```js
console.log(result.document.inference.prediction.issuanceDate.value);
```

## Issuance Place
**issuancePlace** ([StringField](#string-field)): The place where the passport was issued.

```js
console.log(result.document.inference.prediction.issuancePlace.value);
```

## Legal Guardian
**legalGuardian** ([StringField](#string-field)): The name of the legal guardian of the passport holder (if applicable).

```js
console.log(result.document.inference.prediction.legalGuardian.value);
```

## MRZ Line 1
**mrz1** ([StringField](#string-field)): The first line of the machine-readable zone (MRZ) of the passport document.

```js
console.log(result.document.inference.prediction.mrz1.value);
```

## MRZ Line 2
**mrz2** ([StringField](#string-field)): The second line of the machine-readable zone (MRZ) of the passport document.

```js
console.log(result.document.inference.prediction.mrz2.value);
```

## Name of Mother
**nameOfMother** ([StringField](#string-field)): The name of the mother of the passport holder.

```js
console.log(result.document.inference.prediction.nameOfMother.value);
```

## Name of Spouse
**nameOfSpouse** ([StringField](#string-field)): The name of the spouse of the passport holder (if applicable).

```js
console.log(result.document.inference.prediction.nameOfSpouse.value);
```

## Old Passport Date of Issue
**oldPassportDateOfIssue** ([DateField](#date-field)): The date of issue of the old passport (if applicable), ISO format: YYYY-MM-DD.

```js
console.log(result.document.inference.prediction.oldPassportDateOfIssue.value);
```

## Old Passport Number
**oldPassportNumber** ([StringField](#string-field)): The number of the old passport (if applicable).

```js
console.log(result.document.inference.prediction.oldPassportNumber.value);
```

## Old Passport Place of Issue
**oldPassportPlaceOfIssue** ([StringField](#string-field)): The place of issue of the old passport (if applicable).

```js
console.log(result.document.inference.prediction.oldPassportPlaceOfIssue.value);
```

## Page Number
**pageNumber** ([ClassificationField](#classification-field)): The page number of the passport document.

#### Possible values include:
 - '1'
 - '2'

```js
console.log(result.document.inference.prediction.pageNumber.value);
```

## Surname
**surname** ([StringField](#string-field)): The surname of the passport holder.

```js
console.log(result.document.inference.prediction.surname.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
