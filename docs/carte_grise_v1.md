---
title: FR Carte Grise OCR Node.js
---
The Node.js OCR SDK supports the [Carte Grise API](https://platform.mindee.com/mindee/carte_grise).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/carte_grise/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Carte Grise sample](https://github.com/mindee/client-lib-test-data/blob/main/products/carte_grise/default_sample.jpg?raw=true)

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
  mindee.product.fr.CarteGriseV1,
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
:Mindee ID: 4443182b-57c1-4426-a288-01b94f226e84
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/carte_grise v1.1
:Rotation applied: Yes

Prediction
==========
:a: AB-123-CD
:b: 1998-01-05
:c1: DUPONT YVES
:c3: 27 RUE DES ROITELETS 59169 FERIN LES BAINS FRANCE
:c41: 2 DELAROCHE
:c4a: EST LE PROPRIETAIRE DU VEHICULE
:d1:
:d3: MODELE
:e: VFS1V2009AS1V2009
:f1: 1915
:f2: 1915
:f3: 1915
:g: 3030
:g1: 1307
:i: 2009-12-04
:j: N1
:j1: VP
:j2: AA
:j3: CI
:p1: 1900
:p2: 90
:p3: GO
:p6: 6
:q: 006
:s1: 5
:s2:
:u1: 77
:u2: 3000
:v7: 155
:x1: 2011-07-06
:y1: 17835
:y2:
:y3: 0
:y4: 4
:y5: 2.5
:y6: 178.35
:Formula Number: 2009AS05284
:Owner's First Name: YVES
:Owner's Surname: DUPONT
:MRZ Line 1:
:MRZ Line 2: CI<<MARQUES<<<<<<<MODELE<<<<<<<2009AS0528402

Page Predictions
================

Page 0
------
:a: AB-123-CD
:b: 1998-01-05
:c1: DUPONT YVES
:c3: 27 RUE DES ROITELETS 59169 FERIN LES BAINS FRANCE
:c41: 2 DELAROCHE
:c4a: EST LE PROPRIETAIRE DU VEHICULE
:d1:
:d3: MODELE
:e: VFS1V2009AS1V2009
:f1: 1915
:f2: 1915
:f3: 1915
:g: 3030
:g1: 1307
:i: 2009-12-04
:j: N1
:j1: VP
:j2: AA
:j3: CI
:p1: 1900
:p2: 90
:p3: GO
:p6: 6
:q: 006
:s1: 5
:s2:
:u1: 77
:u2: 3000
:v7: 155
:x1: 2011-07-06
:y1: 17835
:y2:
:y3: 0
:y4: 4
:y5: 2.5
:y6: 178.35
:Formula Number: 2009AS05284
:Owner's First Name: YVES
:Owner's Surname: DUPONT
:MRZ Line 1:
:MRZ Line 2: CI<<MARQUES<<<<<<<MODELE<<<<<<<2009AS0528402
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
* **pageId** (`number`): the ID of the page, is `undefined` when at document-level.
* **reconstructed** (`boolean`): indicates whether an object was reconstructed (not extracted as the API gave it).

> **Note:** A `Point` simply refers to an array of two numbers (`[number, number]`).


Aside from the previous attributes, all basic fields have access to a `toString()` method that can be used to print their value as a string.

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

# Attributes
The following fields are extracted for Carte Grise V1:

## a
**a** ([StringField](#string-field)): The vehicle's license plate number.

```js
console.log(result.document.inference.prediction.a.value);
```

## b
**b** ([DateField](#date-field)): The vehicle's first release date.

```js
console.log(result.document.inference.prediction.b.value);
```

## c1
**c1** ([StringField](#string-field)): The vehicle owner's full name including maiden name.

```js
console.log(result.document.inference.prediction.c1.value);
```

## c3
**c3** ([StringField](#string-field)): The vehicle owner's address.

```js
console.log(result.document.inference.prediction.c3.value);
```

## c41
**c41** ([StringField](#string-field)): Number of owners of the license certificate.

```js
console.log(result.document.inference.prediction.c41.value);
```

## c4a
**c4A** ([StringField](#string-field)): Mentions about the ownership of the vehicle.

```js
console.log(result.document.inference.prediction.c4A.value);
```

## d1
**d1** ([StringField](#string-field)): The vehicle's brand.

```js
console.log(result.document.inference.prediction.d1.value);
```

## d3
**d3** ([StringField](#string-field)): The vehicle's commercial name.

```js
console.log(result.document.inference.prediction.d3.value);
```

## e
**e** ([StringField](#string-field)): The Vehicle Identification Number (VIN).

```js
console.log(result.document.inference.prediction.e.value);
```

## f1
**f1** ([StringField](#string-field)): The vehicle's maximum admissible weight.

```js
console.log(result.document.inference.prediction.f1.value);
```

## f2
**f2** ([StringField](#string-field)): The vehicle's maximum admissible weight within the license's state.

```js
console.log(result.document.inference.prediction.f2.value);
```

## f3
**f3** ([StringField](#string-field)): The vehicle's maximum authorized weight with coupling.

```js
console.log(result.document.inference.prediction.f3.value);
```

## Formula Number
**formulaNumber** ([StringField](#string-field)): The document's formula number.

```js
console.log(result.document.inference.prediction.formulaNumber.value);
```

## g
**g** ([StringField](#string-field)): The vehicle's weight with coupling if tractor different than category M1.

```js
console.log(result.document.inference.prediction.g.value);
```

## g1
**g1** ([StringField](#string-field)): The vehicle's national empty weight.

```js
console.log(result.document.inference.prediction.g1.value);
```

## i
**i** ([DateField](#date-field)): The car registration date of the given certificate.

```js
console.log(result.document.inference.prediction.i.value);
```

## j
**j** ([StringField](#string-field)): The vehicle's category.

```js
console.log(result.document.inference.prediction.j.value);
```

## j1
**j1** ([StringField](#string-field)): The vehicle's national type.

```js
console.log(result.document.inference.prediction.j1.value);
```

## j2
**j2** ([StringField](#string-field)): The vehicle's body type (CE).

```js
console.log(result.document.inference.prediction.j2.value);
```

## j3
**j3** ([StringField](#string-field)): The vehicle's body type (National designation).

```js
console.log(result.document.inference.prediction.j3.value);
```

## MRZ Line 1
**mrz1** ([StringField](#string-field)): Machine Readable Zone, first line.

```js
console.log(result.document.inference.prediction.mrz1.value);
```

## MRZ Line 2
**mrz2** ([StringField](#string-field)): Machine Readable Zone, second line.

```js
console.log(result.document.inference.prediction.mrz2.value);
```

## Owner's First Name
**ownerFirstName** ([StringField](#string-field)): The vehicle's owner first name.

```js
console.log(result.document.inference.prediction.ownerFirstName.value);
```

## Owner's Surname
**ownerSurname** ([StringField](#string-field)): The vehicle's owner surname.

```js
console.log(result.document.inference.prediction.ownerSurname.value);
```

## p1
**p1** ([StringField](#string-field)): The vehicle engine's displacement (cm3).

```js
console.log(result.document.inference.prediction.p1.value);
```

## p2
**p2** ([StringField](#string-field)): The vehicle's maximum net power (kW).

```js
console.log(result.document.inference.prediction.p2.value);
```

## p3
**p3** ([StringField](#string-field)): The vehicle's fuel type or energy source.

```js
console.log(result.document.inference.prediction.p3.value);
```

## p6
**p6** ([StringField](#string-field)): The vehicle's administrative power (fiscal horsepower).

```js
console.log(result.document.inference.prediction.p6.value);
```

## q
**q** ([StringField](#string-field)): The vehicle's power to weight ratio.

```js
console.log(result.document.inference.prediction.q.value);
```

## s1
**s1** ([StringField](#string-field)): The vehicle's number of seats.

```js
console.log(result.document.inference.prediction.s1.value);
```

## s2
**s2** ([StringField](#string-field)): The vehicle's number of standing rooms (person).

```js
console.log(result.document.inference.prediction.s2.value);
```

## u1
**u1** ([StringField](#string-field)): The vehicle's sound level (dB).

```js
console.log(result.document.inference.prediction.u1.value);
```

## u2
**u2** ([StringField](#string-field)): The vehicle engine's rotation speed (RPM).

```js
console.log(result.document.inference.prediction.u2.value);
```

## v7
**v7** ([StringField](#string-field)): The vehicle's CO2 emission (g/km).

```js
console.log(result.document.inference.prediction.v7.value);
```

## x1
**x1** ([StringField](#string-field)): Next technical control date.

```js
console.log(result.document.inference.prediction.x1.value);
```

## y1
**y1** ([StringField](#string-field)): Amount of the regional proportional tax of the registration (in euros).

```js
console.log(result.document.inference.prediction.y1.value);
```

## y2
**y2** ([StringField](#string-field)): Amount of the additional parafiscal tax of the registration (in euros).

```js
console.log(result.document.inference.prediction.y2.value);
```

## y3
**y3** ([StringField](#string-field)): Amount of the additional CO2 tax of the registration (in euros).

```js
console.log(result.document.inference.prediction.y3.value);
```

## y4
**y4** ([StringField](#string-field)): Amount of the fee for managing the registration (in euros).

```js
console.log(result.document.inference.prediction.y4.value);
```

## y5
**y5** ([StringField](#string-field)): Amount of the fee for delivery of the registration certificate in euros.

```js
console.log(result.document.inference.prediction.y5.value);
```

## y6
**y6** ([StringField](#string-field)): Total amount of registration fee to be paid in euros.

```js
console.log(result.document.inference.prediction.y6.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
