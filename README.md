# mindee-api-node

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

client.invoice.parse("path/to/file", "file");
client.receipt.parse(base64String, "base64");
client.financialDocument.parse(base64String, "base64");
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

## Parsing

```js
// Call the receipt parsing API and create a receipt object under result.receipt
result = client.receipt.parse("/path/to/file");

// Call the invoice parsing API and create an invoice object under result.invoice
result = client.invoice.parse("/path/to/file");

// If you have a mixed data flow of invoice and receipt, use financialDocument
// Call the invoice or receipt parsing API according to your input data type (pdf -> invoice, picture -> receipt)
// and create a FinancialDocument object under result.financial_document
result = client.financialDocument.parse("/path/to/file", "file");

// You can also parse your document with base64 string like so
result = client.invoice.parse(base64string, "base64");
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
