# CHANGELOG

## v4.29.0-rc3 - 2025-07-25
### Changes
* :sparkles: add support for URL input source
### Fixes
* :arrow_up: bump dependencies to cover vulnerabilities


## v4.29.0-rc2 - 2025-07-25
### Changes
* :recycle: harmonize with other client libraries

## v4.29.0-rc1 - 2025-07-21
### Changes
* :sparkles: add support for V2 client
* :recycle: tweak CI & testing
* :recycle: deprecate `cutPdf()` in favor of `applyPageOperations()` in `LocalInputSource`
* :recycle: refactor some internals to account for new changes

### Fixes
* :bug: fix bug where polling parameters could ignore validation checks on V1


## v4.28.0 - 2025-06-03
### Changes
* :sparkles: add support for address fields
* :sparkles: add support for Financial Document V1.12
* :sparkles: add support for Invoices V4.10
* :sparkles: add support for US Healthcare Cards V1.2
### Fixes
* :bug: fix default-encrypted & XFA pdfs not opening

## v4.27.1 - 2025-04-23
### Fixes
* :bug: fix workflow polling not working when ran with ts-node
* :memo: add example script for workflow polling


## v4.27.0 - 2025-04-23
### Changes
* :sparkles: add support for RAG polling
* :sparkles: add extras accessor from inference
### Fixes
* :bug: fix improper deserialization of extras in some instances


## v4.26.0 - 2025-04-16
### Changes
* :sparkles: add support for rag param in workflow executions


## v4.25.0 - 2025-04-08
### Changes
* :sparkles: add support for Financial Document V1.12
* :sparkles: add support for Invoices V4.10
* :sparkles: add support for US Healthcare Cards V1.2
### Fixes
* :arrow_up: upgrade mocha dependency


## v4.24.1 - 2025-03-27
### Fixes
* :bug: fix null objects being return in extras


## v4.24.0 - 2025-03-27
### Changes
* :sparkles: update structure for InvoiceSplitterV1
* :sparkles: update FR EnegryBillV1 to V1.2
* :sparkles: update US HealthcareCardV1 to V1.1
* :coffin: remove support for EU Driver License
* :coffin: remove support for License Plates
* :coffin: remove support for ReceiptV4
* :coffin: remove support for Proof of Address
* :coffin: remove support for US Driver License
* :coffin: remove support for US W9V1
### Fixes
* :bug: fix invalid indexes of some products
* :recycle: update CLI structure


## v4.23.1 - 2025-03-05
### Changes
* :recycle: remove superfluous canvas dependency
* :memo: update doc


## v4.23.0 - 2025-02-21
### Changes
* :sparkles: add support for image & PDF compression
### Fixes
* :bug: add missing 'failed' value to jobs


## v4.22.0 - 2025-01-14
### Changes
* :sparkles: add support for US Mail V3
* :recycle: increase async retry timers


## v4.21.0 - 2024-12-13
### Changes
* :sparkles: allow local downloading of remote sources
* :coffin: remove support for (FR) Carte Vitale V1 in favor of French Health Card V1
### Fixes
* :bug: fix broken loading from bytes


## v4.20.0 - 2024-11-28
### Changes
* :sparkles: add support for French Health Card V1
* :sparkles: add support for Driver License V1
* :sparkles: add support for Payslip FR V3


## v4.19.0 - 2024-11-27
### Changes
* :coffin: remove support for international ID V1
* :sparkles: add support for workflows
* :sparkles: add configurable http request timeout
### Fixes
* :bug: fix http errors improperly showing as 500 in rare instances


## v4.18.1 - 2024-11-19
### Fixes
* :bug: fix composed API server response not properly filling full_text_ocr in pages
* :arrow_up: bump dependencies


## v4.18.0 - 2024-11-14
### Changes
* :sparkles: add support for business cards V1
* :sparkles: add support for delivery note V1.1
* :sparkles: add support for indian passport V1
* :sparkles: add support for resume V1.1
### Fixes
* :recycle: adjust default values for async delays
* :recycle: remove unused dependencies


