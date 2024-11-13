---
title: Business Card OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-business-card-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Business Card API](https://platform.mindee.com/mindee/business_card).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/business_card/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Business Card sample](https://github.com/mindee/client-lib-test-data/blob/main/products/business_card/default_sample.jpg?raw=true)

# Quick-Start
```js
const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "my-api-key" });

// Load a file from disk
const inputSource = mindeeClient.docFromPath("/path/to/the/file.ext");

// Parse the file
const apiResponse = mindeeClient.enqueueAndParse(
  mindee.product.BusinessCardV1,
  inputSource
);

// Handle the response Promise
apiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
```

**Output (RST):**
```rst
########
Document
########
:Mindee ID: 6f9a261f-7609-4687-9af0-46a45156566e
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/business_card v1.0
:Rotation applied: Yes

Prediction
==========
:Firstname: Andrew
:Lastname: Morin
:Job Title: Founder & CEO
:Company: RemoteGlobal
:Email: amorin@remoteglobalconsulting.com
:Phone Number: +14015555555
:Mobile Number: +13015555555
:Fax Number: +14015555556
:Address: 178 Main Avenue, Providence, RI 02111
:Website: www.remoteglobalconsulting.com
:Social Media: https://www.linkedin.com/in/johndoe
               https://twitter.com/johndoe
```

# Field Types
## Standard Fields
These fields are generic and used in several products.

### Basic Field
Each prediction object contains a set of fields that inherit from the generic `Field` class.
A typical `Field` object will have the following attributes:

* **value** (`number | string`): corresponds to the field value. Can be `undefined` if no value was extracted.
* **confidence** (`number`): the confidence score of the field prediction.
* **boundingBox** (`[Point, Point, Point, Point]`): contains exactly 4 relative vertices (points) coordinates of a right rectangle containing the field in the document.
* **polygon** (`Point[]`): contains the relative vertices coordinates (`Point`) of a polygon containing the field in the image.
* **pageId** (`number`): the ID of the page, always `undefined` when at document-level.
* **reconstructed** (`boolean`): indicates whether an object was reconstructed (not extracted as the API gave it).

> **Note:** A `Point` simply refers to an array of two numbers (`[number, number]`).


Aside from the previous attributes, all basic fields have access to a `toString()` method that can be used to print their value as a string.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

# Attributes
The following fields are extracted for Business Card V1:

## Address
**address** ([StringField](#string-field)): The address of the person.

```js
console.log(result.document.inference.prediction.address.value);
```

## Company
**company** ([StringField](#string-field)): The company the person works for.

```js
console.log(result.document.inference.prediction.company.value);
```

## Email
**email** ([StringField](#string-field)): The email address of the person.

```js
console.log(result.document.inference.prediction.email.value);
```

## Fax Number
**faxNumber** ([StringField](#string-field)): The Fax number of the person.

```js
console.log(result.document.inference.prediction.faxNumber.value);
```

## Firstname
**firstname** ([StringField](#string-field)): The given name of the person.

```js
console.log(result.document.inference.prediction.firstname.value);
```

## Job Title
**jobTitle** ([StringField](#string-field)): The job title of the person.

```js
console.log(result.document.inference.prediction.jobTitle.value);
```

## Lastname
**lastname** ([StringField](#string-field)): The lastname of the person.

```js
console.log(result.document.inference.prediction.lastname.value);
```

## Mobile Number
**mobileNumber** ([StringField](#string-field)): The mobile number of the person.

```js
console.log(result.document.inference.prediction.mobileNumber.value);
```

## Phone Number
**phoneNumber** ([StringField](#string-field)): The phone number of the person.

```js
console.log(result.document.inference.prediction.phoneNumber.value);
```

## Social Media
**socialMedia** ([StringField](#string-field)[]): The social media profiles of the person or company.

```js
for (const socialMediaElem of result.document.inference.prediction.socialMedia) {
  console.log(socialMediaElem.value);
}
```

## Website
**website** ([StringField](#string-field)): The website of the person or company.

```js
console.log(result.document.inference.prediction.website.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
