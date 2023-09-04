---
title: FR Bank Account Details OCR Node.js
---
The Node.js OCR SDK supports the [Bank Account Details API](https://platform.mindee.com/mindee/bank_account_details).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/bank_account_details/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Bank Account Details sample](https://github.com/mindee/client-lib-test-data/blob/main/products/bank_account_details/default_sample.jpg?raw=true)

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
  mindee.product.fr.BankAccountDetailsV2,
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
:Mindee ID: bc8f7265-8dab-49fe-810c-d50049605578
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/bank_account_details v2.0
:Rotation applied: Yes

Prediction
==========
:Account Holder's Names: MME HEGALALDIA L ENVOL
:Basic Bank Account Number:
  :Bank Code: 13335
  :Branch Code: 00040
  :Key: 06
  :Account Number: 08932891361
:IBAN: FR7613335000400893289136106
:SWIFT Code: CEPAFRPP333

Page Predictions
================

Page 0
------
:Account Holder's Names: MME HEGALALDIA L ENVOL
:Basic Bank Account Number:
  :Bank Code: 13335
  :Branch Code: 00040
  :Key: 06
  :Account Number: 08932891361
:IBAN: FR7613335000400893289136106
:SWIFT Code: CEPAFRPP333
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

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

## Specific Fields
Fields which are specific to this product; they are not used in any other product.

### Basic Bank Account Number Field
Full extraction of BBAN, including: branch code, bank code, account and key.

A `BankAccountDetailsV2Bban` implements the following attributes:

* `bbanBankCode` (string): The BBAN bank code outputted as a string.
* `bbanBranchCode` (string): The BBAN branch code outputted as a string.
* `bbanKey` (string): The BBAN key outputted as a string.
* `bbanNumber` (string): The BBAN Account number outputted as a string.

# Attributes
The following fields are extracted for Bank Account Details V2:

## Account Holder's Names
**accountHoldersNames** ([StringField](#string-field)): Full extraction of the account holders names.

```js
console.log(result.document.inference.prediction.accountHoldersNames.value);
```

## Basic Bank Account Number
**bban** ([BankAccountDetailsV2Bban](#basic-bank-account-number-field)): Full extraction of BBAN, including: branch code, bank code, account and key.

```js
console.log(result.document.inference.prediction.bban.value);
```

## IBAN
**iban** ([StringField](#string-field)): Full extraction of the IBAN number.

```js
console.log(result.document.inference.prediction.iban.value);
```

## SWIFT Code
**swiftCode** ([StringField](#string-field)): Full extraction of the SWIFT code.

```js
console.log(result.document.inference.prediction.swiftCode.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
