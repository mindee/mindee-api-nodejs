name: mindee-v2-node.js
description: Official Node.js client library for the Mindee API v2.

# Mindee API – Node.js Client Library Skill Guide

## Overview

The `mindee` npm package is the official Node.js client library for the
[Mindee API](https://app.mindee.com).
It lets you send documents (PDFs, images, URLs) to Mindee's AI-powered document-processing platform and get back structured, machine-readable data.

This guide covers **API v2**, the current generation of the Mindee platform.

Key capabilities exposed by the library:

- **Extraction** – pull structured fields out of any document type using a model you configure in the Mindee platform.
- **Classification** – route documents to the right workflow by categorizing them automatically.
- **OCR** – retrieve the full plain-text content of a document.
- **Crop** – detect and isolate sub-regions of interest within a page.
- **Split** – segment a multi-page document into logical sub-documents.

All operations are asynchronous. There are two ways to retrieve results:

- **Polling** – submit a document and let the library poll the queue until the result is ready, then return it to you in one call.
- **Webhooks** – submit a document and have Mindee push the result directly to your endpoint when processing is complete, with no polling on your side.

## Requirements

### Node.js

Node.js **20.1 or later** is required.

### API Key

You need a Mindee API key.

Refer to the [API Keys documentation](https://docs.mindee.com/integrations/api-keys) for instructions on creating one.

## Installation

Install the package via npm:

```bash
npm install mindee
```

Optional dependencies are included by default. They enable additional features:

| Feature                          | Package(s)                              |
|----------------------------------|-----------------------------------------|
| PDF manipulation & compression   | `@cantoo/pdf-lib`, `node-poppler`       |
| PDF text extraction              | `pdf.js-extract`                        |
| Image compression                | `sharp`                                 |

If you never use these features, it's possible to skip them for a lighter installation:

```bash
npm install mindee --omit=optional
```

## Getting Started

### Creating a Client

All interactions with the Mindee API go through the `Client` class.
Instantiate it with your API key:

```typescript
import * as mindee from "mindee";

const mindeeClient = new mindee.Client({ apiKey: "MY_API_KEY" });
```

### API Key via Environment Variable

Instead of hardcoding the key, you can set the `MINDEE_V2_API_KEY` environment variable:

```bash
export MINDEE_V2_API_KEY="MY_API_KEY"
```

Then in your code simply ommit the `apiKey` from the constructor:

```typescript
import * as mindee from "mindee";

const mindeeClient = new mindee.Client();
```

### Further Reading

Check the [Configure the Client](https://docs.mindee.com/integrations/client-libraries-sdk/configure-the-client.md) section for more information on how to configure the client.

## Loading an Input Document

Before sending a document to the API, wrap it in one of the input source classes exported from the `mindee` package.
All input sources are then passed to various methods, mostly in the client.

### File Path

The most common option. Pass a path string to the file on disk:

```typescript
const filePath = "/path/to/the/file.ext";
const inputSource = new mindee.PathInput({ inputPath: filePath });
```

### Remote URL

Use to pass an HTTPS URL directly to the Mindee API without downloading the file locally first.
Only HTTPS URLs are accepted:
```typescript
const inputSource = new mindee.UrlInput({ url: "https://example.com/file.ext" });
```

### Further Reading

Check the [Load and Adjust a File](https://docs.mindee.com/integrations/client-libraries-sdk/load-and-adjust-a-file.md) section for more information on input types.

Specifically:
* Loading other file types (Buffer, Base64 String, Bytes, Readable Stream)
* Accessing file metadata
* Compressing PDF and image files before sending
* Manipulating PDF pages (remove pages before sending)

## Available Products

Mindee has several products that can be used to process files.
Each product is designed for a specific use case and has its own set of features and parameters.

Products are defined in the library by a class in the `mindee.product` namespace.
The product class is often passed as an argument to methods dealing with sending requests and processing server responses.

| Product class    | Import                          | Use case                                                 |
|------------------|---------------------------------|----------------------------------------------------------|
| `Extraction`     | `mindee.product.Extraction`     | Extract structured fields from any document.             |
| `Classification` | `mindee.product.Classification` | Sort documents into categories.                          |
| `Ocr`            | `mindee.product.Ocr`            | Extract raw text from any image or scanned document.     |
| `Crop`           | `mindee.product.Crop`           | Detect and isolate document borders.                     |
| `Split`          | `mindee.product.Split`          | Break a multi-page file into separate logical documents. |

## Sending a Request

The simplest way to get started is to use the built-in polling functionality of the library.

Sending requests is the same regardless of the product used. Only the product class changes.

Handling the return *is* specific to each product, this is detailed in the product-specific documentation.

### Parameters

Every request requires a `params` object. At minimum, `modelId` must be set.
The `modelId` is the ID of the model you configured in the Mindee platform.

The optional `alias` field lets you attach your own identifier to a request as a free-form string.
For example, an internal document ID, reference number, or database key.

It is echoed back unchanged in both the job and result responses, making it straightforward to correlate API results with your own records.

```typescript
const params = {
  modelId: "MY_MODEL_ID",

  // Optional: a free-form string to tag the request with your own identifier.
  // For example, an internal document ID or reference number.
  // If set, it will be included in the job and result responses.
  alias: "internal-doc-id-123",
};
```

### All-in-One: `enqueueAndGetResult()`

The simplest way to process a document.
The library enqueues the document, polls until the result is ready, and returns it:

```typescript
import * as mindee from "mindee";

const apiKey = "MY_API_KEY";
const modelId = "MY_MODEL_ID";
const filePath = "/path/to/the/file.ext";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: apiKey });

// Set product parameters
const params = {
  modelId: modelId,
};

// Load a file from disk
const inputSource = new mindee.PathInput({ inputPath: filePath });

// Send for processing and wait for the result
// Replace mindee.product.Extraction with any other product:
// mindee.product.Classification
// mindee.product.Ocr
// mindee.product.Crop
// mindee.product.Split
const response = await mindeeClient.enqueueAndGetResult(
  mindee.product.Extraction,
  inputSource,
  params,
);

// Print a string summary
console.log(response.inference.toString());
```

### Configuring Polling Timings

By default, `enqueueAndGetResult()` uses these polling settings:

| Option             | Default | Description                                               |
|--------------------|---------|-----------------------------------------------------------|
| `initialDelaySec`  | `2`     | Seconds to wait before the **first** poll attempt.        |
| `delaySec`         | `1.5`   | Seconds to wait between each **subsequent** poll attempt. |
| `maxRetries`       | `80`    | Maximum number of polling attempts                        |

If you are consistently having timeout issues, you may need to adjust these values.

Pass a `PollingOptions` object as the optional fourth argument to override any of these values:

```typescript
const pollingOptions = {
  initialDelaySec: 4,   // wait 4 seconds before the first poll
  delaySec: 1,          // wait 1 seconds between subsequent polls
  maxRetries: 100,      // give up after 100 attempts
};

const response = await mindeeClient.enqueueAndGetResult(
  mindee.product.Extraction,
  inputSource,
  params,
  pollingOptions,
);

console.log(response.inference.toString());
```

## Manual Polling (Advanced)
⚠️ Advanced users only. This pattern requires you to manage the polling loop yourself.
Most users should use `enqueueAndGetResult()` instead, which handles all of this automatically.

Use this pattern when you need full control over the polling lifecycle.
For example, to integrate with your own retry logic, persist job state across process restarts, or implement custom timeout strategies.

There are three steps:

1. **Enqueue** the document with `enqueue()`, which returns a `JobResponse`. 
   Retrieve the job ID from `job.id` on the response.
2. **Poll** the job status by calling `getJob(jobId)`, which also returns a `JobResponse`.
   Repeat until `job.status` is `"Processed"` or `"Failed"`.
3. **Fetch** the result with `getResultByUrl(product, url)` once the job status is `"Processed"`.
   Pass the product class and the `job.resultUrl` from the last `getJob()` response as the URL argument.

### Notes
* You are responsible for handling timeouts.
* Add a retry counter or deadline to your loop to avoid running forever.
* Make sure to wait some time before each poll request to avoid HTTP 429 errors.
* The `jobId` can be persisted and used in a future process or request if you need to resume polling after a restart.
* If `job.status` is `"Failed"`, check `job.error` on the `JobResponse` for details about the failure.
* Always check that `job.resultUrl` is defined before passing it to `getResultByUrl()`.
  The result URL is only populated once the job status is `"Processed"`.

## Sending a Request Using Webhooks

The document is enqueued, and Mindee will call your webhook URL when processing is complete.
Using this method, no polling is required; however, you will need a public web server accepting POST requests.

### Requirements

You must have configured a webhook in the Mindee platform, and have its ID available.

Refer to the [Webhook Documentation](https://docs.mindee.com/integrations/webhooks) for instructions on creating one.

### Enqueuing the Document

In the normal `params` object, set your webhook(s) using the `webhookIds` key.
The `webhookIds` value should always be a list, even if only passing one webhook:

```typescript
import * as mindee from "mindee";

const apiKey = "MY_API_KEY";
const modelId = "MY_MODEL_ID";
const webhookId = "MY_WEBHOOK_ID";
const filePath = "/path/to/the/file.ext";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: apiKey });

// Set product parameters, including the webhook ID
const params = {
  modelId: modelId,
  webhookIds: [webhookId],
};

// Load a file from disk
const inputSource = new mindee.PathInput({ inputPath: filePath });

// Enqueue the document — the result will be delivered to your webhook
// Replace mindee.product.Extraction with any other product:
// mindee.product.Classification, mindee.product.Ocr, mindee.product.Crop, mindee.product.Split
const jobResponse = await mindeeClient.enqueue(
  mindee.product.Extraction,
  inputSource,
  params,
);

// Save the job ID, you can use it to check status if the webhook doesn't arrive
const jobId = jobResponse.job.id;
console.log(`Enqueued with job ID: ${jobId}`);
```

> **Tip:** Persist the jobId in your database alongside your own record for this document.
> If the webhook callback never arrives (e.g. due to a network issue or a misconfigured endpoint),
> you can use it to check the job status at any time:
> ```typescript
> const jobResponse = await mindeeClient.getJob(jobId);
> console.log(`Job status: ${jobResponse.job.status}`);
> // Possible statuses: "Processing", "Processed", "Failed"
>```

### Loading the Response

When Mindee calls your webhook, the raw JSON string body of the HTTP request can be deserialized using `LocalResponse`:

```typescript
import * as mindee from "mindee";

// `rawPayload` is the raw JSON string body received by your webhook handler
const localResponse = new mindee.v2.LocalResponse(rawPayload);
await localResponse.init();

// Pass the response class matching the product used when enqueuing.
// Replace ExtractionResponse with whichever product applies:
// - mindee.product.ClassificationResponse
// - mindee.product.OcrResponse
// - mindee.product.CropResponse
// - mindee.product.SplitResponse
const response = await localResponse.deserializeResponse(
  mindee.product.ExtractionResponse,
);

console.log(response.inference.toString());
```

The resulting object will be identical to one received by calling `enqueueAndGetResult()`.
You can therefore switch between polling and webhook flows with minimal changes to your code.

### Verification

You can also verify the HMAC signature of the webhook payload to ensure it genuinely came from Mindee:

```typescript
const secretKey = "MY_WEBHOOK_SECRET_KEY";
// You'll need to get the "X-Signature" custom HTTP header.
const hmacSignature = request.headers.get("X-Signature");

if (!localResponse.isValidHmacSignature(secretKey, hmacSignature)) {
  throw new Error("Bad HMAC signature! Is someone trying to do evil?");
}
```

## Product Specific Handling

### Extraction

#### Parameters

https://docs.mindee.com/extraction-models/sdk-integration/extraction-configuration

#### Response

https://docs.mindee.com/extraction-models/sdk-integration/extraction-result

### Split

#### Parameters

No additional parameters beyond the base ones.

#### Response

### Crop

#### Parameters

No additional parameters beyond the base ones.

#### Response

The `CropResponse` contains a `CropInference` object at `response.inference`.

The `CropInference` exposes a `result` property of type `CropResult`, which contains an array of `CropItem` objects.

##### Accessing Crop Items

Each `CropItem` in `response.inference.result.crops` describes a detected region:

| Property             | Type                  |
|----------------------|-----------------------|
| `objectType`         | `string`              |
| `location`           | `FieldLocation`       |
| `extractionResponse` | `ExtractionResponse`  |

The `objectType` property is the classification of the detected object, as defined on the Mindee platform.

The `location` property contains a `FieldLocation` instance:
- `location.polygon` – a `Polygon` instance defining the crop boundary.
- `location.page` – the 0-based page index where the crop was found.

The `extractionResponse` property is an `ExtractionResponse` instance, which is identical to the response from Extraction product request.
It will contain data extracted from the crop, if:
* an extraction model was associated with a class on the Mindee platform
* the class was detected on the crop

### OCR

#### Parameters

No additional parameters beyond the base ones.

#### Response

---

# Agent Instructions: Querying The Documentation

If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the documentation URL with the `ask` query parameter.
Include `nodejs+sdk+-+` at the beginning of the question to get answers specific to this library:

```
GET https://docs.mindee.com/integrations.md?ask=nodejs+sdk+-+<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
