# Cropper API version 1

> **Note:** CropperV1 is the stand-alone API for the parameter of the same name.

## Table of Contents
- [Cropper API version 1](#cropper-api-version-1)
  - [Table of Contents](#table-of-contents)
  - [Quick-Start](#quick-start)
  - [Field Types](#field-types)
    - [Standard Fields](#standard-fields)
      - [Basic Field](#basic-field)
      - [Position Field](#position-field)
    - [Page-Level Fields](#page-level-fields)
  - [Attributes](#attributes)
    - [Cropping](#cropping)
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

// Parse it
const apiResponse = mindeeClient
  .parse(mindee.product.CropperV1, inputSource);

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


#### Position Field

The position field `PositionField` does not implement all the basic `Field` attributes, only `boundingBox`, `polygon` and **pageId**. On top of these, it has access to:

* **rectangle** (`[Point, Point, Point, Point]`): a Polygon with four points that may be oriented (even beyond canvas).
* **quadrangle** (`[Point, Point, Point, Point]`): a free polygon made up of four points.


### Page-Level Fields

Some fields are constrained to the page level, and so will not be retrievable to through the document.


## Attributes

The following fields are extracted for Cropper V1:

### Cropping

[📄](#page-level-fields "This field is only present on individual pages.")**cropping**  ([PositionField](#position-field)): A list of cropped positions on a page.

```js
console.log(result.document.inference.pages[0].prediction.cropping.toString());
```

## Questions?

[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
