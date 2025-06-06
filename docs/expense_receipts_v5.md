---
title: Receipt OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-receipt-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Receipt API](https://platform.mindee.com/mindee/expense_receipts).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/expense_receipts/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Receipt sample](https://github.com/mindee/client-lib-test-data/blob/main/products/expense_receipts/default_sample.jpg?raw=true)

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
  mindee.product.ReceiptV5,
  inputSource
);

// Handle the response Promise
apiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
```

You can also call this product asynchronously:

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
  mindee.product.ReceiptV5,
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
:Mindee ID: d96fb043-8fb8-4adc-820c-387aae83376d
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/expense_receipts v5.3
:Rotation applied: Yes

Prediction
==========
:Expense Locale: en-GB; en; GB; GBP;
:Purchase Category: food
:Purchase Subcategory: restaurant
:Document Type: EXPENSE RECEIPT
:Purchase Date: 2016-02-26
:Purchase Time: 15:20
:Total Amount: 10.20
:Total Net: 8.50
:Total Tax: 1.70
:Tip and Gratuity:
:Taxes:
  +---------------+--------+----------+---------------+
  | Base          | Code   | Rate (%) | Amount        |
  +===============+========+==========+===============+
  | 8.50          | VAT    | 20.00    | 1.70          |
  +---------------+--------+----------+---------------+
:Supplier Name: Clachan
:Supplier Company Registrations: Type: VAT NUMBER, Value: 232153895
                                 Type: VAT NUMBER, Value: 232153895
:Supplier Address: 34 Kingley Street W1B 50H
:Supplier Phone Number: 02074940834
:Receipt Number: 54/7500
:Line Items:
  +--------------------------------------+----------+--------------+------------+
  | Description                          | Quantity | Total Amount | Unit Price |
  +======================================+==========+==============+============+
  | Meantime Pale                        | 2.00     | 10.20        |            |
  +--------------------------------------+----------+--------------+------------+

Page Predictions
================

Page 0
------
:Expense Locale: en-GB; en; GB; GBP;
:Purchase Category: food
:Purchase Subcategory: restaurant
:Document Type: EXPENSE RECEIPT
:Purchase Date: 2016-02-26
:Purchase Time: 15:20
:Total Amount: 10.20
:Total Net: 8.50
:Total Tax: 1.70
:Tip and Gratuity:
:Taxes:
  +---------------+--------+----------+---------------+
  | Base          | Code   | Rate (%) | Amount        |
  +===============+========+==========+===============+
  | 8.50          | VAT    | 20.00    | 1.70          |
  +---------------+--------+----------+---------------+
:Supplier Name: Clachan
:Supplier Company Registrations: Type: VAT NUMBER, Value: 232153895
                                 Type: VAT NUMBER, Value: 232153895
:Supplier Address: 34 Kingley Street W1B 50H
:Supplier Phone Number: 02074940834
:Receipt Number: 54/7500
:Line Items:
  +--------------------------------------+----------+--------------+------------+
  | Description                          | Quantity | Total Amount | Unit Price |
  +======================================+==========+==============+============+
  | Meantime Pale                        | 2.00     | 10.20        |            |
  +--------------------------------------+----------+--------------+------------+
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


### Amount Field
The amount field `AmountField` only has one constraint: its **value** is a `number` (or `undefined`).


### Classification Field
The classification field `ClassificationField` does not implement all the basic `Field` attributes. It only implements **value**, **confidence** and **pageId**.

> Note: a classification field's `value is always a `string`.


### Company Registration Field
Aside from the basic `Field` attributes, the company registration field `CompanyRegistrationField` also implements the following:

* **type** (`string`): the type of company.

### Date Field
Aside from the basic `Field` attributes, the date field `DateField` also implements the following: 

* **dateObject** (`Date`): an accessible representation of the value as a JavaScript object.

### Locale Field
The locale field `LocaleField` only implements the **value**, **confidence** and **pageId** base `Field` attributes, but it comes with its own:

* **language** (`string`): ISO 639-1 language code (e.g.: `en` for English). Can be `undefined`.
* **country** (`string`): ISO 3166-1 alpha-2 or ISO 3166-1 alpha-3 code for countries (e.g.: `GRB` or `GB` for "Great Britain"). Can be `undefined`.
* **currency** (`string`): ISO 4217 code for currencies (e.g.: `USD` for "US Dollars"). Can be `undefined`.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

### Taxes Field
#### Tax
Aside from the basic `Field` attributes, the tax field `TaxField` also implements the following:

* **rate** (`number`): the tax rate applied to an item can be expressed as a percentage. Can be `undefined`.
* **code** (`string`): tax code (or equivalent, depending on the origin of the document). Can be `undefined`.
* **base** (`number`): base amount used for the tax. Can be `undefined`.
* **value** (`number`): the value of the tax. Can be `null`.

