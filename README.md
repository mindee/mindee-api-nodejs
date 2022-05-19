# Mindee API Helper Library for NodeJS
Quickly and easily connect to Mindee's API services using NodeJS.

## Quick Start
Here's the TL;DR of getting started.

First, get an [API Key](https://developers.mindee.com/docs/make-your-first-request#create-an-api-key)

Then, install this library:
```shell
npm install mindee
```

Finally, NodeJS away!

### Off-the-Shelf Document
```js
import { Client } from "mindee/index";

// Init a new client and configure the Invoice API
const mindeeClient = new Client().configInvoice("my-invoice-api-key")

// Load a file from disk and parse it
const apiResponse = mindeeClient.docFromPath("/path/to/the/invoice.pdf").parse("invoice");

// Print a brief summary of the parsed data
console.log(apiResponse.invoice);
```

### Custom Document (API Builder)
```js
import { Client } from "mindee/index";

// Init a new client and configure your custom document
const mindeeClient = new Client().configCustomDoc({
    documentType: "pokemon-card",
    singularName: "card",
    pluralName: "cards",
    accountName: "pikachu",
    apiKey: "pokemon-card-api-key",
  });

// Load a file from disk and parse it
const apiResponse = mindee_client.doc_from_path("/path/to/the/card.jpg").parse("pokemon-card")

// Print a brief summary of the parsed data
console.log(apiResponse.card);
```

## Further Reading
There's more to it than that for those that need more features, or want to
customize the experience.

All the juicy details are described in the
**[Official Documentation](https://developers.mindee.com/docs/nodejs-sdk)**.

## License
Copyright © Mindee

Available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
