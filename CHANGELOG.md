# CHANGELOG

## v1.3.1

### Fixes
* 🐛 forward api error to stderr instead of stdout

## v1.3.0

### Changes

* :sparkles: allow sending the filename for streams and base64
* fixes :bug: not able to specify MIME type
* :page_facing_up: change license to MIT
* :white_check_mark: add node18 to tests
* various package updates

## v1.2.0

### Fixes

* fix: 🐛 Get `words` values when `includeWords` parameter is `true`

## v1.1.2

### Fixes

* fix: 🐛 Fix returned probability value
* fix: 🐛 Fix returned bbox value

### new

* new: ✨ New Mindee Invoice API V3 support
* new: ✨ Add new supplier and customer fields

## v1.1.0 (2022-01-03)

### new

* chg: :sparkles: New Mindee API V2 support
* chg: :zap: Server side invoice reconstruction from multi-page pdfs
* new: :sparkles: Added OS in User-Agent headers


## v1.0.9 (2021-12-09)

### Fixes

* fix: 🐛 handle attribute of type array when merging pages

## v1.0.8 (2021-11-29)

### Fixes

* 🐛 fix cutPDF for ReadableStream + add it for base64 file string
* 🐛 Updated api Input initialization to specifically declare parameters
* 🐛 prevent error when the mime type isn't detectable
* 🐛 raise proper error when the APi doesn't return a valid JSON

### new

* :see_no_evil: add .DS_Store to ignore file

## v1.0.7 (2021-11-25)

### New

* ✨ Added pdf page number parameter for multi-pages pdfs with file

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

* 🎉 First release
