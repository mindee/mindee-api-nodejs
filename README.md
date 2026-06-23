[![License: MIT](https://img.shields.io/github/license/mindee/mindee-api-nodejs)](https://opensource.org/licenses/MIT) [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/mindee/mindee-api-nodejs/push-main-branch.yml)](https://github.com/mindee/mindee-api-nodejs) [![NPM Version](https://img.shields.io/npm/v/mindee)](https://www.npmjs.com/package/mindee) [![Downloads](https://img.shields.io/npm/dm/mindee)](https://www.npmjs.com/package/mindee)

# Mindee API Helper Library for Node.js
Quickly and easily connect to Mindee's API services using Node.js.

## Mindee API Versions
This client library has support for both Mindee platform versions.

### V2 - Latest
This is the latest platform located here:

https://app.mindee.com

It uses **API version 2**.

Consult the
**[V2 Documentation](https://docs.mindee.com/integrations/client-libraries-sdk)**


### V1
This is the platform located here:

https://platform.mindee.com/

It uses **API version 1**.

Consult the
**[V1 Documentation](https://docs.mindee.com/v1/libraries/nodejs-sdk)**

## Additional Information

**[Source Code](https://github.com/mindee/mindee-api-nodejs)**

**[Reference Documentation](https://mindee.github.io/mindee-api-nodejs/)**

**[Feedback](https://feedback.mindee.com/)**

### License
Copyright © Mindee

Available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Command Line Interface

A `mindee` command line interface is shipped with the library:

```bash
npm install -g mindee
mindee -h
```

Or, from a checkout:

```bash
node ./dist/bin/mindee.js -h
```

### Authentication

Provide an API key via `--api-key`:

- V2: `mindee --verbose <command> --api-key <V2_API_KEY> ...`
- V1: `mindee v1 <product> --api-key <V1_API_KEY> ...`

### V2 commands (top-level)

```
mindee <command> --api-key <V2_API_KEY> --model-id <MODEL_ID> [options] <path-or-url>
```

Available commands: `extraction`, `classification`, `crop`, `ocr`, `split`.

Extraction-only options: `--rag/-g`, `--raw-text/-r`, `--confidence/-c`,
`--polygon/-p`, `--text-context/-t`.
Common options: `--output/-o {summary,full,raw}`, `--alias/-a`.

### Search models

List models available to the current API key:

```
mindee search-models --api-key <V2_API_KEY> [--name <partial>] [--model-type <type>] [--raw-json]
```

Filter by partial name match (case-insensitive) and / or by exact model
type (one of `extraction`, `crop`, `classification`, `ocr`, `split`).

### V1 commands (under `v1`)

```
mindee v1 <product> --api-key <V1_API_KEY> [options] <path>
```

Where `<product>` is one of `barcode-reader`, `cropper`, `driver-license`,
`financial-document`, `fr-bank-account-details`, `fr-carte-grise`,
`fr-carte-nationale-d-identite`, `generated`, `international-id`, `invoice`,
`invoice-splitter`, `multi-receipts-detector`, `passport`, `receipt`,
`resume`, `us-bank-check`.

Common options: `--output/-o {summary,full,raw}`. Depending on the product:
`--all-words/-w`, `--full-text/-f`, `--async`.

### Output modes

- `summary` (default): brief prediction summary.
- `full`: detailed result including raw text / OCR sections when applicable.
- `raw`: full JSON response.
