export type CountMap = Record<string, number>;

export interface PhraseCount {
  phrase: string;
  count: number;
}

export interface TextFeatures {
  charCount: number;
  chineseCharCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgSentenceLength: number;
  maxSentenceLength: number;
  minSentenceLength: number;
  shortSentenceRatio: number;
  mediumSentenceRatio: number;
  longSentenceRatio: number;
  punctuationStats: CountMap;
  connectorStats: CountMap;
  hedgeWordStats: CountMap;
  assertiveWordStats: CountMap;
  oralMarkerStats: CountMap;
  topRepeatedPhrases: PhraseCount[];
  structureStats: {
    avgParagraphLength: number;
    oneSentenceParagraphRatio: number;
    questionSentenceRatio: number;
    exclamationSentenceRatio: number;
  };
}

export interface StyleProfile {
  engineVersion: string;
  sampleCount: number;
  totalCharCount: number;
  reliabilityLevel: string;
  avgSentenceLength: number;
  shortSentenceRatio: number;
  mediumSentenceRatio: number;
  longSentenceRatio: number;
  punctuationStats: CountMap;
  connectorStats: CountMap;
  hedgeWordStats: CountMap;
  assertiveWordStats: CountMap;
  oralMarkerStats: CountMap;
  topRepeatedPhrases: PhraseCount[];
  structureStats: TextFeatures["structureStats"];
}

export interface CompareResult {
  score: number;
  matchedTraits: string[];
  differentTraits: string[];
  metricDiffs: Record<string, string | number>;
}
