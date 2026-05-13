import { ENGINE_VERSION, PUNCTUATION_KEYS, CONNECTORS, HEDGE_WORDS, ASSERTIVE_WORDS, ORAL_MARKERS } from "./constants";
import { generateProfileSummary } from "./summary";
import type { CountMap, PhraseCount, StyleProfile, TextFeatures } from "./types";

function emptyMap(keys: string[]): CountMap {
  return Object.fromEntries(keys.map((key) => [key, 0]));
}

function addMap(target: CountMap, source: CountMap): CountMap {
  const next = { ...target };
  for (const [key, value] of Object.entries(source)) {
    next[key] = (next[key] ?? 0) + value;
  }
  return next;
}

function weightedAverage(features: TextFeatures[], selector: (feature: TextFeatures) => number): number {
  const totalWeight = features.reduce((sum, feature) => sum + Math.max(feature.charCount, 1), 0);
  const value = features.reduce((sum, feature) => sum + selector(feature) * Math.max(feature.charCount, 1), 0);
  return Number((value / Math.max(totalWeight, 1)).toFixed(4));
}

function reliability(totalCharCount: number): string {
  if (totalCharCount < 500) return "样本很少，仅供参考";
  if (totalCharCount < 2000) return "初步画像";
  if (totalCharCount < 8000) return "较稳定画像";
  return "稳定画像";
}

function mergePhrases(features: TextFeatures[]): PhraseCount[] {
  const counts = new Map<string, number>();
  for (const feature of features) {
    for (const item of feature.topRepeatedPhrases) {
      counts.set(item.phrase, (counts.get(item.phrase) ?? 0) + item.count);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .slice(0, 20)
    .map(([phrase, count]) => ({ phrase, count }));
}

export function buildStyleProfile(features: TextFeatures[]): { profile: StyleProfile; summaryText: string } {
  const totalCharCount = features.reduce((sum, feature) => sum + feature.charCount, 0);
  const baseProfile: StyleProfile = {
    engineVersion: ENGINE_VERSION,
    sampleCount: features.length,
    totalCharCount,
    reliabilityLevel: reliability(totalCharCount),
    avgSentenceLength: weightedAverage(features, (feature) => feature.avgSentenceLength),
    shortSentenceRatio: weightedAverage(features, (feature) => feature.shortSentenceRatio),
    mediumSentenceRatio: weightedAverage(features, (feature) => feature.mediumSentenceRatio),
    longSentenceRatio: weightedAverage(features, (feature) => feature.longSentenceRatio),
    punctuationStats: features.reduce((map, feature) => addMap(map, feature.punctuationStats), emptyMap(PUNCTUATION_KEYS)),
    connectorStats: features.reduce((map, feature) => addMap(map, feature.connectorStats), emptyMap(CONNECTORS)),
    hedgeWordStats: features.reduce((map, feature) => addMap(map, feature.hedgeWordStats), emptyMap(HEDGE_WORDS)),
    assertiveWordStats: features.reduce(
      (map, feature) => addMap(map, feature.assertiveWordStats),
      emptyMap(ASSERTIVE_WORDS),
    ),
    oralMarkerStats: features.reduce((map, feature) => addMap(map, feature.oralMarkerStats), emptyMap(ORAL_MARKERS)),
    topRepeatedPhrases: mergePhrases(features),
    structureStats: {
      avgParagraphLength: weightedAverage(features, (feature) => feature.structureStats.avgParagraphLength),
      oneSentenceParagraphRatio: weightedAverage(features, (feature) => feature.structureStats.oneSentenceParagraphRatio),
      questionSentenceRatio: weightedAverage(features, (feature) => feature.structureStats.questionSentenceRatio),
      exclamationSentenceRatio: weightedAverage(features, (feature) => feature.structureStats.exclamationSentenceRatio),
    },
  };

  return {
    profile: baseProfile,
    summaryText: generateProfileSummary(baseProfile),
  };
}
