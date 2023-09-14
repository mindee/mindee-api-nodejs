[![License: MIT](https://img.shields.io/github/license/mindee/mindee-api-nodejs)](https://opensource.org/licenses/MIT) [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/mindee/mindee-api-nodejs/test.yml)](https://github.com/mindee/mindee-api-nodejs) [![NPM Version](https://img.shields.io/npm/v/mindee)](https://www.npmjs.com/package/mindee) [![Downloads](https://img.shields.io/npm/dm/mindee)](https://www.npmjs.com/package/mindee)

# Mindee API Helper Library for Node.js
Quickly and easily connect to Mindee's API services using Node.js.

## Quick Start
Here's the TL;DR of getting started.

First, get an [API Key](https://developers.mindee.com/docs/create-api-key)

Then, install this library:
```shell
npm install mindee
```

Finally, Node.js away!

### Loading a File and Parsing It

#### Global Documents
```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "my-api-key" });

// Load a file from disk
const inputSource = mindeeClient.docFromPath("/path/to/the/file.ext");

// Parse it on the API of your choice
const apiResponse = mindeeClient.parse(mindee.product.InvoiceV4, inputSource);
```

**Note:** Files can also be loaded from:

A URL (`https` only): 
```js
const inputSource = mindeeClient.docFromUrl("https://my-url");
```

A base64 encoded string:
```js
const inputSource = mindeeClient.docFromBase64(myInputString, "my-file-name")
```

A stream:
```js
const inputSource = mindeeClient.docFromBuffer(myReadableStream, "my-file-name")
```

A buffer:
```js
const inputSource = mindeeClient.docFromBuffer(myBuffer, "my-file-name")
```

#### Region-Specific Documents

Region-Specific Documents use the following syntax:

```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

const mindeeClient = new mindee.Client({ apiKey: "my-api-key" });

const inputSource = mindeeClient.docFromPath("/path/to/the/file.ext");

// The IdCardV1 product belongs to mindee.product.fr, not mindee.product itself
const apiResponse = mindeeClient.parse(mindee.product.fr.IdCardV1, inputSource);
```

#### Custom Documents (API Builder)

Custom documents will require you to provide their endpoint manually.

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
  "my-version" // will default to 1 if not provided
);

// Parse it
const apiResponse = mindeeClient
  .parse(
    mindee.product.CustomV1,
    inputSource,
    {
      endpoint: customEndpoint
    }
  );
```

### Handling the Return
```js
// Handle the response Promise
apiResponse.then((resp) => {
    // print a string summary
    console.log(resp.document.toString());

    // individual pages (array)
    console.log(res.document.inference.pages);
});
```

### Additional Options
Options to pass when sending a file to be parsed.

#### Page Options
Allows only sending certain pages in a PDF.

In this example we only send the first, penultimate, and last pages:

```js
const apiResponse = mindeeClient.parse(
  mindee.product.InvoiceV4,
  inputSource,
  {
    pageOptions: {
      pageIndexes: [0, -2, -1],
      operation: mindee.PageOptionsOperation.KeepOnly,
      onMinPages: 2
    }
  });
```

## Further Reading
Complete details on the working of the library are available in the following guides: 

* [Node.js Getting Started](https://developers.mindee.com/docs/nodejs-getting-started)
* [Node.js Custom OCR](https://developers.mindee.com/docs/nodejs-api-builder)
* [Node.js Invoice OCR](https://developers.mindee.com/docs/nodejs-invoice-ocr)
* [Node.js Receipt OCR](https://developers.mindee.com/docs/nodejs-receipt-ocr)
* [Node.js Financial Document OCR](https://developers.mindee.com/docs/nodejs-financial-document-ocr)
* [Node.js Passport OCR](https://developers.mindee.com/docs/nodejs-passport-ocr)
* [Node.js Proof of Address OCR](https://developers.mindee.com/docs/nodejs-proof-of-address-ocr)
* [Node.js EU License Plate OCR](https://developers.mindee.com/docs/nodejs-eu-license-plates-ocr)
* [Node.js FR Bank Account Detail OCR](https://developers.mindee.com/docs/nodejs-fr-bank-account-details-ocr)
* [Node.js FR Carte Vitale OCR](https://developers.mindee.com/docs/nodejs-fr-carte-vitale-ocr)
* [Node.js FR ID Card OCR](https://developers.mindee.com/docs/nodejs-fr-id-card-ocr)
* [Node.js US Bank Check OCR](https://developers.mindee.com/docs/nodejs-us-bank-checks-ocr)
* [Node.js US W9 OCR](https://developers.mindee.com/docs/nodejs-us-driver-license-ocr)
* [Node.js US Driver License OCR](https://developers.mindee.com/docs/nodejs-us-w9-ocr)
* [Node.js Barcode Reader API](https://developers.mindee.com/docs/nodejs-barcode-reader-api)
* [Node.js Cropper API](https://developers.mindee.com/docs/nodejs-cropper-api)
* [Node.js Invoice Splitter API](https://developers.mindee.com/docs/nodejs-invoice-splitter-api)
* [Node.js Multi Receipts Detector API](https://developers.mindee.com/docs/nodejs-multi-receipts-detector-api)

You can also take a look at the **[Reference Documentation](https://mindee.github.io/mindee-api-nodejs/)**.

## License
Copyright © Mindee

Available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
