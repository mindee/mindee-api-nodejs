---
title: EU License Plate OCR Node.js
---
The Node.js OCR SDK supports the [License Plate API](https://platform.mindee.com/mindee/license_plates).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/license_plates/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![License Plate sample](https://github.com/mindee/client-lib-test-data/blob/main/products/license_plates/default_sample.jpg?raw=true)

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
  mindee.product.eu.LicensePlateV1,
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
:Mindee ID: f0f48232-2c80-4473-9c6f-88a09111b84d
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/license_plates v1.0
:Rotation applied: No

Prediction
==========
:License Plates: BY-323-YB

Page Predictions
================

Page 0
------
:License Plates: BY-323-YB
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
* **pageId** (`number`): the ID of the page, is `undefined` when at document-level.
* **reconstructed** (`boolean`): indicates whether or not an object was reconstructed (not extracted as the API gave it).

> **Note:** A `Point` simply refers to an array of two numbers (`[number, number]`).


Aside from the previous attributes, all basic fields have access to a `toString()` method that can be used to print their value as a string.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

# Attributes
The following fields are extracted for License Plate V1:

## License Plates
**licensePlates** ([StringField](#string-field)[]): List of all license plates found in the image.

```js
for (const licensePlatesElem of result.document.inference.prediction.licensePlates) {
  console.log(licensePlatesElem.value);
}
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
