import { analyzePunctuation } from "./punctuation";
import { splitParagraphs, splitSentences, visibleLength, chineseCharCount } from "./sentence";
import {
  assertiveWordStats,
  connectorStats,
  hedgeWordStats,
  oralMarkerStats,
  topRepeatedPhrases,
} from "./markers";
import type { TextFeatures } from "./types";

function ratio(part: number, total: number): number {
  return total > 0 ? Number((part / total).toFixed(4)) : 0;
}

export function analyzeText(content: string): TextFeatures {
  const paragraphs = splitParagraphs(content);
  const sentences = splitSentences(content);
  const sentenceLengths = sentences.map(visibleLength).filter((length) => length > 0);
  const charCount = visibleLength(content);
  const sentenceCount = Math.max(sentenceLengths.length, 1);
  const shortCount = sentenceLengths.filter((length) => length <= 15).length;
  const mediumCount = sentenceLengths.filter((length) => length > 15 && length <= 35).length;
  const longCount = sentenceLengths.filter((length) => length > 35).length;
  const totalSentenceLength = sentenceLengths.reduce((sum, value) => sum + value, 0);
  const paragraphLengths = paragraphs.map(visibleLength);
  const paragraphSentenceCounts = paragraphs.map((paragraph) => splitSentences(paragraph).length);

  return {
    charCount,
    chineseCharCount: chineseCharCount(content),
    sentenceCount: sentenceLengths.length,
    paragraphCount: paragraphs.length,
    avgSentenceLength: Number((totalSentenceLength / sentenceCount).toFixed(2)),
    maxSentenceLength: sentenceLengths.length ? Math.max(...sentenceLengths) : 0,
    minSentenceLength: sentenceLengths.length ? Math.min(...sentenceLengths) : 0,
    shortSentenceRatio: ratio(shortCount, sentenceLengths.length),
    mediumSentenceRatio: ratio(mediumCount, sentenceLengths.length),
    longSentenceRatio: ratio(longCount, sentenceLengths.length),
    punctuationStats: analyzePunctuation(content),
    connectorStats: connectorStats(content),
    hedgeWordStats: hedgeWordStats(content),
    assertiveWordStats: assertiveWordStats(content),
    oralMarkerStats: oralMarkerStats(content),
    topRepeatedPhrases: topRepeatedPhrases(content),
    structureStats: {
      avgParagraphLength: Number(
        (
          paragraphLengths.reduce((sum, value) => sum + value, 0) / Math.max(paragraphLengths.length, 1)
        ).toFixed(2),
      ),
      oneSentenceParagraphRatio: ratio(
        paragraphSentenceCounts.filter((count) => count === 1).length,
        paragraphSentenceCounts.length,
      ),
      questionSentenceRatio: ratio(sentences.filter((sentence) => /[？?]$/.test(sentence)).length, sentences.length),
      exclamationSentenceRatio: ratio(
        sentences.filter((sentence) => /[！!]$/.test(sentence)).length,
        sentences.length,
      ),
    },
  };
}
