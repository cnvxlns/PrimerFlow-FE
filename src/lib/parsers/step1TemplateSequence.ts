const FASTA_HEADER_PREFIX = ">";
const ATGC_ONLY_PATTERN = /^[ATGC]*$/i;
const NON_ATGC_PATTERN = /[^ATGCatgc]/;

const stripFastaHeadersAndWhitespace = (rawSequence: string) =>
  rawSequence
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith(FASTA_HEADER_PREFIX))
    .join("")
    .replace(/\s+/g, "");

export const toUpperCaseAtgcOnly = (value: string) =>
  ATGC_ONLY_PATTERN.test(value) ? value.toUpperCase() : value;

export const normalizeStep1TemplateSequence = (rawSequence: string) =>
  toUpperCaseAtgcOnly(stripFastaHeadersAndWhitespace(rawSequence));

export const getInvalidStep1TemplateSequenceChar = (rawSequence: string) =>
  stripFastaHeadersAndWhitespace(rawSequence).match(NON_ATGC_PATTERN)?.[0] ?? null;