## v4.17.1 - 2024-10-17
### Fixes
* :bug: fix invalid handling of boolean fields & fix accidental coercion into numbers in `GeneratedObjectField` fields
* :bug: fix `GeneratedObjectField` fields being inaccessible in typescript without going through the main object


## v4.17.0 - 2024-10-11
### Changes
* :sparkles: add support for Financial Document v1.10
* :sparkles: add support for Invoice v4.8


## v4.16.0 - 2024-09-17
### Changes
* :sparkles: add support for US Mail V2
* :sparkles: add support for Bill of Lading V1
* :sparkles: add support for FR Energy Bill V1
* :sparkles: add support for FR Payslips V1
* :sparkles: add support for Nutrition Facts Label V1
* :recycle: refactor internals to accommodate for new changes

### Fixes
* :bug: fix float numbers not containing more 3 decimals in some instances
* :bug: fix boolean field display issues
* :bug: fix values being extracted as `undefined` instead of `null`, as is present in the initial prediction.


## v4.15.0 - 2024-09-12
### Changes
* :sparkles: add support for full text OCR extraction
* :wrench: add stricter linting rules
* :recycle: add integration tests
### Fixes
* :bug: fix page operations not taking minimum threshold into account.


## v4.14.1 - 2024-09-03
### Changes
* :memo: add classification detail to guide documentation
### Fixes
* :arrow_up: update dependencies
* :memo: fix broken documentation URLs
* :recycle: generate missing accessors for products
* :recycle: add missing async code samples


## v4.14.0 - 2024-07-24
### Changes
* :sparkles: add support for Healthcare Card V1
* :sparkles: add support for Invoice V4.7
* :sparkles: add support for Financial Document V1.9
* :recycle: update display for registration field


## v4.13.1 - 2024-06-10
### Fixes
* :recycle: refactored image extraction module to allow for more generic manipulations
* :recycle: add tests for multipage receipts extraction


## v4.13.0 - 2024-05-28
### Changes
* :sparkles: add support for local response loading
* :sparkles: add support for HMAC validation for webhooks
* :sparkles: add support for US Mail V2
* :sparkles: add support for boolean fields

### Fixes
* :recycle: fixed Locale display


