The Node.js OCR SDK supports the [Financial Document API](https://platform.mindee.com/mindee/financial_document).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/financial_document/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Financial Document sample](https://github.com/mindee/client-lib-test-data/blob/main/financial_document/default_sample.jpg?raw=true)

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
  mindee.product.FinancialDocumentV1,
  inputSource
);

// Handle the response Promise
apiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.toString());
});
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
The text field `StringField` only has one constraint: it's **value** is a `string` (or `undefined`).


### Taxes Field
#### Tax
Aside from the basic `Field` attributes, the tax field `TaxField` also implements the following:

* **rate** (`number`): the tax rate applied to an item can be undefined. Expressed as a percentage. Can be `undefined`.
* **code** (`number`): tax code (or equivalent, depending on the origin of the document). Can be `undefined`.
* **base** (`number`): base amount used for the tax. Can be `undefined`.

> Note: currently `TaxField` is not used on its own, and is accessed through a parent `Taxes` object, an array-like structure.

#### Taxes (Array)
The `Taxes` field represents an array-like collection of `TaxField` objects. As it is the representation of several objects, it has access to a custom `toString()` method that can render a `TaxField` object as a table line.

## Custom Fields

Custom Fields implement their own definitions & variables, and usually don't inherit from standard fields.

### Line Items Field
List of line item details.

A `FinancialDocumentV1LineItem` implements the following attributes:

* `description` (string): The item description.
* `productCode` (string): The product code referring to the item.
* `quantity` (number): The item quantity
* `taxAmount` (number): The item tax amount.
* `taxRate` (number): The item tax rate in percentage.
* `totalAmount` (number): The item total amount.
* `unitPrice` (number): The item unit price.


# Attributes
The following fields are extracted for Financial Document V1:

## Purchase Category
**category** ([ClassificationField](#classification-field)): The purchase category among predefined classes.

```js
console.log(result.document.inference.prediction.category.value);
```

## Customer Address
**customerAddress** ([StringField](#string-field)): The address of the customer.

```js
console.log(result.document.inference.prediction.customerAddress.value);
```

## Customer Company Registrations
**customerCompanyRegistrations** ([CompanyRegistrationField](#company-registration-field)): List of company registrations associated to the customer.

```js
console.log(result.document.inference.prediction.customerCompanyRegistrations.value);
```

## Customer name
**customerName** ([StringField](#string-field)): The name of the customer.

```js
console.log(result.document.inference.prediction.customerName.value);
```

## Purchase Date
**date** ([DateField](#date-field)): The date the purchase was made.

```js
console.log(result.document.inference.prediction.date.value);
```

## Document Type
**documentType** ([ClassificationField](#classification-field)): One of: 'INVOICE', 'CREDIT NOTE', 'CREDIT CARD RECEIPT', 'EXPENSE RECEIPT'.

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
**lineItems** ([FinancialDocumentV1LineItem](#line-items)[]): List of line item details.

```js
console.log(result.document.inference.prediction.lineItems.value);
```

## Locale
**locale** ([LocaleField](#locale-field)): The locale detected on the document.

```js
console.log(result.document.inference.prediction.locale.value);
```

## Reference Numbers
**referenceNumbers** ([StringField](#string-field)): List of Reference numbers, including PO number.

```js
console.log(result.document.inference.prediction.referenceNumbers.value);
```

## Purchase Subcategory
**subcategory** ([ClassificationField](#classification-field)): The purchase subcategory among predefined classes for transport and food.

```js
console.log(result.document.inference.prediction.subcategory.value);
```

## Supplier Address
**supplierAddress** ([StringField](#string-field)): The address of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierAddress.value);
```

## Supplier Company Registrations
**supplierCompanyRegistrations** ([CompanyRegistrationField](#company-registration-field)): List of company registrations associated to the supplier.

```js
console.log(result.document.inference.prediction.supplierCompanyRegistrations.value);
```

## Supplier name
**supplierName** ([StringField](#string-field)): The name of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierName.value);
```

## Supplier Payment Details
**supplierPaymentDetails** ([PaymentDetailsField](#payment-details-field)): List of payment details associated to the supplier.

```js
console.log(result.document.inference.prediction.supplierPaymentDetails.value);
```

## Supplier Phone Number
**supplierPhoneNumber** ([StringField](#string-field)): The phone number of the supplier or merchant.

```js
console.log(result.document.inference.prediction.supplierPhoneNumber.value);
```

## Taxes
**taxes** ([TaxField](#taxes-field)): List of tax lines information.

```js
console.log(result.document.inference.prediction.taxes.toString());
```

## Purchase Time
**time** ([StringField](#string-field)): The time the purchase was made.

```js
console.log(result.document.inference.prediction.time.value);
```

## Tip and Gratuity
**tip** ([AmountField](#amount-field)): The total amount of tip and gratuity

```js
console.log(result.document.inference.prediction.tip.value);
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
**totalTax** ([AmountField](#amount-field)): The total amount of taxes.

```js
console.log(result.document.inference.prediction.totalTax.value);
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)
