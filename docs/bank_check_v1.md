# Bank Check API version 1

## Table of Contents
- [Bank Check API version 1](#bank-check-api-version-1)
  - [Table of Contents](#table-of-contents)
  - [Quick-Start](#quick-start)
  - [Field Types](#field-types)
    - [Standard Fields](#standard-fields)
      - [Basic Field](#basic-field)
      - [Amount Field](#amount-field)
      - [Date Field](#date-field)
      - [Position Field](#position-field)
      - [String Field](#string-field)
    - [Page-Level Fields](#page-level-fields)
  - [Attributes](#attributes)
    - [Account Number](#account-number)
    - [Amount](#amount)
    - [Check Number](#check-number)
    - [Check Position](#check-position)
    - [Check Issue Date](#check-issue-date)
    - [Payees](#payees)
    - [Routing Number](#routing-number)
    - [Signature Positions](#signature-positions)
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
  mindee.product.us.BankCheckV1,
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


#### Amount Field

The amount field `AmountField` only has one constraint: its **value** is a `number` (or `undefined`).


#### Date Field

Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.


#### Position Field

The position field `PositionField` does not implement all the basic `Field` attributes, only `boundingBox`, `polygon` and **pageId**. On top of these, it has access to:

* **rectangle** (`[Point, Point, Point, Point]`): a Polygon with four points that may be oriented (even beyond canvas).
* **quadrangle** (`[Point, Point, Point, Point]`): a free polygon made up of four points.


#### String Field

The text field `StringField` only has one constraint: it's **value** is a `string` (or `undefined`).


### Page-Level Fields

Some fields are constrained to the page level, and so will not be retrievable to through the document.


## Attributes

The following fields are extracted for Bank Check V1:


### Account Number

**accountNumber**  ([StringField](#string-field)): The check payer's account number.

```js
console.log(result.document.inference.prediction.accountNumber.toString());
```

### Amount

**amount**  ([AmountField](#amount-field)): The amount of the check.

```js
console.log(result.document.inference.prediction.amount.toString());
```

### Check Number

**checkNumber**  ([StringField](#string-field)): The issuer's check number.

```js
console.log(result.document.inference.prediction.checkNumber.toString());
```

### Check Position

[📄](#page-level-fields "This field is only present on individual pages.")**checkPosition**  ([PositionField](#position-field)): The position of the check on the document.

```js
console.log(result.document.inference.pages[0].prediction.checkPosition.toString());
```

### Check Issue Date

**date**  ([DateField](#date-field)): The date the check was issued.

```js
console.log(result.document.inference.prediction.date.toString());
```

### Payees

**payees**  ([StringField](#string-field)): List of the check's payees (recipients).

```js
console.log(result.document.inference.prediction.payees.toString());
```

### Routing Number

**routingNumber**  ([StringField](#string-field)): The check issuer's routing number.

```js
console.log(result.document.inference.prediction.routingNumber.toString());
```

### Signature Positions

[📄](#page-level-fields "This field is only present on individual pages.")**signaturesPositions**  ([PositionField](#position-field)): List of signature positions

```js
console.log(result.document.inference.pages[0].prediction.signaturesPositions.toString());
```

## Questions?

[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
