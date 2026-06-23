/**
 * How to output a CLI response.
 */
export enum OutputType {
  /** Document-level summary, in rST format. (Default) */
  summary = "summary",
  /** Complete response in rST format. */
  full = "full",
  /** Raw JSON. */
  raw = "raw",
}

export const OUTPUT_CHOICES: readonly OutputType[] = [
  OutputType.summary,
  OutputType.full,
  OutputType.raw,
] as const;

export const OUTPUT_DESCRIPTION =
  "Specify how to output the data:\n" +
  "- summary: a basic summary (default)\n" +
  "- full: detailed extraction results, including options\n" +
  "- raw: full JSON response";

export function parseOutput(value: string): OutputType {
  const normalized = value.toLowerCase();
  for (const choice of OUTPUT_CHOICES) {
    if (choice === normalized) {
      return choice;
    }
  }
  throw new Error(
    `Invalid output type '${value}'. Valid values are: ${OUTPUT_CHOICES.join(", ")}.`
  );
}
