/**
 * Spoken languages (structural data only).
 *
 * `value` is the proficiency as a percentage (0–100). It drives the animated
 * segmented proficiency indicator in the Languages card (one filled segment per
 * 10%). The translated name and proficiency level live in the
 * `about.languages.items.<key>` namespace of the message files.
 */
export type Language = {
  key: string;
  /** Proficiency as a percentage (0–100). */
  value: number;
};

/** Number of segments rendered in the proficiency indicator. */
export const LANGUAGE_SEGMENTS = 10;

export const languages: Language[] = [
  { key: "english", value: 90 },
  { key: "german", value: 60 },
  { key: "kannada", value: 100 },
];
