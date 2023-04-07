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

// Load a file from disk and parse it
const apiResponse = mindeeClient
    .docFromPath("/path/to/the/file.ext")
    .parse(mindee.InvoiceV4);
```

#### Region-Specific Documents
```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "my-api-key" });

// Load a file from disk and parse it
const apiResponse = mindeeClient
    .docFromPath("/path/to/the/file.ext")
    .parse(mindee.fr.IdCardV1);
```

#### Custom Documents (API Builder)
```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client and add your document endpoint
const mindeeClient = new mindee.Client({ apiKey: "my-api-key" })
    .addEndpoint({
        accountName: "my-account",
        endpointName: "my-endpoint",
    });

// Load a file from disk and parse it
const apiResponse = mindeeClient
    .docFromPath("/path/to/the/file.ext")
    .parse(mindee.CustomV1, { endpointName: "my-endpoint" });
```

### Handling the Return
```js
// Handle the response Promise
apiResponse.then((resp) => {

    // The `document` property can be undefined:
    // * TypeScript will not compile without this guard clause
    //   (or consider using the '?' notation)
    // * JavaScript will be very happy to produce subtle bugs
    //   without this guard clause
    if (resp.document === undefined) return;

    // full object
    console.log(resp.document);

    // string summary
    console.log(resp.document.toString());
});
```

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
