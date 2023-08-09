---
title: Driver License OCR Node.js
---
The Node.js OCR SDK supports the [Driver License API](https://platform.mindee.com/mindee/us_driver_license).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/us/driver_license/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Driver License sample](https://github.com/mindee/client-lib-test-data/blob/main/us/driver_license/default_sample.jpg?raw=true)

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
const apiResponse = mindeeClient.parse(
  mindee.product.us.DriverLicenseV1,
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
:Mindee ID: bf70068d-d3d6-49dc-b93a-b4b7d156fc3d
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/us_driver_license v1.0
:Rotation applied: Yes

Prediction
==========
:State: AZ
:Driver License ID: D12345678
:Expiry Date: 2018-02-01
:Date Of Issue: 2013-01-10
:Last Name: SAMPLE
:First Name: JELANI
:Address: 123 MAIN STREET PHOENIX AZ 85007
:Date Of Birth: 1957-02-01
:Restrictions: NONE
:Endorsements: NONE
:Class:
:Sex: M
:Height: 5-08
:Weight: 185
:Hair Color: BRO
:Eye Color: BRO
:Document Discriminator: 1234567890123456

Page Predictions
================

Page 0
------
:Photo: Polygon with 4 points.
:Signature: Polygon with 4 points.
:State: AZ
:Driver License ID: D12345678
:Expiry Date: 2018-02-01
:Date Of Issue: 2013-01-10
:Last Name: SAMPLE
:First Name: JELANI
:Address: 123 MAIN STREET PHOENIX AZ 85007
:Date Of Birth: 1957-02-01
:Restrictions: NONE
:Endorsements: NONE
:Class:
:Sex: M
:Height: 5-08
:Weight: 185
:Hair Color: BRO
:Eye Color: BRO
:Document Discriminator: 1234567890123456
```

# Field Types
## Standard Fields
### Basic Field
Each prediction object contains a set of fields that inherit from the generic `Field` class.
A typical `Field` object will have the following attributes:

* **value** (number|string): corresponds to the field value. Can be `undefined` if no value was extracted.
* **confidence** (`number`): the confidence score of the field prediction.
* **boundingBox** (`[Point, Point, Point, Point]`): contains exactly 4 relative vertices (points) coordinates of a right rectangle containing the field in the document.
* **polygon** (`Point[]`): contains the relative vertices coordinates (`Point`) of a polygon containing the field in the image.
* **pageId** (`number`): the ID of the page, is `undefined` when at document-level.
* **reconstructed** (`boolean`): indicates whether or not an object was reconstructed (not extracted as the API gave it).

> **Note:** A `Point` simply refers to an array of two numbers (`[number, number]`).


Aside from the previous attributes, all basic fields have access to a `toString()` method that can be used to print their value as a string.

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.


### Position Field
The position field `PositionField` does not implement all the basic `Field` attributes, only `boundingBox`, `polygon` and **pageId**. On top of these, it has access to:

* **rectangle** (`[Point, Point, Point, Point]`): a Polygon with four points that may be oriented (even beyond canvas).
* **quadrangle** (`[Point, Point, Point, Point]`): a free polygon made up of four points.

### String Field
The text field `StringField` only has one constraint: it's **value** is a `string` (or `undefined`).

## Page-Level Fields
Some fields are constrained to the page level, and so will not be retrievable to through the document.

# Attributes
The following fields are extracted for Driver License V1:

## Address
**address** ([StringField](#string-field)): US driver license holders address

```js
console.log(result.document.inference.prediction.address.value);
```

## Date Of Birth
**dateOfBirth** ([DateField](#date-field)): US driver license holders date of birth

```js
console.log(result.document.inference.prediction.dateOfBirth.value);
```

## Document Discriminator
**ddNumber** ([StringField](#string-field)): Document Discriminator Number of the US Driver License

```js
console.log(result.document.inference.prediction.ddNumber.value);
```

## Driver License Class
**dlClass** ([StringField](#string-field)): US driver license holders class

```js
console.log(result.document.inference.prediction.dlClass.value);
```

## Driver License ID
**driverLicenseId** ([StringField](#string-field)): ID number of the US Driver License.

```js
console.log(result.document.inference.prediction.driverLicenseId.value);
```

## Endorsements
**endorsements** ([StringField](#string-field)): US driver license holders endorsements

```js
console.log(result.document.inference.prediction.endorsements.value);
```

## Expiry Date
**expiryDate** ([DateField](#date-field)): Date on which the documents expires.

```js
console.log(result.document.inference.prediction.expiryDate.value);
```

## Eye Color
**eyeColor** ([StringField](#string-field)): US driver license holders eye colour

```js
console.log(result.document.inference.prediction.eyeColor.value);
```

## First Name
**firstName** ([StringField](#string-field)): US driver license holders first name(s)

```js
console.log(result.document.inference.prediction.firstName.value);
```

## Hair Color
**hairColor** ([StringField](#string-field)): US driver license holders hair colour

```js
console.log(result.document.inference.prediction.hairColor.value);
```

## Height
**height** ([StringField](#string-field)): US driver license holders hight

```js
console.log(result.document.inference.prediction.height.value);
```

## Date Of Issue
**issuedDate** ([DateField](#date-field)): Date on which the documents was issued.

```js
console.log(result.document.inference.prediction.issuedDate.value);
```

## Last Name
**lastName** ([StringField](#string-field)): US driver license holders last name

```js
console.log(result.document.inference.prediction.lastName.value);
```

## Photo
[📄](#page-level-fields "This field is only present on individual pages.")**photo** ([PositionField](#position-field)): Has a photo of the US driver license holder

```js
console.log(result.document.inference.pages[0].prediction.photo.polygon);
```

## Restrictions
**restrictions** ([StringField](#string-field)): US driver license holders restrictions

```js
console.log(result.document.inference.prediction.restrictions.value);
```

## Sex
**sex** ([StringField](#string-field)): US driver license holders gender

```js
console.log(result.document.inference.prediction.sex.value);
```

## Signature
[📄](#page-level-fields "This field is only present on individual pages.")**signature** ([PositionField](#position-field)): Has a signature of the US driver license holder

```js
console.log(result.document.inference.pages[0].prediction.signature.polygon);
```

## State
**state** ([StringField](#string-field)): US State

```js
console.log(result.document.inference.prediction.state.value);
```

## Weight
**weight** ([StringField](#string-field)): US driver license holders weight

```js
console.log(result.document.inference.prediction.weight.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
