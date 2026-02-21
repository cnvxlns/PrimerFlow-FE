const FASTA_HEADER_PREFIX = ">";
const UPPERCASE_ATGC_ONLY_PATTERN = /^[ATGC]+$/;
const NON_ATGC_PATTERN = /[^ATGCatgc]/;
const NON_ATGC_GLOBAL_PATTERN = /[^ATGCatgc]/g;

const stripFastaHeadersAndWhitespace = (rawSequence: string) =>
  rawSequence
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith(FASTA_HEADER_PREFIX))
    .join("")
    .replace(/\s+/g, "");

export const sanitizeStep1TemplateSequenceInput = (rawSequence: string) =>
  stripFastaHeadersAndWhitespace(rawSequence)
    .replace(NON_ATGC_GLOBAL_PATTERN, "")
    .toUpperCase();

export const normalizeStep1TemplateSequence = (rawSequence: string) =>
  sanitizeStep1TemplateSequenceInput(rawSequence);

export const isUppercaseAtgcOnlySequence = (value: string) =>
  UPPERCASE_ATGC_ONLY_PATTERN.test(value);

export const getInvalidStep1TemplateSequenceChars = (rawSequence: string) => {
  const matches = stripFastaHeadersAndWhitespace(rawSequence).match(NON_ATGC_GLOBAL_PATTERN);
  if (!matches) return [];

  const uniqueChars = new Set<string>();
  for (const char of matches) {
    uniqueChars.add(char);
  }
  return [...uniqueChars];
};

export const getInvalidStep1TemplateSequenceChar = (rawSequence: string) =>
  stripFastaHeadersAndWhitespace(rawSequence).match(NON_ATGC_PATTERN)?.[0] ?? null;
