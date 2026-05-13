import type { CountMap, StyleProfile } from "./types";

function total(map: CountMap): number {
  return Object.values(map).reduce((sum, value) => sum + value, 0);
}

function topKeys(map: CountMap, limit = 3): string[] {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .filter(([, value]) => value > 0)
    .slice(0, limit)
    .map(([key]) => key);
}

export function generateProfileSummary(profile: StyleProfile): string {
  const lines: string[] = [];

  if (profile.totalCharCount < 500) {
    lines.push("当前样本很少，画像只能作为初步参考。");
  } else {
    lines.push(`当前画像基于 ${profile.sampleCount} 条样本，属于「${profile.reliabilityLevel}」。`);
  }

  if (profile.avgSentenceLength <= 18) {
    lines.push("你的句子整体偏短，表达节奏较快。");
  } else if (profile.avgSentenceLength >= 36) {
    lines.push("你的句子整体偏长，常在一句话中承载较多信息。");
  } else {
    lines.push("你的句长处在中等范围，表达节奏相对均衡。");
  }

  const connectors = topKeys(profile.connectorStats);
  if (connectors.length > 0) {
    lines.push(`你较常使用「${connectors.join("、")}」等连接表达，文本衔接特征比较明显。`);
  } else {
    lines.push("你较少显式使用连接词，表达更依赖句子顺序本身。");
  }

  if (total(profile.hedgeWordStats) > total(profile.assertiveWordStats)) {
    lines.push("你的不确定性表达较多，说明你习惯保留判断余地。");
  } else if (total(profile.assertiveWordStats) > total(profile.hedgeWordStats)) {
    lines.push("你的断言表达更明显，说明你倾向给出确定判断。");
  } else {
    lines.push("你的不确定性表达和断言表达相对平衡。");
  }

  if (total(profile.oralMarkerStats) >= Math.max(2, profile.sampleCount)) {
    lines.push("你的口语标记较明显，整体表达更接近日常对话。");
  } else {
    lines.push("你的口语标记不多，整体表达偏书面或克制。");
  }

  if (profile.structureStats.oneSentenceParagraphRatio >= 0.55) {
    lines.push("你经常使用单句成段，段落切分较干净。");
  } else {
    lines.push("你的段落通常包含多句话，倾向展开式表达。");
  }

  return lines.join("\n");
}
