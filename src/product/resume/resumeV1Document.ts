import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../parsing/common";
import { ResumeV1SocialNetworksUrl } from "./resumeV1SocialNetworksUrl";
import { ResumeV1Language } from "./resumeV1Language";
import { ResumeV1Education } from "./resumeV1Education";
import { ResumeV1ProfessionalExperience } from "./resumeV1ProfessionalExperience";
import { ResumeV1Certificate } from "./resumeV1Certificate";
import { StringField } from "../../parsing/standard";

/**
 * Document data for Resume, API version 1.
 */
export class ResumeV1Document implements Prediction {
  /** The location information of the person, including city, state, and country. */
  address: StringField;
  /** The list of certificates obtained by the candidate. */
  certificates: ResumeV1Certificate[] = [];
  /** The ISO 639 code of the language in which the document is written. */
  documentLanguage: StringField;
  /** The type of the document sent, possible values being RESUME, MOTIVATION_LETTER and RECOMMENDATION_LETTER. */
  documentType: StringField;
  /** The list of values that represent the educational background of an individual. */
  education: ResumeV1Education[] = [];
  /** The email address of the candidate. */
  emailAddress: StringField;
  /** The list of names that represent a person's first or given names. */
  givenNames: StringField[] = [];
  /** The list of specific technical abilities and knowledge mentioned in a resume. */
  hardSkills: StringField[] = [];
  /** The specific industry or job role that the applicant is applying for. */
  jobApplied: StringField;
  /** The list of languages that a person is proficient in, as stated in their resume. */
  languages: ResumeV1Language[] = [];
  /** The ISO 3166 code for the country of citizenship or origin of the person. */
  nationality: StringField;
  /** The phone number of the candidate. */
  phoneNumber: StringField;
  /** The area of expertise or specialization in which the individual has professional experience and qualifications. */
  profession: StringField;
  /** The list of values that represent the professional experiences of an individual in their global resume. */
  professionalExperiences: ResumeV1ProfessionalExperience[] = [];
  /** The list of URLs for social network profiles of the person. */
  socialNetworksUrls: ResumeV1SocialNetworksUrl[] = [];
  /** The list of values that represent a person's interpersonal and communication abilities in a global resume. */
  softSkills: StringField[] = [];
  /** The list of last names provided in a resume document. */
  surnames: StringField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.address = new StringField({
      prediction: rawPrediction["address"],
      pageId: pageId,
    });
    rawPrediction["certificates"] &&
      rawPrediction["certificates"].map(
        (itemPrediction: StringDict) =>
          this.certificates.push(
            new ResumeV1Certificate({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.documentLanguage = new StringField({
      prediction: rawPrediction["document_language"],
      pageId: pageId,
    });
    this.documentType = new StringField({
      prediction: rawPrediction["document_type"],
      pageId: pageId,
    });
    rawPrediction["education"] &&
      rawPrediction["education"].map(
        (itemPrediction: StringDict) =>
          this.education.push(
            new ResumeV1Education({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.emailAddress = new StringField({
      prediction: rawPrediction["email_address"],
      pageId: pageId,
    });
    rawPrediction["given_names"] &&
      rawPrediction["given_names"].map(
        (itemPrediction: StringDict) =>
          this.givenNames.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    rawPrediction["hard_skills"] &&
      rawPrediction["hard_skills"].map(
        (itemPrediction: StringDict) =>
          this.hardSkills.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.jobApplied = new StringField({
      prediction: rawPrediction["job_applied"],
      pageId: pageId,
    });
    rawPrediction["languages"] &&
      rawPrediction["languages"].map(
        (itemPrediction: StringDict) =>
          this.languages.push(
            new ResumeV1Language({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.nationality = new StringField({
      prediction: rawPrediction["nationality"],
      pageId: pageId,
    });
    this.phoneNumber = new StringField({
      prediction: rawPrediction["phone_number"],
      pageId: pageId,
    });
    this.profession = new StringField({
      prediction: rawPrediction["profession"],
      pageId: pageId,
    });
    rawPrediction["professional_experiences"] &&
      rawPrediction["professional_experiences"].map(
        (itemPrediction: StringDict) =>
          this.professionalExperiences.push(
            new ResumeV1ProfessionalExperience({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    rawPrediction["social_networks_urls"] &&
      rawPrediction["social_networks_urls"].map(
        (itemPrediction: StringDict) =>
          this.socialNetworksUrls.push(
            new ResumeV1SocialNetworksUrl({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    rawPrediction["soft_skills"] &&
      rawPrediction["soft_skills"].map(
        (itemPrediction: StringDict) =>
          this.softSkills.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    rawPrediction["surnames"] &&
      rawPrediction["surnames"].map(
        (itemPrediction: StringDict) =>
          this.surnames.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const givenNames = this.givenNames.join("\n              ");
    const surnames = this.surnames.join("\n           ");
    let socialNetworksUrlsSummary:string = "";
    if (this.socialNetworksUrls && this.socialNetworksUrls.length > 0) {
      const socialNetworksUrlsColSizes:number[] = [22, 52];
      socialNetworksUrlsSummary += "\n" + lineSeparator(socialNetworksUrlsColSizes, "-") + "\n  ";
      socialNetworksUrlsSummary += "| Name                 ";
      socialNetworksUrlsSummary += "| URL                                                ";
      socialNetworksUrlsSummary += "|\n" + lineSeparator(socialNetworksUrlsColSizes, "=");
      socialNetworksUrlsSummary += this.socialNetworksUrls.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(socialNetworksUrlsColSizes, "-")
      ).join("");
    }
    let languagesSummary:string = "";
    if (this.languages && this.languages.length > 0) {
      const languagesColSizes:number[] = [10, 22];
      languagesSummary += "\n" + lineSeparator(languagesColSizes, "-") + "\n  ";
      languagesSummary += "| Language ";
      languagesSummary += "| Level                ";
      languagesSummary += "|\n" + lineSeparator(languagesColSizes, "=");
      languagesSummary += this.languages.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(languagesColSizes, "-")
      ).join("");
    }
    const hardSkills = this.hardSkills.join("\n              ");
    const softSkills = this.softSkills.join("\n              ");
    let educationSummary:string = "";
    if (this.education && this.education.length > 0) {
      const educationColSizes:number[] = [17, 27, 11, 10, 27, 13, 12];
      educationSummary += "\n" + lineSeparator(educationColSizes, "-") + "\n  ";
      educationSummary += "| Domain          ";
      educationSummary += "| Degree                    ";
      educationSummary += "| End Month ";
      educationSummary += "| End Year ";
      educationSummary += "| School                    ";
      educationSummary += "| Start Month ";
      educationSummary += "| Start Year ";
      educationSummary += "|\n" + lineSeparator(educationColSizes, "=");
      educationSummary += this.education.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(educationColSizes, "-")
      ).join("");
    }
    let professionalExperiencesSummary:string = "";
    if (this.professionalExperiences && this.professionalExperiences.length > 0) {
      const professionalExperiencesColSizes:number[] = [17, 12, 27, 11, 10, 22, 13, 12];
      professionalExperiencesSummary += "\n" + lineSeparator(professionalExperiencesColSizes, "-") + "\n  ";
      professionalExperiencesSummary += "| Contract Type   ";
      professionalExperiencesSummary += "| Department ";
      professionalExperiencesSummary += "| Employer                  ";
      professionalExperiencesSummary += "| End Month ";
      professionalExperiencesSummary += "| End Year ";
      professionalExperiencesSummary += "| Role                 ";
      professionalExperiencesSummary += "| Start Month ";
      professionalExperiencesSummary += "| Start Year ";
      professionalExperiencesSummary += "|\n" + lineSeparator(professionalExperiencesColSizes, "=");
      professionalExperiencesSummary += this.professionalExperiences.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(professionalExperiencesColSizes, "-")
      ).join("");
    }
    let certificatesSummary:string = "";
    if (this.certificates && this.certificates.length > 0) {
      const certificatesColSizes:number[] = [12, 32, 27, 6];
      certificatesSummary += "\n" + lineSeparator(certificatesColSizes, "-") + "\n  ";
      certificatesSummary += "| Grade      ";
      certificatesSummary += "| Name                           ";
      certificatesSummary += "| Provider                  ";
      certificatesSummary += "| Year ";
      certificatesSummary += "|\n" + lineSeparator(certificatesColSizes, "=");
      certificatesSummary += this.certificates.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(certificatesColSizes, "-")
      ).join("");
    }
    const outStr = `:Document Language: ${this.documentLanguage}
:Document Type: ${this.documentType}
:Given Names: ${givenNames}
:Surnames: ${surnames}
:Nationality: ${this.nationality}
:Email Address: ${this.emailAddress}
:Phone Number: ${this.phoneNumber}
:Address: ${this.address}
:Social Networks: ${socialNetworksUrlsSummary}
:Profession: ${this.profession}
:Job Applied: ${this.jobApplied}
:Languages: ${languagesSummary}
:Hard Skills: ${hardSkills}
:Soft Skills: ${softSkills}
:Education: ${educationSummary}
:Professional Experiences: ${professionalExperiencesSummary}
:Certificates: ${certificatesSummary}`.trimEnd();
    return cleanOutString(outStr);
  }
}
