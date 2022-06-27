# Mindee API Helper Library for Node.js
Quickly and easily connect to Mindee's API services using Node.js.

## Quick Start
Here's the TL;DR of getting started.

First, get an [API Key](https://developers.mindee.com/docs/make-your-first-request#create-an-api-key)

Then, install this library:
```shell
npm install mindee
```

Finally, Node.js away!

### Off-the-Shelf Document
```js
import { Client } from "mindee/index";

// Init a new client and configure the Invoice API
const mindeeClient = new Client().configInvoice("my-invoice-api-key");

// Load a file from disk and parse it
const invoiceResponse = mindeeClient.docFromPath("/path/to/the/invoice.pdf").parse("invoice");

// Print a brief summary of the parsed data
console.log(invoiceResponse.document);
```

### Custom Document (API Builder)
```js
import { Client } from "mindee/index";

// Init a new client and configure your custom document
const mindeeClient = new Client().configCustomDoc({
    documentType: "pokemon-card",
    accountName: "pikachu",
    apiKey: "pokemon-card-api-key",
  });

// Load a file from disk and parse it
const customResponse = mindeeClient.docFromPath("/path/to/the/card.jpg").parse("pokemon-card");

// Print a brief summary of the parsed data
console.log(customResponse.document);
```

## Further Reading
There's more to it than that for those that need more features, or want to
customize the experience.

All the juicy details are described in the
**[Official Documentation](https://developers.mindee.com/docs/nodejs-sdk)**.

## License
Copyright © Mindee

Available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
