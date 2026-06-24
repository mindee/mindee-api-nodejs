# Mindee Node.js SDK

Use this skill for Mindee V2 integrations with the official Node.js SDK.

## Scope

- Use the official `mindee` Node.js SDK.
- Focus on SDK-based integration patterns only.
- Do not suggest direct HTTP calls, cURL, or non-SDK integrations.
- Do not use undocumented SDK internals.

## Primary documentation

### SDK overview
- https://docs.mindee.com/integrations/client-libraries-sdk.md

### Client setup
- https://docs.mindee.com/integrations/client-libraries-sdk/configure-the-client.md

### Model parameters
- https://docs.mindee.com/integrations/client-libraries-sdk/basic-model-configuration.md

### Load local files
- https://docs.mindee.com/integrations/client-libraries-sdk/load-and-adjust-a-file.md

### Load remote URLs
- https://docs.mindee.com/integrations/client-libraries-sdk/load-an-url.md

### Send files and URLs
- https://docs.mindee.com/integrations/client-libraries-sdk/send-a-file-or-url.md

### Process responses
- https://docs.mindee.com/integrations/client-libraries-sdk/process-the-response.md

### Handle errors
- https://docs.mindee.com/integrations/problem-database.md

## Handling responses by model type

### Extraction
- Use: https://docs.mindee.com/extraction-models/sdk-integration/extraction-result.md
- Use this page for accessing dynamic fields from `response.inference.result.fields`.
- Use this page for examples of `SimpleField`, `ObjectField`, `ListField`, confidence, and locations.

### Split
- Use: https://docs.mindee.com/split-models/sdk-integration/split-result.md
- Use this page for iterating over `response.inference.result.splits`.
- Use this page for `documentType`, `pageRange`, and optional chained extraction results.

### Crop
- Use: https://docs.mindee.com/crop-models/sdk-integration/crop-result.md
- Use this page for iterating over `response.inference.result.crops`.
- Use this page for `objectType`, crop location, polygon data, and optional chained extraction results.

### Classification
- Use: https://docs.mindee.com/classification-models/sdk-integration/classification-result.md
- Use this page for accessing `response.inference.result.classification`.
- Use this page for `documentType` and optional chained extraction results.

### OCR
- Use: https://docs.mindee.com/raw-text-ocr-models/sdk-integration/ocr-result.md
- Use this page for iterating over `response.inference.result.pages`.
- Use this page for page text, words, and word polygon data.

## Default workflow

When answering questions, follow this order:

1. Initialize the SDK client.
2. Configure `modelId` and other inference parameters.
3. Load the input source.
4. Optionally adjust the file before upload.
5. Send with polling or webhooks.
6. Process the response.
7. Handle errors and retries.

## Answering rules

- Base answers on the documentation above.
- Prefer documented SDK methods and patterns.
- Prefer `async/await` in Node.js examples.
- Use ES Modules by default.
- Use environment variables for API keys in production.
- Reuse a client instance when possible.
- Prefer polling for simple examples.
- Prefer webhooks for production or high-volume workflows.
- If a feature is not documented, say it is not officially supported.
- If a user asks for code, keep examples minimal and working.

## Code sample rules

- Use Node.js examples only.
- Use the official `mindee` package.
- Show imports explicitly.
- Include the exact documented class and method names.
- Use placeholders like `MY_API_KEY`, `MY_MODEL_ID`, and `/path/to/file.pdf`.
- Keep samples focused on one task.

## Preferred example topics

### Client initialization
Use:
- `new mindee.Client({ apiKey })`
- `new mindee.Client()` with `MINDEE_V2_API_KEY`

### Input loading
Use:
- `PathInput`
- `BufferInput`
- `BytesInput`
- `StreamInput`
- `Base64Input`
- `UrlInput`

### Sending documents
Use:
- `enqueueAndGetResult(...)` for polling
- `enqueue(...)` for webhooks

### Response handling
Use:
- `response.inference`
- `response.getRawHttp()`
- `LocalResponse` for webhook payloads
- HMAC signature validation when relevant

### File preparation
Use:
- `inputSource.init()`
- `inputSource.getPageCount()`
- `inputSource.compress(...)`
- `inputSource.applyPageOptions(...)`

## Avoid

- Direct REST examples
- cURL examples
- Manual authentication header construction
- Bearer token examples for API keys
- Non-Node examples
- V1 examples unless the user explicitly asks for V1

## If the user is unclear

Ask for only what is needed:

- input type: local file or URL
- delivery pattern: polling or webhook
- model ID
- runtime context: backend, worker, or serverless

## Output style

- Be concise.
- Answer with runnable examples when code is requested.
- Link to the most relevant doc section.
- Do not overwhelm the user with every option.
- Start with the documented default path.

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
