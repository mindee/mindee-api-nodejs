# Bank Account Details API version 1

## Table of Contents
- [Bank Account Details API version 1](#bank-account-details-api-version-1)
  - [Table of Contents](#table-of-contents)
  - [Quick-Start](#quick-start)
  - [Field Types](#field-types)
    - [Standard Fields](#standard-fields)
      - [Basic Field](#basic-field)
      - [String Field](#string-field)
  - [Attributes](#attributes)
    - [Account Holder's Name](#account-holders-name)
    - [IBAN](#iban)
    - [SWIFT Code](#swift-code)
  - [Questions?](#questions)

## Quick-Start

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
  mindee.product.fr.BankAccountDetailsV1,
  inputSource
);

// Handle the response Promise
apiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
```

## Field Types

### Standard Fields

#### Basic Field

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


#### String Field

The text field `StringField` only has one constraint: it's **value** is a `string` (or `undefined`).


## Attributes

The following fields are extracted for Bank Account Details V1:


### Account Holder's Name

**accountHolderName**  ([StringField](#string-field)): The name of the account holder as seen on the document.

```js
console.log(result.document.inference.prediction.accountHolderName.toString());
```

### IBAN

**iban**  ([StringField](#string-field)): The International Bank Account Number (IBAN).

```js
console.log(result.document.inference.prediction.iban.toString());
```

### SWIFT Code

**swift**  ([StringField](#string-field)): The bank's SWIFT Business Identifier Code (BIC).

```js
console.log(result.document.inference.prediction.swift.toString());
```

## Questions?

[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
