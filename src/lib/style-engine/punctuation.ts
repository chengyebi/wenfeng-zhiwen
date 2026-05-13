import { PUNCTUATION_KEYS } from "./constants";
import type { CountMap } from "./types";

export function emptyPunctuationStats(): CountMap {
  return Object.fromEntries(PUNCTUATION_KEYS.map((key) => [key, 0]));
}

export function analyzePunctuation(content: string): CountMap {
  return {
    comma: (content.match(/[，,、]/g) ?? []).length,
    period: (content.match(/[。\.]/g) ?? []).length,
    question: (content.match(/[？?]/g) ?? []).length,
    exclamation: (content.match(/[！!]/g) ?? []).length,
    colon: (content.match(/[：:]/g) ?? []).length,
    semicolon: (content.match(/[；;]/g) ?? []).length,
    parentheses: (content.match(/[（）()]/g) ?? []).length,
    ellipsis: (content.match(/……|…|\.\.\./g) ?? []).length,
    dash: (content.match(/[—-]/g) ?? []).length,
  };
}
