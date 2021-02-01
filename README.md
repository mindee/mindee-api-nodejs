# API SDK for Node.js

# Installation

## From source code

Download and decompress or clone the source code from github and then do in your node project :

```sh
npm install mindee
```

# Usage

You can use the SDK easily by creating a Client like this :

```js
const { Client } = require("mindee");

const mindeeClient = Client({
  invoiceToken: "invoiceApiToken",
  receiptToken: "receiptExpenseApiToken",
});

mindeeClient.invoice.parse("path/to/file", "file");
mindeeClient.receipt.parse(base64String, "base64");
mindeeClient.financialDocument.parse(base64String, "base64");
```

Three apis are actually supported : invoice (`ìnvoice`), receipt (`receipt`) and financial document (`financialDocument`)

You can find more examples on how to use the SDK into the folder `examples`

## Client

The mindee Client can take multiple parameters to be initialize. Some this parameters can also be set with env variables. If the env variable and the parameter are both set, the parameter will be the one chosen by the client. This is a list of them:

- invoiceToken (env variable : `MINDEE_INVOICE_TOKEN`) The expense api token
- receiptToken (env variable : `MINDEE_RECEIPT_TOKEN`) The invoice api token
- throwOnError (`true` by default) If `true`, the SDK will throw on error
- debug (env variable : `MINDEE_DEBUG`, `false` by default) If `true`, logging will be in debug mode

Depending on what type of document you want to parse, you need to add specifics auth token for each endpoint.
We suggest storing your credentials as environment variables for security reasons.

## Parsing Invoices

```js
const { Client } = require("mindee");
const fs = require("fs");

// Invoice token can be set by Env (MINDEE_INVOICE_TOKEN) or via params (Client({invoiceToken: "token"}))
const mindeeClient = new Client();

// parsing invoice from pdf
mindeeClient.invoice
  .parse("./documents/invoices/invoice.pdf") // see examples for more input types
  .then((res) => {
    console.log("Success !");
    console.log(res.invoices);
    console.log(res.invoice);
  })
  .catch((err) => {
    console.error(err);
  });
```

## Parsing receipts
```js
const { Client } = require("mindee");
const fs = require("fs");

// Receipt token can be set by Env (MINDEE_RECEIPT_TOKEN) or via params (Client({receiptToken: "token"}))
const mindeeClient = new Client();

// parsing receipt from picture
mindeeClient.receipt
  .parse("./documents/receipts/receipt.jpg") // see examples for more input types
  .then((res) => {
    console.log("Success !");
    console.log(res.receipts);
    console.log(res.receipt);
  })
  .catch((err) => {
    console.error(err);
  });
```

## Parsing a mix of invoices and receipts: Financial document

The Financial document API optimizes the parsing results when you don't know if your file is a receipt or an invoice.

```js
const { Client } = require("mindee");

// Invoice token and Receipt token must be set
// Receipt token can be set by Env (MINDEE_RECEIPT_TOKEN) or via params (Client({receiptToken: "token"}))
// Invoice token can be set by Env (MINDEE_INVOICE_TOKEN) or via params (Client({invoiceToken: "token"}))

const mindeeClient = new Client();

// parsing receipt from picture
mindeeClient.financialDocument
  .parse("./documents/receipts/receipt.jpg")
  .then((res) => {
    console.log("Success !");
    console.log(res.financialDocuments);
    console.log(res.financialDocument);
  })
  .catch((err) => {
    console.error(err);
  });

```

# Tests

First, link your package to the test repository by linking the node package to the tests :

```sh
cd mindee-api-nodejs/
npm link
cd tests/
npm link mindee
```

To run the tests, use the command `npm run test`

# Documentation

A basic documentation of the sdk has been done with the help of JSDoc.
If you want to generate it, you can use the command `npm run documentation`.
A folder `docs` will be created with generated documentation.
Open the `index.html` in your browser to read the documentation.
