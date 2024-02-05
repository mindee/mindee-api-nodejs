---
title: Generated API Node.js
---
The Node.js OCR SDK supports generated APIs.
Generated APIs can theoretically support all APIs in a catch-all generic format.

# Quick-Start

```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "my-api-key" });

// Load a file from disk
const inputSource = mindeeClient.docFromPath("/path/to/the/file.ext");

// Create a custom endpoint for your product
const customEndpoint = mindeeClient.createEndpoint(
  "my-endpoint",
  "my-account",
  "my-version" // Defaults to "1"
);

// Parse the file asynchronously.
const asyncApiResponse = mindeeClient.enqueueAndParse(
  mindee.product.InvoiceSplitterV1,
  inputSource,
  { endpoint: customEndpoint }
);

// Handle the response Promise
asyncApiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
```

# Generated Endpoints

You may have noticed in the previous step that in order to access a custom build, you will need to provide an account and an endpoint name at the very least.

Although it is optional, the version number should match the latest version of your build in most use-cases.
If it is not set, it will default to "1".

# Field Types

## Generated Fields

### Generated List Field

A `GeneratedListField` is a special type of custom list that implements the following:

- **values** (`Array<StringField|`[GeneratedObjectField](#Generated-object-field)`>`): the confidence score of the field prediction.
- **pageId** (`number`): only available for some documents ATM.

Since the inner contents can vary, the value isn't accessed through a property, but rather through the following functions:

- **contentsList()** (`: Array<string>`): returns a list of values for each element.
- **contentsString(separator=" ")** (`: string`): returns a list of concatenated values, with an optional **separator** `string` between them.
> **Note:** the `toString()` method returns a string representation of all values of this object, with an empty space between each of them.

### Generated Object Field

Unrecognized structures and sometimes values of `ListField`s are stored in a `GeneratedObjectField` structure, which is implemented dynamically depending on the object's structure.

- **pageId** (`number?`): the ID of the page, is `null` when at document-level.
- **rawValue** (`string?`): an optional field for when some post-processing has been done on fields (e.g. amounts). `null` in most instances.
- **confidence** (`number`): the confidence score of the field prediction. Warning: support isn't guaranteed on all APIs.


> **Other fields**:No matter what, other fields will be stored in a dictionary-like structure with a `key: value` pair where `key` is a string and `value` is a nullable string. They can be accessed like any other regular value, but won't be suggested by your IDE.


### StringField
The text field `StringField` only has one constraint: its **value** is an `string?`.


# Attributes

Generated builds always have access to at least two attributes:

## Fields

**fields** (`Map<string`: `any>)`):

```js
console.log(result.document.inference.prediction.fields.get("my-field").value);
```

> Note: while technically defined as `any`, the results of the fields can be type narrowed to `Map<string, `[GeneratedListField](#generated-list-field)[GeneratedObjectField]|(#generated-object-field), `(#stringfield)[StringField]>` using TypeScript.

# Questions?

[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
