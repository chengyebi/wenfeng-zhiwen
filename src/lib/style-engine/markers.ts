import { ASSERTIVE_WORDS, CONNECTORS, HEDGE_WORDS, ORAL_MARKERS } from "./constants";
import type { CountMap, PhraseCount } from "./types";

export function countMarkers(content: string, markers: string[]): CountMap {
  return Object.fromEntries(
    markers.map((marker) => {
      const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return [marker, (content.match(new RegExp(escaped, "g")) ?? []).length];
    }),
  );
}

export function connectorStats(content: string): CountMap {
  return countMarkers(content, CONNECTORS);
}

export function hedgeWordStats(content: string): CountMap {
  return countMarkers(content, HEDGE_WORDS);
}

export function assertiveWordStats(content: string): CountMap {
  return countMarkers(content, ASSERTIVE_WORDS);
}

export function oralMarkerStats(content: string): CountMap {
  return countMarkers(content, ORAL_MARKERS);
}

export function topRepeatedPhrases(content: string): PhraseCount[] {
  const normalized = content.replace(/[^\u4e00-\u9fffA-Za-z0-9]/g, "");
  const counts = new Map<string, number>();

  for (let size = 2; size <= 6; size += 1) {
    for (let index = 0; index <= normalized.length - size; index += 1) {
      const phrase = normalized.slice(index, index + size);
      if (/^\d+$/.test(phrase)) continue;
      if (/^(这个|那个|我们|你们|他们|以及|因为|所以)$/.test(phrase)) continue;
      counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .slice(0, 20)
    .map(([phrase, count]) => ({ phrase, count }));
}