## v4.12.0 - 2024-05-16
### Changes
* :sparkles: update receipt to 5.2 and financial document to 1.7 (#270)


# v4.11.0 - 2024-04-30
### Changes
* :sparkles: update invoice to 4.6 & financial document to 1.6 (#269)


# v4.10.0 - 2024-04-12
### Changes
* :sparkles: update Invoice to v4.5 (#264)

### Fixes
* :bug: fix error management not following intended flow (#267)
* :recycle: deprecated old error handler (#266)


## v4.9.1 - 2024-03-05
### Changes
* :recycle: update error handling to account for future evolutions
* :recycle: expose the input, geometry & imageOperations modules in internals for better fine-tuning
* :recycle: fix inconsistencies with naming conventions
* :memo: add missing reference documentation


## v4.9.0 - 2024-02-21
### Changes
* :sparkles: add support for resume V1
* :sparkles: add support for International ID v2
* :sparkles: add support for EU Driver License V1

### Fixes
:memo: misc doc fixes

## v4.8.2 - 2024-02-09
### Changes
* :recycle: increased update time for async retries

### Fixes
* :bug: fixed improper float parsing for Generated list objects
* :bug: typescript should now allow the use of default values for enqueueAndParse() async options


## v4.8.1 - 2024-02-06
### Fixes
* :bug: fixed invalid code samples for generated & async generic APIs
* :memo: fix corresponding docs


## v4.8.0 - 2024-02-05
### Changes
* :sparkles: add support for Generated APIs
* :sparkles: add custom GeneratedList & GeneratedObject classes linked to Generated APIs
* :arrow_up: update test lib to add testing samples for Generated APIs
* :arrow_up: upgraded dependencies & lockfile version
* :recycle: add new generated namespace & associated documentation
* :wrench: add unit tests for generated APIs
* :wrench: add code samples for generated APIs
* :recycle: add CLI entry for generated APIs
* :memo: add documentation entry for generated APIs
* :recycle: expose a bit more of our internals for easier use (#247)

### Fixes
* :memo: fix invoice v4 md doc


## v4.7.0 - 2024-01-30
### Changes
* :arrow_up: update invoices to 4.4
* :sparkles: add rawValue to string fields.


## v4.6.1 - 2023-12-15
### Changes
* :recycle: tweak async delays & retry
* :recycle: tweak default async sample delays & retry
* :memo: update md doc & fix typos


## v4.6.0 - 2023-12-11
### Changes
* :sparkles: add invoice-splitter auto-splitting feature
* :memo: add examples to illustrate auto-splitting feature
* :recycle: add unit tests for auto-splitting feature
* :recycle: rename `exemple` folder to `example`
* :arrow_up: update testing library


## v4.5.0 - 2023-11-29
### Changes
* :sparkles: add Multi-Receipts auto-extraction feature
* :art: add example file to illustrate multi-receipt image extraction feature
* :recycle: add new imageOperations namespace
* :recycle: fix loose typing issues for inputsources


## v4.4.0 - 2023-11-17
### Changes
* :sparkles: add support for Carte Grise V1
* :sparkles: add page nubmer attribute to doc
* :arrow_up: update product tests & doc
### Fixes
* :bug: fix broken `page_id` attribute for newer custom builds


## v4.3.2 - 2023-11-07
### Changes
* :recycle: update invoice splitter

### Fixes
* :bug: fix display issues when products didn't have pages
* :memo: fix doc typos


## v4.3.2 - 2023-10-04
### Changes
* :arrow_up: dependency upgrade
* :recycle: minor refactoring


## v4.3.1 - 2023-09-20
### Fixes
* :bug: take line height tolerance into account when evaluating fields


## v4.3.0 - 2023-09-19
### Changes
* :sparkles: add line items reconstruction for API builder


## v4.2.0 - 2023-09-15
### Changes
* :sparkles: add support for W9 V1
* :sparkles: add support for Barcode Reader V11
* :sparkles: add support for Multi Receipt Detector V1
* :sparkles: add support for FR Id Card V2
* :sparkles: add support for OTS Cropper V1
* :memo: update documentation

### Fixes
* :bug: fix missing position field display issues
* :bug: fix issues with asynchronous timeouts crashing in some instances


## v4.1.1 - 2023-09-04
### Changes
* :recycle: tweaked timer management in async

### Fixes
* :bug: fix ocr option not being generated as an Ocr object


## v4.1.0 - 2023-08-31
### Changes
* :boom: remove support for node versions <16
* :sparkles: add support for auto-polling in asynchronous calls
* :sparkles: update HTTP error management system
* :sparkles: add possibility to access raw server response
* :arrow_up: add support for node 20
* :wrench: expose more internal tools
* :memo: add better technical documentation
* :recycle: remove deprecated examples
* :recycle: update linting rules
* :arrow_up: update testing library

### Fixes
* :bug: fix miscellaneous bugs related to http parsing issues


## v4.0.2 - 2023-08-24
### Changes
* :recycle: updated technical documentation

### Fixes
* :bug: fix url source document not being sent properly


## v4.0.1 - 2023-08-22
### Fixes
* :bug: fixed pre-commit dependency script blocking installs


## v4.0.0 - 2023-08-14
### ¡Breaking Changes!
* :art: :boom: harmonize response types with other libraries
* :art: :boom: change endpoint management & syntax
* :art: :boom: move products to `product` module

### Changes
* :sparkles: add full support for page-specific attributes
* :sparkles: add support for FR Id Card
* :sparkles: add support for US Driver License
* :sparkles: add auto-generated md documentation
* :sparkles: add text reconstruction when using the `allWords` parameter (full OCR)
* :recycle: updated CLI to accommodate for newest changes
* :coffin: remove InvoiceV3
* :coffin: remove ReceiptV3
* :recycle: update tests to accommodate for newest changes
* :recycle: re-organized parsing module (common/standard/custom)


## v3.10.2 - 2023-08-11
### Changes
* :loud_sound: better logging of JSON errors

## v3.10.1 - 2023-07-04
### Changes
* :arrow_up: update dependencies

### Fixes
* :pencil2: added missing entry in changelog


## v3.10.0 - 2023-07-04
### Changes
* :sparkles: add support for FR Bank Account Details V2
* :recycle: update printing syntax & unit test for Receipt v5
* :coffin: removed support for Shipping Container


## v3.9.0 - 2023-06-06
### Changes
* :sparkles: support for financial document v1.1
* :recycle: change http status code handling for async requests


### Fixes
* :bug: fix typing in PaymentDetails
* :bug: locale value should always be set
* :bug: add missing class properties on new line items


## v3.8.0 - 2023-05-25
### Changes
* :sparkles: add support for receipt v5
* :sparkles: print taxes in table layout


## v3.7.4 - 2023-04-20
### Changes
* :white_check_mark: minor improvements to tests

### Fixes
* :bug: fix for options not being passed properly in the CLI tool


## v3.7.3 - 2023-04-11
### Changes
* :arrow_up: upgrade to TypeScript 5.0.3
* :safety_vest: ban-ts-comment should be an error
* :white_check_mark: Add docs with code samples and use them for testing


## v3.7.2 - 2023-04-04
### Fixes
* :bug: export DocumentClient class for easier 3rd party integration
* :bug: only display the job info when CLI parse-queued is processing


## v3.7.1 - 2023-03-31
### Fixes
* :bug: make sure all documents are exported properly


## v3.7.0 - 2023-03-31
### Changes
* :sparkles: add support for asynchronous predictions
* :sparkles: add **experimental** support for line items in custom documents
* :art: harmonize bbox and bounding box terminology
* :arrow_up: update test files, minor updates to string output
* :label: classification fields are always strings

### Fixes
* :bug: fix error message for missing API key, document type may be undefined


## v3.6.0 - 2023-02-01
### Changes
* :sparkles: Add support for the mindee_vision API (for internal testing)
* :sparkles: support Proof of Address V1
* :sparkles: Add support for: financial document v1
* :arrow_up: update jsdoc

### ¡Warning!
The `FinancialDocumentV1` class now uses an actual API call to the new route `financial_document`.
Previously, determining whether a document is an invoice or a receipt was done internally by this library.

The API call way is **much** better, however some fields have been renamed compared to the internal handling.
This was done so field names now match exactly `Invoice` and `Receipt` classes.

As such, we encourage users to migrate to the new field structure.

If this is problematic, it's possible to use the deprecated way.
Simply pass `FinancialDocumentV0` to the `parse` method.
Usage is otherwise identical.


## v3.5.0 - 2023-01-17
### Changes
* :memo: updates to class documentation
* :sparkles: Add invoice splitter support (beta)

### Fixes
* :bug: fix for CLI command option description


## v3.4.1 - 2023-01-05
### Changes
* :label: Added typing information, get rid of `any` type in various places
* :recycle: Use a specific `TextField` class for fields we know are textual
* :arrow_up: update dependencies

### Fixes
* :bug: Expose various class and type definitions to improve developer experience


## v3.4.0 - 2023-01-04
### Changes
* :sparkles: Support Receipt V4.1
* :sparkles: Support Invoice V4.1


## v3.3.0 - 2022-12-01
### Changes
* :sparkles: Add Invoice V4 with line items
* :sparkles: An env variable can be used to change the Mindee base API url


## v3.2.0 - 2022-11-14
### Changes
* :sparkles: Add support for shipping container API V1
* :sparkles: Add support for EU license plate V1
* :bug: Fix page removal in CLI
* :sparkles: Add support for Carte Vitale V1
* :sparkles: Add support for FR Bank Account Details V1
* :memo: Export and add comments for method parameters.
* :sparkles: Add support for US Bank Check V1


## v3.1.1 - 2022-11-08
### Changes
* :bug: fix proper import and documentation of region-specific documents


## v3.1.0 - 2022-11-08
### Changes
* :sparkles:  Add support for French ID cards.
* :sparkles: add buffer input source


## v3.0.1 - 2022-11-02
### Fixes
* :bug: Fix for `supplier` property name in `ReceiptV4` document.


## v3.0.0 - 2022-10-31
### ¡Breaking Changes!
* :sparkles: New PDF cut system, which allows specifying exactly which pages to keep or remove.
* :recycle: PDF documents are no longer cut by default, use the `pageOptions` parameter in the `parse` method.
* :sparkles: Document (endpoints) are now versioned, providing better backward-compatible support.
* :recycle: Pass the document class instead of the response class to the `parse` method.
* :recycle: Some methods and parameters renamed for better clarity.

### Changes
* :sparkles: New URL input source, `docFromUrl`.
* :sparkles: Add support for expense receipts V4


## v2.1.1 - 2022-10-28
### Fixes
* :bug: fix for sending base64 documents.

## v2.1.0 - 2022-10-19
### Changes
* :sparkles: add cropper support to predict requests
* :sparkles: add stand-alone cropper support


## v2.0.1 - 2022-10-13
### Fixes
* :bug: Fix for packaging and documentation related to commonJS imports


## v2.0.0 - 2022-08-26
### Note
This is a complete rewrite in TypeScript!

It's **not** backwards compatible with previous versions.

### Changes
* :sparkles: Add Passport API support
* :sparkles: Add custom document support (API builder)
* :sparkles: Add basic geometry functions
* :label: everything is typed, in particular response objects.
  Allows for much easier auto-completion in your IDE.
* :arrow_up: all major dependencies updated


## v1.4.0
### Fixes
* :bug: cut/merge pages of an encrypted PDF leads to unexpected results
* :bug: logger not activating in some cases
* :bug: align PDF cut/merge with other client libs

### Changes
* :sparkles: Add TIFF and HEIC support
* :white_check_mark: fully test PDF cut function


## v1.3.3
### Fixes
* :bug: reject errors instead of printing them only to the console


## v1.3.2
### Fixes
* :bug: use PDF length instead of cut PDF size limit


## v1.3.1
### Fixes
* :bug: forward api error to stderr instead of stdout


## v1.3.0
### Changes
* :sparkles: allow sending the filename for streams and base64
* :bug: not able to specify MIME type
* :page_facing_up: change license to MIT
* :white_check_mark: add node18 to tests
* various package updates


## v1.2.0
### Fixes
* :bug: Get `words` values when `includeWords` parameter is `true`


## v1.1.2
### Changes
* :sparkles: New Mindee Invoice API V3 support
* :sparkles: Add new supplier and customer fields

### Fixes
* :bug: Fix returned probability value
* :bug: Fix returned bbox value


## v1.1.0 (2022-01-03)
### Changes
* :sparkles: New Mindee API V2 support
* :zap: Server side invoice reconstruction from multi-page pdfs
* :sparkles: Added OS in User-Agent headers


## v1.0.9 (2021-12-09)
### Fixes
* :bug: handle attribute of type array when merging pages


## v1.0.8 (2021-11-29)
### Changes
* :see_no_evil: add .DS_Store to ignore file

### Fixes
* :bug: fix cutPDF for ReadableStream + add it for base64 file string
* :bug: Updated api Input initialization to specifically declare parameters
* :bug: prevent error when the mime type isn't detectable
* :bug: raise proper error when the APi doesn't return a valid JSON


## v1.0.7 (2021-11-25)
### Changes
* :sparkles: Added pdf page number parameter for multi-pages pdfs with file
* :arrow_up: upgrade path-parse dependency
* :arrow_up: upgrade browserslist dependency
* :arrow_up: upgrade lodash dependency
* :arrow_up: upgrade y18n dependency


## v1.0.4 (2021-02-18)
### Changes
* :sparkles: :zap: Add a parameter `filename` and a default filename for streams
* :zap: Change parse function to use an object instead of multiples parameters


## v1.0.3 (2021-02-01)
### Fixes
* :bug: \_request parameters
* :bug: `pageNumber` default value
* :bug: reconstruction method set fields to probability


## v1.0.2 (2021-02-01)
### Changes
* :zap: Better coverage for total tax

### Fixes
* :bug: `includeWords` is now working


## v1.0.1 (2021-01-11)
* :tada: First release
