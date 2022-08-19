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

### Off-the-Shelf Document

```ts
import { Client, InvoiceResponse } from "mindee";

// Init a new client
const mindeeClient = new Client({apiKey: "my-api-key"});

// Load a file from disk and parse it
const invoiceResponse = mindeeClient.docFromPath("/path/to/the/invoice.pdf")
  .parse(InvoiceResponse);

// Print a brief summary of the parsed data
invoiceResponse.then((resp) => {
  console.log(resp.document);
});
```

### Custom Document (API Builder)

```ts
import { Client, CustomResponse } from "mindee";

// Init a new client and add your document endpoint
const mindeeClient = new Client({apiKey: "my-api-key"})
  .addEndpoint({
    accountName: "john",
    documentType: "wsnine",
});

// Load a file from disk and parse it
const customResponse = mindeeClient.docFromPath("/path/to/the/wsnine.jpg")
  .parse(CustomResponse, {docType: "wsnine"});

// Print a brief summary of the parsed data
customResponse.then((resp) => {
  console.log(resp.document);
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
