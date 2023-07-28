# Carte Nationale d'Identité API version 1

## Table of Contents
- [Carte Nationale d'Identité API version 1](#carte-nationale-didentité-api-version-1)
  - [Table of Contents](#table-of-contents)
  - [Quick-Start](#quick-start)
  - [Field Types](#field-types)
    - [Standard Fields](#standard-fields)
      - [Basic Field](#basic-field)
      - [Classification Field](#classification-field)
      - [Date Field](#date-field)
      - [String Field](#string-field)
    - [Page-Level Fields](#page-level-fields)
  - [Attributes](#attributes)
    - [Issuing Authority](#issuing-authority)
    - [Date of Birth](#date-of-birth)
    - [Place of Birth](#place-of-birth)
    - [Document Side](#document-side)
    - [Expiry Date](#expiry-date)
    - [Gender](#gender)
    - [Given Name(s)](#given-names)
    - [Identity Number](#identity-number)
    - [MRZ Line 1](#mrz-line-1)
    - [MRZ Line 2](#mrz-line-2)
    - [Surname](#surname)
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
  mindee.product.fr.IdCardV1,
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


#### Classification Field

The classification field `ClassificationField` does not implement all the basic `Field` attributes. It only implements **value**, **confidence** and **pageId**.

> Note: a classification field's `value is always a `string`.


#### Date Field

Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.


#### String Field

The text field `StringField` only has one constraint: it's **value** is a `string` (or `undefined`).


### Page-Level Fields

Some fields are constrained to the page level, and so will not be retrievable to through the document.


## Attributes

The following fields are extracted for Carte Nationale d'Identité V1:


### Issuing Authority

**authority**  ([StringField](#string-field)): The name of the issuing authority.

```js
console.log(result.document.inference.prediction.authority.toString());
```

### Date of Birth

**birthDate**  ([DateField](#date-field)): The date of birth of the card holder.

```js
console.log(result.document.inference.prediction.birthDate.toString());
```

### Place of Birth

**birthPlace**  ([StringField](#string-field)): The place of birth of the card holder.

```js
console.log(result.document.inference.prediction.birthPlace.toString());
```

### Document Side

[📄](#page-level-fields "This field is only present on individual pages.")**documentSide**  ([ClassificationField](#classification-field)): The side of the document which is visible.

```js
console.log(result.document.inference.pages[0].prediction.documentSide.toString());
```

### Expiry Date

**expiryDate**  ([DateField](#date-field)): The expiry date of the identification card.

```js
console.log(result.document.inference.prediction.expiryDate.toString());
```

### Gender

**gender**  ([StringField](#string-field)): The gender of the card holder.

```js
console.log(result.document.inference.prediction.gender.toString());
```

### Given Name(s)

**givenNames**  ([StringField](#string-field)): The given name(s) of the card holder.

```js
console.log(result.document.inference.prediction.givenNames.toString());
```

### Identity Number

**idNumber**  ([StringField](#string-field)): The identification card number.

```js
console.log(result.document.inference.prediction.idNumber.toString());
```

### MRZ Line 1

**mrz1**  ([StringField](#string-field)): Machine Readable Zone, first line

```js
console.log(result.document.inference.prediction.mrz1.toString());
```

### MRZ Line 2

**mrz2**  ([StringField](#string-field)): Machine Readable Zone, second line

```js
console.log(result.document.inference.prediction.mrz2.toString());
```

### Surname

**surname**  ([StringField](#string-field)): The surname of the card holder.

```js
console.log(result.document.inference.prediction.surname.toString());
```

## Questions?

[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
