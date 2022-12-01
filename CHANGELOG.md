# CHANGELOG

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

### Fixes

* :bug: Fix returned probability value
* :bug: Fix returned bbox value

### new

* :sparkles: New Mindee Invoice API V3 support
* :sparkles: Add new supplier and customer fields

## v1.1.0 (2022-01-03)

### new

* :sparkles: New Mindee API V2 support
* :zap: Server side invoice reconstruction from multi-page pdfs
* :sparkles: Added OS in User-Agent headers


## v1.0.9 (2021-12-09)

### Fixes

* :bug: handle attribute of type array when merging pages

## v1.0.8 (2021-11-29)

### Fixes

* :bug: fix cutPDF for ReadableStream + add it for base64 file string
* :bug: Updated api Input initialization to specifically declare parameters
* :bug: prevent error when the mime type isn't detectable
* :bug: raise proper error when the APi doesn't return a valid JSON

### new

* :see_no_evil: add .DS_Store to ignore file

## v1.0.7 (2021-11-25)

### New

* :sparkles: Added pdf page number parameter for multi-pages pdfs with file

### Changes

* :arrow_up: upgrade path-parse dependency
* :arrow_up: upgrade browserslist dependency
* :arrow_up: upgrade lodash dependency
* :arrow_up: upgrade y18n dependency

## v1.0.4 (2021-02-18)

### New

* :sparkles: :zap: Add a parameter `filename` and a default filename for streams

### Changes

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
