const FASTA_HEADER_PREFIX = ">";
const ATGC_ONLY_PATTERN = /^[ATGC]*$/i;
const UPPERCASE_ATGC_ONLY_PATTERN = /^[ATGC]+$/;
const NON_ATGC_PATTERN = /[^ATGCatgc]/;
const NON_ATGC_GLOBAL_PATTERN = /[^ATGCatgc]/g;

const stripFastaHeadersAndWhitespace = (rawSequence: string) =>
  rawSequence
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith(FASTA_HEADER_PREFIX))
    .join("")
    .replace(/\s+/g, "");

export const toUpperCaseAtgcOnly = (value: string) =>
  ATGC_ONLY_PATTERN.test(value) ? value.toUpperCase() : value;

export const sanitizeStep1TemplateSequenceInput = (rawSequence: string) =>
  stripFastaHeadersAndWhitespace(rawSequence)
    .replace(NON_ATGC_GLOBAL_PATTERN, "")
    .toUpperCase();

export const normalizeStep1TemplateSequence = (rawSequence: string) =>
  sanitizeStep1TemplateSequenceInput(rawSequence);

export const isUppercaseAtgcOnlySequence = (value: string) =>
  UPPERCASE_ATGC_ONLY_PATTERN.test(value);

export const getInvalidStep1TemplateSequenceChar = (rawSequence: string) =>
  stripFastaHeadersAndWhitespace(rawSequence).match(NON_ATGC_PATTERN)?.[0] ?? null;
