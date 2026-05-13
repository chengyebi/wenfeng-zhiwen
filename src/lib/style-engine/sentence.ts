export function splitParagraphs(content: string): string[] {
  return content
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function splitSentences(content: string): string[] {
  return content
    .split(/(?<=[。！？!?；;])|[\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function visibleLength(text: string): number {
  return Array.from(text.replace(/\s/g, "")).length;
}

export function chineseCharCount(text: string): number {
  return (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
}
