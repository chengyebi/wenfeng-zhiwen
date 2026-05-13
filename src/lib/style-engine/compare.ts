import { analyzeText } from "./features";
import type { CompareResult, CountMap, StyleProfile, TextFeatures } from "./types";

function mapTotal(map: CountMap): number {
  return Object.values(map).reduce((sum, value) => sum + value, 0);
}

function closeness(a: number, b: number, tolerance: number): number {
  const diff = Math.abs(a - b);
  return Math.max(0, 1 - diff / tolerance);
}

function normalizedMapSimilarity(a: CountMap, b: CountMap): number {
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
  const totalA = Math.max(mapTotal(a), 1);
  const totalB = Math.max(mapTotal(b), 1);
  const distance = keys.reduce((sum, key) => {
    return sum + Math.abs((a[key] ?? 0) / totalA - (b[key] ?? 0) / totalB);
  }, 0);
  return Math.max(0, 1 - distance / 2);
}

function tendencySimilarity(a: TextFeatures, profile: StyleProfile): number {
  const sampleHedge = mapTotal(a.hedgeWordStats) / Math.max(a.charCount, 1);
  const profileHedge = mapTotal(profile.hedgeWordStats) / Math.max(profile.totalCharCount, 1);
  const sampleAssert = mapTotal(a.assertiveWordStats) / Math.max(a.charCount, 1);
  const profileAssert = mapTotal(profile.assertiveWordStats) / Math.max(profile.totalCharCount, 1);
  return (closeness(sampleHedge, profileHedge, 0.02) + closeness(sampleAssert, profileAssert, 0.02)) / 2;
}

export function compareTextToProfile(content: string, profile: StyleProfile): CompareResult {
  const features = analyzeText(content);
  const sentenceScore = closeness(features.avgSentenceLength, profile.avgSentenceLength, 18);
  const punctuationScore = normalizedMapSimilarity(features.punctuationStats, profile.punctuationStats);
  const connectorScore = normalizedMapSimilarity(features.connectorStats, profile.connectorStats);
  const tendencyScore = tendencySimilarity(features, profile);
  const oralScore = closeness(
    mapTotal(features.oralMarkerStats) / Math.max(features.charCount, 1),
    mapTotal(profile.oralMarkerStats) / Math.max(profile.totalCharCount, 1),
    0.02,
  );
  const structureScore =
    (closeness(features.structureStats.avgParagraphLength, profile.structureStats.avgParagraphLength, 80) +
      closeness(features.structureStats.oneSentenceParagraphRatio, profile.structureStats.oneSentenceParagraphRatio, 0.45)) /
    2;

  const score = Math.round(
    100 *
      (sentenceScore * 0.2 +
        punctuationScore * 0.15 +
        connectorScore * 0.2 +
        tendencyScore * 0.15 +
        oralScore * 0.15 +
        structureScore * 0.15),
  );

  const matchedTraits: string[] = [];
  const differentTraits: string[] = [];

  if (sentenceScore >= 0.72) matchedTraits.push("平均句长接近你的历史表达");
  else differentTraits.push("平均句长与历史画像差异较明显");

  if (punctuationScore >= 0.7) matchedTraits.push("标点使用习惯比较接近");
  else differentTraits.push("标点分布和历史文本不太一致");

  if (connectorScore >= 0.68) matchedTraits.push("连接词使用方式较接近");
  else differentTraits.push("连接词偏好与历史画像不同");

  if (tendencyScore >= 0.68) matchedTraits.push("不确定性和断言表达倾向接近");
  else differentTraits.push("判断语气和历史习惯存在差异");

  if (oralScore >= 0.7) matchedTraits.push("口语化程度接近");
  else differentTraits.push("口语化程度和历史文本不同");

  if (structureScore >= 0.7) matchedTraits.push("段落结构比较接近");
  else differentTraits.push("段落长度或单句成段比例差异较明显");

  return {
    score,
    matchedTraits,
    differentTraits,
    metricDiffs: {
      平均句长差异: Number((features.avgSentenceLength - profile.avgSentenceLength).toFixed(2)),
      标点习惯接近度: Math.round(punctuationScore * 100),
      连接词习惯接近度: Math.round(connectorScore * 100),
      语气倾向接近度: Math.round(tendencyScore * 100),
      口语化接近度: Math.round(oralScore * 100),
      段落结构接近度: Math.round(structureScore * 100),
    },
  };
}
