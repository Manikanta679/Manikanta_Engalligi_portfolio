/**
 * Certifications (structural data only).
 *
 * Translatable copy lives in `certifications.items.<id>` within the message
 * files. Add a new certification by appending one object to `certifications`.
 */
export type CertificationTier = "primary" | "additional";

export type Certification = {
  id: string;
  tier: CertificationTier;
  /** Public path to a certificate PDF — omit when unavailable. */
  certificateUrl?: string;
};

/** Builds a safe public URL for certificate filenames with special characters. */
export function certificateUrl(filename: string): string {
  return `/certificates/${encodeURIComponent(filename)}`;
}

export const certifications: Certification[] = [
  {
    id: "mastersTranscript",
    tier: "primary",
    certificateUrl: certificateUrl("Masters_Transcript_First_Semester.pdf"),
  },
  {
    id: "bscDegree",
    tier: "primary",
    certificateUrl: certificateUrl("BSc_Degree_Certificate.pdf"),
  },
  {
    id: "fullStackInternship",
    tier: "primary",
    certificateUrl: certificateUrl("Mani_Internship_Certificate_Biosoft.pdf"),
  },
  {
    id: "devOpsInternship",
    tier: "primary",
    certificateUrl: certificateUrl("Mani's_Internship_Certificate_DocChoice.pdf"),
  },
  {
    id: "dataAnalyticsInternship",
    tier: "primary",
    certificateUrl: certificateUrl("Data_analytics_internship_technohacks.pdf"),
  },
  {
    id: "awsCloudPractitioner",
    tier: "primary",
    certificateUrl: certificateUrl("AWS_Certified_Cloud_Practitioner_(CLF-C02).pdf"),
  },
  {
    id: "linuxProgramming",
    tier: "primary",
    certificateUrl: certificateUrl("TechA_Linux_Programming_Foundation.pdf"),
  },
  {
    id: "matlabOnramp",
    tier: "primary",
    certificateUrl: certificateUrl("MATLAB_Onramp.pdf"),
  },
  {
    id: "aiToolsWorkshop",
    tier: "primary",
    certificateUrl: certificateUrl("AI_tools_workshop.pdf"),
  },
  {
    id: "researchPublication",
    tier: "primary",
    certificateUrl: certificateUrl("Mani_Paper_Publication.pdf"),
  },
  {
    id: "digitalMarketing",
    tier: "primary",
    certificateUrl: certificateUrl("Introduction_to_Digital_Marketing.pdf"),
  },
  {
    id: "techTriathlon",
    tier: "primary",
    certificateUrl: certificateUrl("Tech_Triathlon_Participation.pdf"),
  },
  {
    id: "talentEaseTraining",
    tier: "additional",
    certificateUrl: certificateUrl("TalentEase_Progressive_Training.pdf"),
  },
  {
    id: "vidvathAppreciation",
    tier: "additional",
    certificateUrl: certificateUrl("Vidvath_India_Foundation_Appreciation.pdf"),
  },
];

export const primaryCertifications = certifications.filter(
  (cert) => cert.tier === "primary"
);

export const additionalCertifications = certifications.filter(
  (cert) => cert.tier === "additional"
);

/** Shape of a single translated certification entry (from messages). */
export type CertificationContent = {
  title: string;
  issuer: string;
  year?: string;
};
