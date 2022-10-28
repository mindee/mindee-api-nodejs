# CHANGELOG

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