> Note: currently `TaxField` is not used on its own, and is accessed through a parent `Taxes` object, an array-like structure.

#### Taxes (Array)
The `Taxes` field represents an array-like collection of `TaxField` objects. As it is the representation of several objects, it has access to a custom `toString()` method that can render a `TaxField` object as a table line.

## Specific Fields
Fields which are specific to this product; they are not used in any other product.

### Line Items Field
List of all line items on the receipt.

A `ReceiptV5LineItem` implements the following attributes:

* `description` (string): The item description.
* `quantity` (number): The item quantity.
* `totalAmount` (number): The item total amount.
* `unitPrice` (number): The item unit price.

# Attributes
The following fields are extracted for Receipt V5:

## Purchase Category
**category** ([ClassificationField](#classification-field)): The purchase category of the receipt.

#### Possible values include:
 - 'toll'
 - 'food'
 - 'parking'
 - 'transport'
 - 'accommodation'
 - 'gasoline'
 - 'telecom'
 - 'miscellaneous'
 - 'software'
 - 'shopping'
 - 'energy'

```js
console.log(result.document.inference.prediction.category.value);
```

## Purchase Date
**date** ([DateField](#date-field)): The date the purchase was made.

```js
console.log(result.document.inference.prediction.date.value);
```

## Document Type
**documentType** ([ClassificationField](#classification-field)): The type of receipt: EXPENSE RECEIPT or CREDIT CARD RECEIPT.

#### Possible values include:
 - 'EXPENSE RECEIPT'
 - 'CREDIT CARD RECEIPT'

```js
console.log(result.document.inference.prediction.documentType.value);
```

## Line Items
**lineItems** ([ReceiptV5LineItem](#line-items-field)[]): List of all line items on the receipt.

```js
for (const lineItemsElem of result.document.inference.prediction.lineItems) {
  console.log(lineItemsElem.value);
}
```

## Expense Locale
**locale** ([LocaleField](#locale-field)): The locale of the document.

```js
console.log(result.document.inference.prediction.locale.value);
```

## Receipt Number
**receiptNumber** ([StringField](#string-field)): The receipt number or identifier.

```js
console.log(result.document.inference.prediction.receiptNumber.value);
```

## Purchase Subcategory
**subcategory** ([ClassificationField](#classification-field)): The purchase subcategory of the receipt for transport and food.

#### Possible values include:
 - 'plane'
 - 'taxi'
 - 'train'
 - 'restaurant'
 - 'shopping'
 - 'other'
 - 'groceries'
 - 'cultural'
 - 'electronics'
 - 'office_supplies'
 - 'micromobility'
 - 'car_rental'
 - 'public'
 - 'delivery'
 - null

```js
console.log(result.document.inference.prediction.subcategory.value);
```

## Supplier Address
**supplierAddress** ([StringField](#string-field)): The address of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierAddress.value);
```

## Supplier Company Registrations
**supplierCompanyRegistrations** ([CompanyRegistrationField](#company-registration-field)[]): List of company registration numbers associated to the supplier.

```js
for (const supplierCompanyRegistrationsElem of result.document.inference.prediction.supplierCompanyRegistrations) {
  console.log(supplierCompanyRegistrationsElem.value);
}
```

## Supplier Name
**supplierName** ([StringField](#string-field)): The name of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierName.value);
```

## Supplier Phone Number
**supplierPhoneNumber** ([StringField](#string-field)): The phone number of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierPhoneNumber.value);
```

## Taxes
**taxes** ([TaxField](#taxes-field)[]): The list of taxes present on the receipt.

```js
for (const taxesElem of result.document.inference.prediction.taxes) {
  console.log(taxesElem.value);
}
```

## Purchase Time
**time** ([StringField](#string-field)): The time the purchase was made.

```js
console.log(result.document.inference.prediction.time.value);
```

## Tip and Gratuity
**tip** ([AmountField](#amount-field)): The total amount of tip and gratuity.

```js
console.log(result.document.inference.prediction.tip.value);
```

## Total Amount
**totalAmount** ([AmountField](#amount-field)): The total amount paid: includes taxes, discounts, fees, tips, and gratuity.

```js
console.log(result.document.inference.prediction.totalAmount.value);
```

## Total Net
**totalNet** ([AmountField](#amount-field)): The net amount paid: does not include taxes, fees, and discounts.

```js
console.log(result.document.inference.prediction.totalNet.value);
```

## Total Tax
**totalTax** ([AmountField](#amount-field)): The sum of all taxes.

```js
console.log(result.document.inference.prediction.totalTax.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
