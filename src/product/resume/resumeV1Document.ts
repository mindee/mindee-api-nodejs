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
import { ClassificationField, StringField } from "../../parsing/standard";

/**
 * Resume API version 1.1 document data.
 */
export class ResumeV1Document implements Prediction {
  /** The location information of the candidate, including city, state, and country. */
  address: StringField;
  /** The list of certificates obtained by the candidate. */
  certificates: ResumeV1Certificate[] = [];
  /** The ISO 639 code of the language in which the document is written. */
  documentLanguage: StringField;
  /** The type of the document sent. */
  documentType: ClassificationField;
  /** The list of the candidate's educational background. */
  education: ResumeV1Education[] = [];
  /** The email address of the candidate. */
  emailAddress: StringField;
  /** The candidate's first or given names. */
  givenNames: StringField[] = [];
  /** The list of the candidate's technical abilities and knowledge. */
  hardSkills: StringField[] = [];
  /** The position that the candidate is applying for. */
  jobApplied: StringField;
  /** The list of languages that the candidate is proficient in. */
  languages: ResumeV1Language[] = [];
  /** The ISO 3166 code for the country of citizenship of the candidate. */
  nationality: StringField;
  /** The phone number of the candidate. */
  phoneNumber: StringField;
  /** The candidate's current profession. */
  profession: StringField;
  /** The list of the candidate's professional experiences. */
  professionalExperiences: ResumeV1ProfessionalExperience[] = [];
  /** The list of social network profiles of the candidate. */
  socialNetworksUrls: ResumeV1SocialNetworksUrl[] = [];
  /** The list of the candidate's interpersonal and communication abilities. */
  softSkills: StringField[] = [];
  /** The candidate's last names. */
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
    this.documentType = new ClassificationField({
      prediction: rawPrediction["document_type"],
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
      const professionalExperiencesColSizes:number[] = [17, 12, 38, 27, 11, 10, 22, 13, 12];
      professionalExperiencesSummary += "\n" + lineSeparator(professionalExperiencesColSizes, "-") + "\n  ";
      professionalExperiencesSummary += "| Contract Type   ";
      professionalExperiencesSummary += "| Department ";
      professionalExperiencesSummary += "| Description                          ";
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
