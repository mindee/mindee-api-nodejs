[![License: MIT](https://img.shields.io/github/license/mindee/mindee-api-nodejs)](https://opensource.org/licenses/MIT)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/mindee/mindee-api-nodejs/test.yml)](https://github.com/mindee/mindee-api-nodejs)
[![NPM Version](https://img.shields.io/npm/v/mindee)](https://www.npmjs.com/package/mindee)
[![Downloads](https://img.shields.io/npm/dm/mindee)](https://www.npmjs.com/package/mindee)

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

// Parse it
const apiResponse = mindeeClient
  .parse(
    mindee.product.CustomV1,
    inputSource,
    "my-endpoint", 
    "my-account",
    "my-version" // 1 by default, but it is strongly recommended you provide it
  );
```

### Handling the Return
```js
// Handle the response Promise
apiResponse.then((resp) => {

    // full object
    console.log(resp.document);

    // string summary
    console.log(resp.document.toString());

    // individual pages (array)
    console.log(res.document.pages);
});
```

### Predict Options

#### Add cropping

#### Full text

### Page Options


## Further Reading
There's more to it than that for those that need more features, or want to
customize the experience.

All the juicy details are described in the
**[Official Guide](https://developers.mindee.com/docs/nodejs-sdk)**.

You can also take a look at the
**[Reference Documentation](https://mindee.github.io/mindee-api-nodejs/)**.

## License
Copyright © Mindee

Available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
