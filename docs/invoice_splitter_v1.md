---
title: Invoice Splitter OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-invoice-splitter-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Invoice Splitter API](https://platform.mindee.com/mindee/invoice_splitter).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/invoice_splitter/default_sample.pdf), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Invoice Splitter sample](https://github.com/mindee/client-lib-test-data/blob/main/products/invoice_splitter/default_sample.pdf?raw=true)

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
  mindee.product.InvoiceSplitterV1,
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
:Mindee ID: 15ad7a19-7b75-43d0-b0c6-9a641a12b49b
:Filename: default_sample.pdf

Inference
#########
:Product: mindee/invoice_splitter v1.2
:Rotation applied: No

Prediction
==========
:Invoice Page Groups:
  +--------------------------------------------------------------------------+
  | Page Indexes                                                             |
  +==========================================================================+
  | 0                                                                        |
  +--------------------------------------------------------------------------+
  | 1                                                                        |
  +--------------------------------------------------------------------------+
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

## Specific Fields
Fields which are specific to this product; they are not used in any other product.

### Invoice Page Groups Field
List of page groups. Each group represents a single invoice within a multi-invoice document.

A `InvoiceSplitterV1InvoicePageGroup` implements the following attributes:

* `pageIndexes` (Array<number>): List of page indexes that belong to the same invoice (group).

# Attributes
The following fields are extracted for Invoice Splitter V1:

## Invoice Page Groups
**invoicePageGroups** ([InvoiceSplitterV1InvoicePageGroup](#invoice-page-groups-field)[]): List of page groups. Each group represents a single invoice within a multi-invoice document.

```js
for (const invoicePageGroupsElem of result.document.inference.prediction.invoicePageGroups) {
  console.log(invoicePageGroupsElem.value);
}
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
