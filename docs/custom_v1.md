---
title: Custom API Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-api-builder
parentDoc: 609809574212d40077a040f1
---
> 🚧 This product is still supported, but is considered to be deprecated. If you are looking for the DocTI API documentation, you can find it [here](https://developers.mindee.com/docs/nodejs-generated-ocr).


# Quick-Start

```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({
  apiKey: "my-api-key"
});

// Load a file from disk
const inputSource = mindeeClient.docFromPath("/path/to/the/file.ext");

// Create a custom endpoint for your product
const customEndpoint = mindeeClient.createEndpoint(
  "my-endpoint",
  "my-account",
  // "my-version" // Optional: set the version, defaults to "1"
);

// Parse it
const apiResponse = mindeeClient
  .parse(
    mindee.product.CustomV1,
    inputSource,
    {
      endpoint: customEndpoint,
      cropper: true
    }
  );

// Handle the response Promise
apiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
```

# Custom Endpoints

You may have noticed in the previous step that in order to access a custom build, you will need to provide an account and an endpoint name at the very least.

Although it is optional, the version number should match the latest version of your build in most use-cases.
If it is not set, it will default to "1".


# Field Types

## Custom Fields

### List Field

A `ListField` is a special type of custom list that implements the following:

* **confidence** (`number`): the confidence score of the field prediction.
* **reconstructed** (`boolean`): indicates whether or not an object was reconstructed (not extracted as the API gave it).
* **values** (`Array<`[ListFieldValue](#list-field-value)`>`): list of value fields

Since the inner contents can vary, the value isn't accessed through a property, but rather through the following functions:
* **contentsList()** (`Array<string, number>`): returns a list of values for each element.
* **contentsString(separator=" ")** (`string`): returns a list of concatenated values, with an optional **separator** `string` between them.
* **toString()**: returns a string representation of all values, with an empty space between each of them.

#### List Field Value

Values of `ListField`s are stored in a `ListFieldValue` structure, which is implemented as follows:
* **content** (`string`): extracted content of the prediction
* **confidence** (`number`): the confidence score of the prediction
* **bbox** (`BBox`): 4 relative vertices corrdinates of a rectangle containing the word in the document.
* **polygon** (`Polygon`): vertices of a polygon containing the word.
* **pageId** (`number`): the ID of the page, is `undefined` when at document-level.

### Classification Field

A `ClassificationField` is a special type of custom classification that implements the following:

* **value** (`string`): the value of the classification. Corresponds to one of the values specified during training.
* **confidence** (`number`): the confidence score of the field prediction.
* **toString()**: returns a string representation of all values, with an empty space between each of them.

# Attributes

Custom builds always have access to at least two attributes:

## Fields

**fields** ({`string`: [ListField](#list-field)}): 

```js
console.log(result.document.inference.prediction.fields["my-field"].toString());
```

## Classifications

**classifications** ({`string`: [ClassificationField](#classification-field)}): The purchase category among predefined classes.

```js
console.log(result.document.inference.prediction.classifications["my-classification"].toString());
```

# 🧪 Custom Line Items

> **⚠️ Warning**: Custom Line Items are an **experimental** feature, results may vary.


Though not supported directly in the API, sometimes you might need to reconstitute line items by hand.
The library provides a tool for this very purpose:

## columnsToLineItems()
The **columnsToLineItems()** function can be called from the document and page level prediction objects.

It takes the following arguments:

* **anchorNames** (`string[]`): a list of the names of possible anchor (field) candidate for the horizontal placement a line. If all provided anchors are invalid, the `LineItem` won't be built.
* **fieldNamesTargeted** (`string[]`): a list of fields to retrieve the values from
* **heightLineTolerance** (`number`): Optional, the height tolerance used to build the line. It helps when the height of a line can vary unexpectedly.

Example use:

```js
// document-level
response.document.inference.prediction.columnsToLineItems(
  anchorNames,
  fieldNamesToLineItems,
  0.011 // optional, defaults to 0.01
);

// page-level
response.document.pages[0].prediction.columnsToLineItems(
  anchorNames,
  fieldNamesToLineItems,
  0.011 // optional, defaults to 0.01
);
```

It returns a list of [CustomLine](#Customline) objects.

## Customline

`Customline` represents a line as it has been read from column fields. It has the following attributes:

* **rowNumber** (`number`): Number of a given line. Starts at 1.
* **fields** (`Map<string, ListFieldValue>`[]): List of the fields associated with the line, indexed by their column name.
* **bbox** (`BBox`): Simple bounding box of the current line representing the 4 corners as `number` values.

# Questions?

[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
