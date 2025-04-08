---
title: US Healthcare Card OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-us-healthcare-card-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Healthcare Card API](https://platform.mindee.com/mindee/us_healthcare_cards).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/us_healthcare_cards/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Healthcare Card sample](https://github.com/mindee/client-lib-test-data/blob/main/products/us_healthcare_cards/default_sample.jpg?raw=true)

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
  mindee.product.us.HealthcareCardV1,
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
:Mindee ID: 0ced9f49-00c0-4a1d-8221-4a1538813a95
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/us_healthcare_cards v1.0
:Rotation applied: No

Prediction
==========
:Company Name: UnitedHealthcare
:Member Name: SUBSCRIBER SMITH
:Member ID: 123456789
:Issuer 80840:
:Dependents: SPOUSE SMITH
             CHILD1 SMITH
             CHILD2 SMITH
             CHILD3 SMITH
:Group Number: 98765
:Payer ID: 87726
:RX BIN: 610279
:RX GRP: UHEALTH
:RX PCN: 9999
:copays:
  +--------------+--------------+
  | Service Fees | Service Name |
  +==============+==============+
  | 20.00        | office visit |
  +--------------+--------------+
  | 300.00       | emergency    |
  +--------------+--------------+
  | 75.00        | urgent care  |
  +--------------+--------------+
  | 30.00        | specialist   |
  +--------------+--------------+
:Enrollment Date: 2023-09-13
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

## Specific Fields
Fields which are specific to this product; they are not used in any other product.

### copays Field
Is a fixed amount for a covered service.

A `HealthcareCardV1Copay` implements the following attributes:

* `serviceFees` (number): The price of service.
* `serviceName` (string): The name of service of the copay.

#### Possible values include:
 - primary_care
 - emergency_room
 - urgent_care
 - specialist
 - office_visit
 - prescription


# Attributes
The following fields are extracted for Healthcare Card V1:

## Company Name
**companyName** ([StringField](#string-field)): The name of the company that provides the healthcare plan.

```js
console.log(result.document.inference.prediction.companyName.value);
```

## copays
**copays** ([HealthcareCardV1Copay](#copays-field)[]): Is a fixed amount for a covered service.

```js
for (const copaysElem of result.document.inference.prediction.copays) {
  console.log(copaysElem.value);
}
```

## Dependents
**dependents** ([StringField](#string-field)[]): The list of dependents covered by the healthcare plan.

```js
for (const dependentsElem of result.document.inference.prediction.dependents) {
  console.log(dependentsElem.value);
}
```

## Enrollment Date
**enrollmentDate** ([DateField](#date-field)): The date when the member enrolled in the healthcare plan.

```js
console.log(result.document.inference.prediction.enrollmentDate.value);
```

## Group Number
**groupNumber** ([StringField](#string-field)): The group number associated with the healthcare plan.

```js
console.log(result.document.inference.prediction.groupNumber.value);
```

## Issuer 80840
**issuer80840** ([StringField](#string-field)): The organization that issued the healthcare plan.

```js
console.log(result.document.inference.prediction.issuer80840.value);
```

## Member ID
**memberId** ([StringField](#string-field)): The unique identifier for the member in the healthcare system.

```js
console.log(result.document.inference.prediction.memberId.value);
```

## Member Name
**memberName** ([StringField](#string-field)): The name of the member covered by the healthcare plan.

```js
console.log(result.document.inference.prediction.memberName.value);
```

## Payer ID
**payerId** ([StringField](#string-field)): The unique identifier for the payer in the healthcare system.

```js
console.log(result.document.inference.prediction.payerId.value);
```

## RX BIN
**rxBin** ([StringField](#string-field)): The BIN number for prescription drug coverage.

```js
console.log(result.document.inference.prediction.rxBin.value);
```

## RX GRP
**rxGrp** ([StringField](#string-field)): The group number for prescription drug coverage.

```js
console.log(result.document.inference.prediction.rxGrp.value);
```

## RX ID
**rxId** ([StringField](#string-field)): The ID number for prescription drug coverage.

```js
console.log(result.document.inference.prediction.rxId.value);
```

## RX PCN
**rxPcn** ([StringField](#string-field)): The PCN number for prescription drug coverage.

```js
console.log(result.document.inference.prediction.rxPcn.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
