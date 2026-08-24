/**
 * Projects (structural data only).
 *
 * Translatable content (title, subtitle, description, category and the full
 * case-study copy) lives in the `projects.items.<slug>` namespace of the message
 * files and is read via `t.raw("items")` in the section. Technology names are
 * proper nouns and intentionally kept here / in the message arrays.
 *
 * The `slug` is also the route segment for future detail pages
 * (e.g. `/projects/[slug]`).
 */
export type ProjectStatus = "latest" | "completed" | "in-progress";

export type Project = {
  /** Stable, URL-safe identifier — also the key into `projects.items`. */
  slug: string;
  /** Short technology chips shown on the overview card. */
  technologies: readonly string[];
  status: ProjectStatus;
  /**
   * External links. Left undefined while no public URL exists — the buttons are
   * only rendered when a real URL is provided (no placeholders/broken links).
   */
  github?: string;
  liveDemo?: string;
  /** Optional image (e.g. Cloudinary public path). Falls back to a placeholder. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "ice-train-delay-prediction",
    status: "latest",
    technologies: ["Python", "XGBoost", "LightGBM", "Scikit-learn", "Pandas"],
    github:
      "https://github.com/Manikanta679/ICE_Train_Delay_Prediction_Machine_Learning_Forecasting_Model-",
    image: "/images/projects/ice-train-delay-prediction.svg",
  },
  {
    slug: "forestguard",
    status: "completed",
    technologies: ["Python", "TensorFlow", "U-Net", "FastAPI", "Sentinel-2"],
    github:
      "https://github.com/Manikanta679/ForestGuard_Satellite_Based_Deforestation_Detection-",
    image: "/images/projects/forestguard.svg",
  },
  {
    slug: "data-analysis-toolkit",
    status: "completed",
    technologies: [
      "Next.js",
      "TypeScript",
      "Python",
      "Data Analytics",
      "Tailwind CSS",
    ],
    github: "https://github.com/Manikanta679/Data-Analysis-Toolkit",
    liveDemo: "https://data-analysis-toolkit-eight.vercel.app/",
    image: "/images/projects/data-analysis-toolkit.svg",
  },
  {
    slug: "vital-guard",
    status: "completed",
    technologies: [
      "ESP8266",
      "MPU6050",
      "GPS",
      "Blynk IoT",
      "Embedded Systems",
    ],
    image: "/images/projects/vital-guard.svg",
  },
  {
    slug: "text-analysis-toolkit",
    status: "completed",
    technologies: ["Python", "NLP", "FastAPI", "Sentiment Analysis", "CLI"],
    github: "https://github.com/Manikanta679/Text_analysis_toolkit",
    image: "/images/projects/text-analysis-toolkit.svg",
  },
  {
    slug: "video-anomaly-detection",
    status: "completed",
    technologies: ["TensorFlow", "Keras", "OpenCV", "CNN", "Transfer Learning"],
    image: "/images/projects/video-anomaly-detection.svg",
  },
  {
    slug: "sms-spam-detection",
    status: "completed",
    technologies: ["Python", "Scikit-learn", "NLTK", "TF-IDF", "NLP"],
    image: "/images/projects/sms-spam-detection.svg",
  },
];

/** A labelled group of technologies in the case-study "Technology Stack". */
export type TechGroup = {
  label: string;
  items: string[];
};

/** A named item with a short professional explanation (architecture / modules). */
export type NamedDetail = {
  name: string;
  description: string;
};

/** Shape of a single translated project entry (from messages). */
export type ProjectContent = {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  overview: string;
  features: string[];
  architecture: NamedDetail[];
  stack: TechGroup[];
  modules: NamedDetail[];
  contributions: string[];
  challenges: string[];
  outcomes: string[];
};

/** Lookup helper for future project detail pages. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
