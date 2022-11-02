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

### Off-the-Shelf Documents

```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({apiKey: "my-api-key"});

// Load a file from disk and parse it
const invoiceResponse = mindeeClient
    .docFromPath("/path/to/the/invoice.pdf")
    .parse(mindee.InvoiceV3);

// Print a brief summary of the parsed data
invoiceResponse.then((resp) => {

    // The document property can be undefined:
    // * TypeScript will throw an error without this guard clause
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

### Custom Documents (API Builder)

```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client and add your document endpoint
const mindeeClient = new mindee.Client({apiKey: "my-api-key"})
    .addEndpoint({
        accountName: "john",
        endpointName: "wsnine",
    });

// Load a file from disk and parse it
const customResponse = mindeeClient
    .docFromPath("/path/to/the/wsnine.jpg")
    .parse(mindee.CustomV1, { endpointName: "wsnine" });

// Print a brief summary of the parsed data
customResponse.then((resp) => {

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
**[Official Documentation](https://developers.mindee.com/docs/nodejs-sdk)**.

## License
Copyright © Mindee

Available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
