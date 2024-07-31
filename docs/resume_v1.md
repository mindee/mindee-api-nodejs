---
title: Resume OCR Node.js
category: 622b805aaec68102ea7fcbc2
slug: nodejs-resume-ocr
parentDoc: 609809574212d40077a040f1
---
The Node.js OCR SDK supports the [Resume API](https://platform.mindee.com/mindee/resume).

Using the [sample below](https://github.com/mindee/client-lib-test-data/blob/main/products/resume/default_sample.jpg), we are going to illustrate how to extract the data that we want using the OCR SDK.
![Resume sample](https://github.com/mindee/client-lib-test-data/blob/main/products/resume/default_sample.jpg?raw=true)

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
  mindee.product.ResumeV1,
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
:Mindee ID: bc80bae0-af75-4464-95a9-2419403c75bf
:Filename: default_sample.jpg

Inference
#########
:Product: mindee/resume v1.0
:Rotation applied: No

Prediction
==========
:Document Language: ENG
:Document Type: RESUME
:Given Names: Christopher
:Surnames: Morgan
:Nationality:
:Email Address: christoper.m@gmail.com
:Phone Number: +44 (0) 20 7666 8555
:Address: 177 Great Portland Street, London W5W 6PQ
:Social Networks:
  +----------------------+----------------------------------------------------+
  | Name                 | URL                                                |
  +======================+====================================================+
  | LinkedIn             | linkedin.com/christopher.morgan                    |
  +----------------------+----------------------------------------------------+
:Profession: Senior Web Developer
:Job Applied:
:Languages:
  +----------+----------------------+
  | Language | Level                |
  +==========+======================+
  | SPA      | Fluent               |
  +----------+----------------------+
  | ZHO      | Beginner             |
  +----------+----------------------+
  | DEU      | Intermediate         |
  +----------+----------------------+
:Hard Skills: HTML5
              PHP OOP
              JavaScript
              CSS
              MySQL
:Soft Skills: Project management
              Strong decision maker
              Innovative
              Complex problem solver
              Creative design
              Service-focused
:Education:
  +-----------------+---------------------------+-----------+----------+---------------------------+-------------+------------+
  | Domain          | Degree                    | End Month | End Year | School                    | Start Month | Start Year |
  +=================+===========================+===========+==========+===========================+=============+============+
  | Computer Inf... | Bachelor                  |           |          | Columbia University, NY   |             | 2014       |
  +-----------------+---------------------------+-----------+----------+---------------------------+-------------+------------+
:Professional Experiences:
  +-----------------+------------+---------------------------+-----------+----------+----------------------+-------------+------------+
  | Contract Type   | Department | Employer                  | End Month | End Year | Role                 | Start Month | Start Year |
  +=================+============+===========================+===========+==========+======================+=============+============+
  | Full-Time       |            | Luna Web Design, New York | 05        | 2019     | Web Developer        | 09          | 2015       |
  +-----------------+------------+---------------------------+-----------+----------+----------------------+-------------+------------+
:Certificates:
  +------------+--------------------------------+---------------------------+------+
  | Grade      | Name                           | Provider                  | Year |
  +============+================================+===========================+======+
  |            | PHP Framework (certificate)... |                           | 2014 |
  +------------+--------------------------------+---------------------------+------+
  |            | Programming Languages: Java... |                           |      |
  +------------+--------------------------------+---------------------------+------+
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


### Classification Field
The classification field `ClassificationField` does not implement all the basic `Field` attributes. It only implements **value**, **confidence** and **pageId**.

> Note: a classification field's `value is always a `string`.

### String Field
The text field `StringField` only has one constraint: its **value** is a `string` (or `undefined`).

## Specific Fields
Fields which are specific to this product; they are not used in any other product.

### Certificates Field
The list of certificates obtained by the candidate.

A `ResumeV1Certificate` implements the following attributes:

* `grade` (string): The grade obtained for the certificate.
* `name` (string): The name of certification.
* `provider` (string): The organization or institution that issued the certificate.
* `year` (string): The year when a certificate was issued or received.
Fields which are specific to this product; they are not used in any other product.

### Education Field
The list of the candidate's educational background.

A `ResumeV1Education` implements the following attributes:

* `degreeDomain` (string): The area of study or specialization.
* `degreeType` (string): The type of degree obtained, such as Bachelor's, Master's, or Doctorate.
* `endMonth` (string): The month when the education program or course was completed.
* `endYear` (string): The year when the education program or course was completed.
* `school` (string): The name of the school.
* `startMonth` (string): The month when the education program or course began.
* `startYear` (string): The year when the education program or course began.
Fields which are specific to this product; they are not used in any other product.

### Languages Field
The list of languages that the candidate is proficient in.

A `ResumeV1Language` implements the following attributes:

* `language` (string): The language's ISO 639 code.
* `level` (string): The candidate's level for the language.
Fields which are specific to this product; they are not used in any other product.

### Professional Experiences Field
The list of the candidate's professional experiences.

A `ResumeV1ProfessionalExperience` implements the following attributes:

* `contractType` (string): The type of contract for the professional experience.
* `department` (string): The specific department or division within the company.
* `employer` (string): The name of the company or organization.
* `endMonth` (string): The month when the professional experience ended.
* `endYear` (string): The year when the professional experience ended.
* `role` (string): The position or job title held by the candidate.
* `startMonth` (string): The month when the professional experience began.
* `startYear` (string): The year when the professional experience began.
Fields which are specific to this product; they are not used in any other product.

### Social Networks Field
The list of social network profiles of the candidate.

A `ResumeV1SocialNetworksUrl` implements the following attributes:

* `name` (string): The name of the social network.
* `url` (string): The URL of the social network.

# Attributes
The following fields are extracted for Resume V1:

## Address
**address** ([StringField](#string-field)): The location information of the candidate, including city, state, and country.

```js
console.log(result.document.inference.prediction.address.value);
```

## Certificates
**certificates** ([ResumeV1Certificate](#certificates-field)[]): The list of certificates obtained by the candidate.

```js
for (const certificatesElem of result.document.inference.prediction.certificates) {
  console.log(certificatesElem.value);
}
```

## Document Language
**documentLanguage** ([StringField](#string-field)): The ISO 639 code of the language in which the document is written.

```js
console.log(result.document.inference.prediction.documentLanguage.value);
```

## Document Type
**documentType** ([ClassificationField](#classification-field)): The type of the document sent.

```js
console.log(result.document.inference.prediction.documentType.value);
```

## Education
**education** ([ResumeV1Education](#education-field)[]): The list of the candidate's educational background.

```js
for (const educationElem of result.document.inference.prediction.education) {
  console.log(educationElem.value);
}
```

## Email Address
**emailAddress** ([StringField](#string-field)): The email address of the candidate.

```js
console.log(result.document.inference.prediction.emailAddress.value);
```

## Given Names
**givenNames** ([StringField](#string-field)[]): The candidate's first or given names.

```js
for (const givenNamesElem of result.document.inference.prediction.givenNames) {
  console.log(givenNamesElem.value);
}
```

## Hard Skills
**hardSkills** ([StringField](#string-field)[]): The list of the candidate's technical abilities and knowledge.

```js
for (const hardSkillsElem of result.document.inference.prediction.hardSkills) {
  console.log(hardSkillsElem.value);
}
```

## Job Applied
**jobApplied** ([StringField](#string-field)): The position that the candidate is applying for.

```js
console.log(result.document.inference.prediction.jobApplied.value);
```

## Languages
**languages** ([ResumeV1Language](#languages-field)[]): The list of languages that the candidate is proficient in.

```js
for (const languagesElem of result.document.inference.prediction.languages) {
  console.log(languagesElem.value);
}
```

## Nationality
**nationality** ([StringField](#string-field)): The ISO 3166 code for the country of citizenship of the candidate.

```js
console.log(result.document.inference.prediction.nationality.value);
```

## Phone Number
**phoneNumber** ([StringField](#string-field)): The phone number of the candidate.

```js
console.log(result.document.inference.prediction.phoneNumber.value);
```

## Profession
**profession** ([StringField](#string-field)): The candidate's current profession.

```js
console.log(result.document.inference.prediction.profession.value);
```

## Professional Experiences
**professionalExperiences** ([ResumeV1ProfessionalExperience](#professional-experiences-field)[]): The list of the candidate's professional experiences.

```js
for (const professionalExperiencesElem of result.document.inference.prediction.professionalExperiences) {
  console.log(professionalExperiencesElem.value);
}
```

## Social Networks
**socialNetworksUrls** ([ResumeV1SocialNetworksUrl](#social-networks-field)[]): The list of social network profiles of the candidate.

```js
for (const socialNetworksUrlsElem of result.document.inference.prediction.socialNetworksUrls) {
  console.log(socialNetworksUrlsElem.value);
}
```

## Soft Skills
**softSkills** ([StringField](#string-field)[]): The list of the candidate's interpersonal and communication abilities.

```js
for (const softSkillsElem of result.document.inference.prediction.softSkills) {
  console.log(softSkillsElem.value);
}
```

## Surnames
**surnames** ([StringField](#string-field)[]): The candidate's last names.

```js
for (const surnamesElem of result.document.inference.prediction.surnames) {
  console.log(surnamesElem.value);
}
```

# Questions?
[Join our Slack](https://join.slack.com/t/mindee-community/shared_invite/zt-2d0ds7dtz-DPAF81ZqTy20chsYpQBW5g)
