---
title: Invoice OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-invoice-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Invoice API](https://platform.mindee.com/mindee/invoices).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/invoices/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Invoice sample](https://github.com/mindee/client-lib-test-data/blob/main/products/invoices/default_sample.jpg?raw=true)

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
  mindee.product.InvoiceV4,
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
  mindee.product.InvoiceV4,
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
:Mindee ID: 86b1833f-138b-4a01-8387-860204b0e631
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/invoices v4.9
:Rotation applied: Yes

Prediction
==========
:Locale: en-CA; en; CA; CAD;
:Invoice Number: 14
:Purchase Order Number: AD29094
:Reference Numbers: AD29094
:Purchase Date: 2018-09-25
:Due Date:
:Payment Date:
:Total Net: 2145.00
:Total Amount: 2608.20
:Total Tax: 193.20
:Taxes:
  +---------------+--------+----------+---------------+
  | Base          | Code   | Rate (%) | Amount        |
  +===============+========+==========+===============+
  |               |        | 8.00     | 193.20        |
  +---------------+--------+----------+---------------+
:Supplier Payment Details:
:Supplier Name: TURNPIKE DESIGNS
:Supplier Company Registrations:
:Supplier Address: 156 University Ave, Toronto ON, Canada, M5H 2H7
:Supplier Phone Number: 4165551212
:Supplier Website:
:Supplier Email: j_coi@example.com
:Customer Name: JIRO DOI
:Customer Company Registrations:
:Customer Address: 1954 Bloor Street West Toronto, ON, M6P 3K9 Canada
:Customer ID:
:Shipping Address:
:Billing Address: 1954 Bloor Street West Toronto, ON, M6P 3K9 Canada
:Document Type: INVOICE
:Line Items:
  +--------------------------------------+--------------+----------+------------+--------------+--------------+-----------------+------------+
  | Description                          | Product code | Quantity | Tax Amount | Tax Rate (%) | Total Amount | Unit of measure | Unit Price |
  +======================================+==============+==========+============+==============+==============+=================+============+
  | Platinum web hosting package Down... |              | 1.00     |            |              | 65.00        |                 | 65.00      |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+-----------------+------------+
  | 2 page website design Includes ba... |              | 3.00     |            |              | 2100.00      |                 | 2100.00    |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+-----------------+------------+
  | Mobile designs Includes responsiv... |              | 1.00     |            |              | 250.00       | 1               | 250.00     |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+-----------------+------------+

Page Predictions
================

Page 0
------
:Locale: en-CA; en; CA; CAD;
:Invoice Number: 14
:Purchase Order Number: AD29094
:Reference Numbers: AD29094
:Purchase Date: 2018-09-25
:Due Date:
:Payment Date:
:Total Net: 2145.00
:Total Amount: 2608.20
:Total Tax: 193.20
:Taxes:
  +---------------+--------+----------+---------------+
  | Base          | Code   | Rate (%) | Amount        |
  +===============+========+==========+===============+
  |               |        | 8.00     | 193.20        |
  +---------------+--------+----------+---------------+
:Supplier Payment Details:
:Supplier Name: TURNPIKE DESIGNS
:Supplier Company Registrations:
:Supplier Address: 156 University Ave, Toronto ON, Canada, M5H 2H7
:Supplier Phone Number: 4165551212
:Supplier Website:
:Supplier Email: j_coi@example.com
:Customer Name: JIRO DOI
:Customer Company Registrations:
:Customer Address: 1954 Bloor Street West Toronto, ON, M6P 3K9 Canada
:Customer ID:
:Shipping Address:
:Billing Address: 1954 Bloor Street West Toronto, ON, M6P 3K9 Canada
:Document Type: INVOICE
:Line Items:
  +--------------------------------------+--------------+----------+------------+--------------+--------------+-----------------+------------+
  | Description                          | Product code | Quantity | Tax Amount | Tax Rate (%) | Total Amount | Unit of measure | Unit Price |
  +======================================+==============+==========+============+==============+==============+=================+============+
  | Platinum web hosting package Down... |              | 1.00     |            |              | 65.00        |                 | 65.00      |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+-----------------+------------+
  | 2 page website design Includes ba... |              | 3.00     |            |              | 2100.00      |                 | 2100.00    |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+-----------------+------------+
  | Mobile designs Includes responsiv... |              | 1.00     |            |              | 250.00       | 1               | 250.00     |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+-----------------+------------+
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

### Payment Details Field
Aside from the basic `Field` attributes, the payment details field `PaymentDetailsField` also implements the following:

* **accountNumber** (`string`): number of an account, expressed as a string. Can be `undefined`.
* **iban** (`string`): International Bank Account Number. Can be `undefined`.
* **routingNumber** (`string`): routing number of an account. Can be `undefined`.
* **swift** (`string`): the account holder's bank's SWIFT Business Identifier Code (BIC). Can be `undefined`.

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
List of all the line items present on the invoice.

A `InvoiceV4LineItem` implements the following attributes:

* `description` (string): The item description.
* `productCode` (string): The product code of the item.
* `quantity` (number): The item quantity
* `taxAmount` (number): The item tax amount.
* `taxRate` (number): The item tax rate in percentage.
* `totalAmount` (number): The item total amount.
* `unitMeasure` (string): The item unit of measure.
* `unitPrice` (number): The item unit price.

# Attributes
The following fields are extracted for Invoice V4:

## Billing Address
**billingAddress** ([StringField](#string-field)): The customer billing address.

```js
console.log(result.document.inference.prediction.billingAddress.value);
```

## Customer Address
**customerAddress** ([StringField](#string-field)): The address of the customer.

```js
console.log(result.document.inference.prediction.customerAddress.value);
```

## Customer Company Registrations
**customerCompanyRegistrations** ([CompanyRegistrationField](#company-registration-field)[]): List of company registration numbers associated to the customer.

```js
for (const customerCompanyRegistrationsElem of result.document.inference.prediction.customerCompanyRegistrations) {
  console.log(customerCompanyRegistrationsElem.value);
}
```

## Customer ID
**customerId** ([StringField](#string-field)): The customer account number or identifier from the supplier.

```js
console.log(result.document.inference.prediction.customerId.value);
```

## Customer Name
**customerName** ([StringField](#string-field)): The name of the customer or client.

```js
console.log(result.document.inference.prediction.customerName.value);
```

## Purchase Date
**date** ([DateField](#date-field)): The date the purchase was made.

```js
console.log(result.document.inference.prediction.date.value);
```

## Document Type
**documentType** ([ClassificationField](#classification-field)): Document type: INVOICE or CREDIT NOTE.

#### Possible values include:
 - 'INVOICE'
 - 'CREDIT NOTE'

```js
console.log(result.document.inference.prediction.documentType.value);
```

## Due Date
**dueDate** ([DateField](#date-field)): The date on which the payment is due.

```js
console.log(result.document.inference.prediction.dueDate.value);
```

## Invoice Number
**invoiceNumber** ([StringField](#string-field)): The invoice number or identifier.

```js
console.log(result.document.inference.prediction.invoiceNumber.value);
```

## Line Items
**lineItems** ([InvoiceV4LineItem](#line-items-field)[]): List of all the line items present on the invoice.

```js
for (const lineItemsElem of result.document.inference.prediction.lineItems) {
  console.log(lineItemsElem.value);
}
```

## Locale
**locale** ([LocaleField](#locale-field)): The locale of the document.

```js
console.log(result.document.inference.prediction.locale.value);
```

## Payment Date
**paymentDate** ([DateField](#date-field)): The date on which the payment is due / was full-filled.

```js
console.log(result.document.inference.prediction.paymentDate.value);
```

## Purchase Order Number
**poNumber** ([StringField](#string-field)): The purchase order number.

```js
console.log(result.document.inference.prediction.poNumber.value);
```

## Reference Numbers
**referenceNumbers** ([StringField](#string-field)[]): List of all reference numbers on the invoice, including the purchase order number.

```js
for (const referenceNumbersElem of result.document.inference.prediction.referenceNumbers) {
  console.log(referenceNumbersElem.value);
}
```

## Shipping Address
**shippingAddress** ([StringField](#string-field)): Customer's delivery address.

```js
console.log(result.document.inference.prediction.shippingAddress.value);
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

## Supplier Email
**supplierEmail** ([StringField](#string-field)): The email address of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierEmail.value);
```

## Supplier Name
**supplierName** ([StringField](#string-field)): The name of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierName.value);
```

## Supplier Payment Details
**supplierPaymentDetails** ([PaymentDetailsField](#payment-details-field)[]): List of payment details associated to the supplier of the invoice.

```js
for (const supplierPaymentDetailsElem of result.document.inference.prediction.supplierPaymentDetails) {
  console.log(supplierPaymentDetailsElem.value);
    console.log(supplierPaymentDetailsElem.rate);
    console.log(supplierPaymentDetailsElem.code);
    console.log(supplierPaymentDetailsElem.basis);
}
```

## Supplier Phone Number
**supplierPhoneNumber** ([StringField](#string-field)): The phone number of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierPhoneNumber.value);
```

## Supplier Website
**supplierWebsite** ([StringField](#string-field)): The website URL of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierWebsite.value);
```

## Taxes
**taxes** ([TaxField](#taxes-field)[]): List of taxes. Each item contains the detail of the tax.

```js
for (const taxesElem of result.document.inference.prediction.taxes) {
  console.log(taxesElem.value);
}
```

## Total Amount
**totalAmount** ([AmountField](#amount-field)): The total amount of the invoice: includes taxes, tips, fees, and other charges.

```js
console.log(result.document.inference.prediction.totalAmount.value);
```

## Total Net
**totalNet** ([AmountField](#amount-field)): The net amount of the invoice: does not include taxes, fees, and discounts.

```js
console.log(result.document.inference.prediction.totalNet.value);
```

## Total Tax
**totalTax** ([AmountField](#amount-field)): The total tax: the sum of all the taxes for this invoice.

```js
console.log(result.document.inference.prediction.totalTax.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
