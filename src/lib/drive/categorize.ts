/** Subject categories shown as filters in the study material library. */
export const driveSubjects = [
  "Vegetable Science",
  "Fruit Science",
  "Floriculture",
  "Plant Pathology",
  "Post-Harvest Technology",
  "Competitive Exam Preparation",
  "General Horticulture",
] as const;

export type DriveSubject = (typeof driveSubjects)[number];

const rules: { subject: DriveSubject; words: RegExp }[] = [
  { subject: "Vegetable Science", words: /vegetable|olericulture|veg\b|tomato|potato|brinjal|chilli|cucurbit/i },
  { subject: "Fruit Science", words: /fruit|pomology|mango|citrus|banana|grape|orchard/i },
  { subject: "Floriculture", words: /flori|flower|landscap|ornamental|rose|orchid/i },
  { subject: "Plant Pathology", words: /patholog|disease|fung|mycolog|nematod|virus|bacteri/i },
  { subject: "Post-Harvest Technology", words: /post[\s_-]?harvest|storage|processing|value addition/i },
];

const examWords = /pyq|previous|question paper|mcq|objective|aieea|jrf|srf|asrb|net\b|cuet|exam|instant/i;

/**
 * Assign subjects to a PDF using its folder path and file name.
 * A file can belong to several subjects (e.g. "MCQ Treasure of Fruit Science" →
 * Fruit Science + Competitive Exam Preparation).
 */
export function categorize(name: string, folderPath: string[]): DriveSubject[] {
  const haystack = `${folderPath.join(" ")} ${name}`;
  const out = new Set<DriveSubject>();
  for (const r of rules) if (r.words.test(haystack)) out.add(r.subject);
  if (examWords.test(haystack)) out.add("Competitive Exam Preparation");
  if (out.size === 0) out.add("General Horticulture");
  return [...out];
}

/** Turn a raw Drive file name into a readable title. */
export function cleanTitle(name: string) {
  return name
    .replace(/(\.pdf)+$/i, "")
    .replace(/\s+pdf$/i, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
