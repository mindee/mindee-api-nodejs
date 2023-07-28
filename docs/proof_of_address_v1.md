# Proof of Address API version 1

## Table of Contents
- [Proof of Address API version 1](#proof-of-address-api-version-1)
  - [Table of Contents](#table-of-contents)
  - [Quick-Start](#quick-start)
  - [Field Types](#field-types)
    - [Standard Fields](#standard-fields)
      - [Basic Field](#basic-field)
      - [Company Registration Field](#company-registration-field)
      - [Date Field](#date-field)
      - [Locale Field](#locale-field)
      - [String Field](#string-field)
  - [Attributes](#attributes)
    - [Date of Issue](#date-of-issue)
    - [Dates](#dates)
    - [Issuer Address](#issuer-address)
    - [Issuer Company Registrations](#issuer-company-registrations)
    - [Issuer Name](#issuer-name)
    - [Locale](#locale)
    - [Recipient Address](#recipient-address)
    - [Recipient Company Registrations](#recipient-company-registrations)
    - [Recipient Name](#recipient-name)
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
  mindee.product.ProofOfAddressV1,
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


#### Company Registration Field

Aside from the basic `Field` attributes, the company registration field `CompanyRegistrationField` also implements the following:

* **type** (`string`): the type of company.


#### Date Field

Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.


#### Locale Field

The locale field `LocaleField` only implements the **value**, **confidence** and **pageId** base `Field` attributes, but it comes with its own:

* **language** (`string`): ISO 639-1 language code (e.g.: `en` for English). Can be `undefined`.
* **country** (`string`): ISO 3166-1 alpha-2 or ISO 3166-1 alpha-3 code for countries (e.g.: `GRB` or `GB` for "Great Britain"). Can be `undefined`.
* **currency** (`string`): ISO 4217 code for currencies (e.g.: `USD` for "US Dollars"). Can be `undefined`.


#### String Field

The text field `StringField` only has one constraint: it's **value** is a `string` (or `undefined`).


## Attributes

The following fields are extracted for Proof of Address V1:


### Date of Issue

**date**  ([DateField](#date-field)): The date the document was issued.

```js
console.log(result.document.inference.prediction.date.toString());
```

### Dates

**dates**  ([DateField](#date-field)): List of dates found on the document.

```js
console.log(result.document.inference.prediction.dates.toString());
```

### Issuer Address

**issuerAddress**  ([StringField](#string-field)): The address of the document's issuer.

```js
console.log(result.document.inference.prediction.issuerAddress.toString());
```

### Issuer Company Registrations

**issuerCompanyRegistration**  ([CompanyRegistrationField](#company-registration-field)): List of company registrations found for the issuer.

```js
console.log(result.document.inference.prediction.issuerCompanyRegistration.toString());
```

### Issuer Name

**issuerName**  ([StringField](#string-field)): The name of the person or company issuing the document.

```js
console.log(result.document.inference.prediction.issuerName.toString());
```

### Locale

**locale**  ([LocaleField](#locale-field)): The locale detected on the document.

```js
console.log(result.document.inference.prediction.locale.toString());
```

### Recipient Address

**recipientAddress**  ([StringField](#string-field)): The address of the recipient.

```js
console.log(result.document.inference.prediction.recipientAddress.toString());
```

### Recipient Company Registrations

**recipientCompanyRegistration**  ([CompanyRegistrationField](#company-registration-field)): List of company registrations found for the recipient.

```js
console.log(result.document.inference.prediction.recipientCompanyRegistration.toString());
```

### Recipient Name

**recipientName**  ([StringField](#string-field)): The name of the person or company receiving the document.

```js
console.log(result.document.inference.prediction.recipientName.toString());
```

## Questions?

[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
