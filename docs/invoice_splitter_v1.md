---
title: Invoice Splitter API Node.js
---
The Node.js OCR SDK supports the [Invoice Splitter API](https://platform.mindee.com/mindee/invoice_splitter).

Using [this sample](https://github.com/mindee/client-lib-test-data/blob/main/products/invoice_splitter/default_sample.pdf), we are going to illustrate how to detect the pages of multiple invoices within the same document.

# Quick-Start
> **⚠️ Important:** This API only works **asynchronously**, which means that documents have to be sent and retrieved in two separate steps.

```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "my-api-key" });

// Load a file from disk
const inputSource = mindeeClient.docFromPath("/path/to/the/file.ext");

// Parse the file asynchronously.
const asyncApiResponse = mindeeClient.enqueueAndParse(mindee.product.InvoiceSplitterV1, inputSource);

// Handle the response Promise
asyncApiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
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

An `InvoiceSplitterV1PageGroup` implements the following attributes:

* **pageIndexes** (`number`[]): List of indexes of the pages of a single invoice.
* **confidence** (`number`): The confidence of the prediction.

# Attributes
The following fields are extracted for Invoice Splitter V1:

## Invoice Page Groups
**invoicePageGroups** ([InvoiceSplitterV1PageGroup](#invoice-splitter-v1-page-group)[]): List of page indexes that belong to the same invoice in the PDF.

```js
for (const invoicePageGroupsElem of result.document.inference.prediction.invoicePageGroups){ 
  console.log(invoicePageGroupsElem.pageIndexes.join(", "));
}
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
