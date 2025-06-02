---
title: US US Mail OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-us-us-mail-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [US Mail API](https://platform.mindee.com/mindee/us_mail).

The [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/us_mail/default_sample.jpg) can be used for testing purposes.
![US Mail sample](https://github.com/mindee/client-lib-test-data/blob/main/products/us_mail/default_sample.jpg?raw=true)

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
  mindee.product.us.UsMailV3,
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

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

## Specific Fields
Fields which are specific to this product; they are not used in any other product.

### Recipient Addresses Field
The addresses of the recipients.

A `UsMailV3RecipientAddress` implements the following attributes:

* `city` (string): The city of the recipient's address.
* `complete` (string): The complete address of the recipient.
* `isAddressChange` (boolean): Indicates if the recipient's address is a change of address.
* `postalCode` (string): The postal code of the recipient's address.
* `privateMailboxNumber` (string): The private mailbox number of the recipient's address.
* `state` (string): Second part of the ISO 3166-2 code, consisting of two letters indicating the US State.
* `street` (string): The street of the recipient's address.
* `unit` (string): The unit number of the recipient's address.
Fields which are specific to this product; they are not used in any other product.

### Sender Address Field
The address of the sender.

A `UsMailV3SenderAddress` implements the following attributes:

* `city` (string): The city of the sender's address.
* `complete` (string): The complete address of the sender.
* `postalCode` (string): The postal code of the sender's address.
* `state` (string): Second part of the ISO 3166-2 code, consisting of two letters indicating the US State.
* `street` (string): The street of the sender's address.

# Attributes
The following fields are extracted for US Mail V3:

## Return to Sender
**isReturnToSender** : Whether the mailing is marked as return to sender.

```js
console.log(result.document.inference.prediction.isReturnToSender.value);
```

## Recipient Addresses
**recipientAddresses** ([UsMailV3RecipientAddress](#recipient-addresses-field)[]): The addresses of the recipients.

```js
for (const recipientAddressesElem of result.document.inference.prediction.recipientAddresses) {
  console.log(recipientAddressesElem.value);
}
```

## Recipient Names
**recipientNames** ([StringField](#string-field)[]): The names of the recipients.

```js
for (const recipientNamesElem of result.document.inference.prediction.recipientNames) {
  console.log(recipientNamesElem.value);
}
```

## Sender Address
**senderAddress** ([UsMailV3SenderAddress](#sender-address-field)): The address of the sender.

```js
console.log(result.document.inference.prediction.senderAddress.value);
```

## Sender Name
**senderName** ([StringField](#string-field)): The name of the sender.

```js
console.log(result.document.inference.prediction.senderName.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
