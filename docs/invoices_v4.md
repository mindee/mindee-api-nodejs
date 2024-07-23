---
title: Invoice OCR Node.js
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

**Output (RST):**
```rst
########
Document
########
:Mindee ID: 128a314f-1adb-42eb-a9e3-402055a8b8ce
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/invoices v4.6
:Rotation applied: Yes

Prediction
==========
:Locale: en; en; CAD;
:Invoice Number: 14
:Reference Numbers: AD29094
:Purchase Date: 2018-09-25
:Due Date:
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
:Supplier Email: i_doi@example.com
:Customer Name: JIRO DOI
:Customer Company Registrations:
:Customer Address: 1954 Bloor Street West Toronto, ON, M6P 3K9 Canada
:Customer ID:
:Shipping Address:
:Billing Address: 1954 Bloor Street West Toronto, ON, M6P 3K9 Canada
:Document Type: INVOICE
:Line Items:
  +--------------------------------------+--------------+----------+------------+--------------+--------------+------------+
  | Description                          | Product code | Quantity | Tax Amount | Tax Rate (%) | Total Amount | Unit Price |
  +======================================+==============+==========+============+==============+==============+============+
  | Platinum web hosting package Down... |              | 1.00     |            |              | 65.00        | 65.00      |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+------------+
  | 2 page website design Includes ba... |              | 3.00     |            |              | 2100.00      | 2100.00    |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+------------+
  | Mobile designs Includes responsiv... |              | 1.00     |            |              | 250.00       | 250.00     |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+------------+

Page Predictions
================

Page 0
------
:Locale: en; en; CAD;
:Invoice Number: 14
:Reference Numbers: AD29094
:Purchase Date: 2018-09-25
:Due Date:
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
:Supplier Email: i_doi@example.com
:Customer Name: JIRO DOI
:Customer Company Registrations:
:Customer Address: 1954 Bloor Street West Toronto, ON, M6P 3K9 Canada
:Customer ID:
:Shipping Address:
:Billing Address: 1954 Bloor Street West Toronto, ON, M6P 3K9 Canada
:Document Type: INVOICE
:Line Items:
  +--------------------------------------+--------------+----------+------------+--------------+--------------+------------+
  | Description                          | Product code | Quantity | Tax Amount | Tax Rate (%) | Total Amount | Unit Price |
  +======================================+==============+==========+============+==============+==============+============+
  | Platinum web hosting package Down... |              | 1.00     |            |              | 65.00        | 65.00      |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+------------+
  | 2 page website design Includes ba... |              | 3.00     |            |              | 2100.00      | 2100.00    |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+------------+
  | Mobile designs Includes responsiv... |              | 1.00     |            |              | 250.00       | 250.00     |
  +--------------------------------------+--------------+----------+------------+--------------+--------------+------------+
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

> Note: currently `TaxField` is not used on its own, and is accessed through a parent `Taxes` object, an array-like structure.

#### Taxes (Array)
The `Taxes` field represents an array-like collection of `TaxField` objects. As it is the representation of several objects, it has access to a custom `toString()` method that can render a `TaxField` object as a table line.

## Specific Fields
Fields which are specific to this product; they are not used in any other product.

### Line Items Field
List of line item details.

A `InvoiceV4LineItem` implements the following attributes:

* `description` (string): The item description.
* `productCode` (string): The product code referring to the item.
* `quantity` (number): The item quantity
* `taxAmount` (number): The item tax amount.
* `taxRate` (number): The item tax rate in percentage.
* `totalAmount` (number): The item total amount.
* `unitMeasure` (string): The item unit of measure.
* `unitPrice` (number): The item unit price.

# Attributes
The following fields are extracted for Invoice V4:

## Billing Address
**billingAddress** ([StringField](#string-field)): The customer's address used for billing.

```js
console.log(result.document.inference.prediction.billingAddress.value);
```

## Customer Address
**customerAddress** ([StringField](#string-field)): The address of the customer.

```js
console.log(result.document.inference.prediction.customerAddress.value);
```

## Customer Company Registrations
**customerCompanyRegistrations** ([CompanyRegistrationField](#company-registration-field)[]): List of company registrations associated to the customer.

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
**documentType** ([ClassificationField](#classification-field)): One of: 'INVOICE', 'CREDIT NOTE'.

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
**lineItems** ([InvoiceV4LineItem](#line-items-field)[]): List of line item details.

```js
for (const lineItemsElem of result.document.inference.prediction.lineItems) {
  console.log(lineItemsElem.value);
}
```

## Locale
**locale** ([LocaleField](#locale-field)): The locale detected on the document.

```js
console.log(result.document.inference.prediction.locale.value);
```

## Reference Numbers
**referenceNumbers** ([StringField](#string-field)[]): List of Reference numbers, including PO number.

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
**supplierCompanyRegistrations** ([CompanyRegistrationField](#company-registration-field)[]): List of company registrations associated to the supplier.

```js
for (const supplierCompanyRegistrationsElem of result.document.inference.prediction.supplierCompanyRegistrations) {
  console.log(supplierCompanyRegistrationsElem.value);
}
```

## Supplier Email
**supplierEmail** ([StringField](#string-field)): The email of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierEmail.value);
```

## Supplier Name
**supplierName** ([StringField](#string-field)): The name of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierName.value);
```

## Supplier Payment Details
**supplierPaymentDetails** ([PaymentDetailsField](#payment-details-field)[]): List of payment details associated to the supplier.

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
**taxes** ([TaxField](#taxes-field)[]): List of tax line details.

```js
for (const taxesElem of result.document.inference.prediction.taxes) {
  console.log(taxesElem.value);
}
```

## Total Amount
**totalAmount** ([AmountField](#amount-field)): The total amount paid: includes taxes, tips, fees, and other charges.

```js
console.log(result.document.inference.prediction.totalAmount.value);
```

## Total Net
**totalNet** ([AmountField](#amount-field)): The net amount paid: does not include taxes, fees, and discounts.

```js
console.log(result.document.inference.prediction.totalNet.value);
```

## Total Tax
**totalTax** ([AmountField](#amount-field)): The total tax: includes all the taxes paid for this invoice.

```js
console.log(result.document.inference.prediction.totalTax.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
