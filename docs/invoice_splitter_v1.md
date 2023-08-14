---
title: Invoice Splitter API Node.js
---
The Node.js OCR SDK supports the [Invoice Splitter API](https://platform.mindee.com/mindee/invoice_splitter).

Using [this sample](https://github.com/mindee/client-lib-test-data/blob/9a34146755c348281c28bbf351900229b412797e/invoice_splitter/default_sample.pdf), we are going to illustrate how to detect the pages of multiple invoices within the same document.

# Quick-Start
> **⚠️ Important:** This API only works **asynchronously**, which means that documents have to be sent and retrieved in two separate steps.

```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

async function sampleAsyncApi() {
  // Init a new client
  const mindeeClient = new mindee.Client({ apiKey: "my-api-key" });

  // Specify the document class here to be DRY
  const docClass = mindee.product.InvoiceSplitterV1;

  const inputSource = mindeeClient.docFromPath("/path/to/the/file.ext");

  // Load a file from disk and send it to the asynchronous queue
  const enqueueResponse = await mindeeClient
    .enqueue(docClass, inputSource);

  console.log(enqueueResponse.job);

  // Don't try to get the document more than this many times
  const MAX_RETRIES = 10;

  // Wait this many seconds between each try
  const INTERVAL_SECS = 6;

  // Increment this counter each time we try to retrieve
  // the document from the queue.
  let timesTried = 1;

  //
  // Recursive function that tries to retrieve the completed document.
  // If the document is not ready (processing), try again.
  //
  async function getDocFromAsyncQueue(queueId) {
    setTimeout(async function () {
      // This normally never happens, but otherwise TS will complain.
      if (queueId === undefined) {
        throw new Error("No queue ID provided.");
      }

      // Have we exceeded our retry count?
      if (timesTried >= MAX_RETRIES) {
        throw new Error(`Maximum retries reached: ${timesTried}`);
      }

      // increment the counter
      timesTried++;

      // Call the API endpoint
      const parseAsyncResponse = await mindeeClient
        .parseQueued(docClass, queueId);

      //
      // If the `document` property is set, it means the
      // document is ready and has been retrieved successfully.
      //
      // Otherwise,we go around for another recursion.
      //
      if (parseAsyncResponse.document !== undefined) {
        console.log(parseAsyncResponse.document.toString());
      } else {
        console.log(parseAsyncResponse.job);
        await getDocFromAsyncQueue(queueId);
      }

      // Set the timeout value
    }, INTERVAL_SECS * 1000);
  }

  // Start the recursion ...
  await getDocFromAsyncQueue(enqueueResponse.job.id);
}

// Run it
sampleAsyncApi();
```

**Output (RST):**
```rst
########
Document
########
:Mindee ID: 8c25cc63-212b-4537-9c9b-3fbd3bd0ee20
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/carte_vitale v1.0
:Rotation applied: Yes

Prediction
==========
:Given Name(s): NATHALIE
:Surname: DURAND
:Social Security Number: 269054958815780
:Issuance Date: 2007-01-01

Page Predictions
================

Page 0
------
:Given Name(s): NATHALIE
:Surname: DURAND
:Social Security Number: 269054958815780
:Issuance Date: 2007-01-01
```

# Field Types
## Specific Fields
### Page Group
List of page group indexes.

A `PageGroup` implements the following attributes:

* **pageIndexes** (`number`[]): List of indexes of the pages of a single invoice.
* **confidence** (`number`): The confidence of the prediction.

# Attributes
The following fields are extracted for Invoice Splitter V1:

## Invoice Page Groups
**invoicePageGroups** ([PageGroup](#page-group)[]): List of page indexes that belong to the same invoice in the PDF.

```js
console.log(result.document.inference.prediction.invoicePageGroups.toString());
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
