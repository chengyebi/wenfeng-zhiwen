import type { CountMap, TextFeatures } from "@/lib/style-engine/types";

function entries(map: CountMap) {
  return Object.entries(map).filter(([, value]) => value > 0);
}

function StatList({ title, data }: { title: string; data: CountMap }) {
  const rows = entries(data);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-3 font-semibold text-slate-950">{title}</h3>
      {rows.length ? (
        <div className="flex flex-wrap gap-2">
          {rows.map(([key, value]) => (
            <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {key} {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">暂无明显特征</p>
      )}
    </div>
  );
}

export function FeatureTable({ features }: { features: TextFeatures }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric">
          <p className="text-sm text-slate-500">字数</p>
          <p className="mt-2 text-2xl font-bold">{features.charCount}</p>
        </div>
        <div className="metric">
          <p className="text-sm text-slate-500">句子数</p>
          <p className="mt-2 text-2xl font-bold">{features.sentenceCount}</p>
        </div>
        <div className="metric">
          <p className="text-sm text-slate-500">平均句长</p>
          <p className="mt-2 text-2xl font-bold">{features.avgSentenceLength}</p>
        </div>
        <div className="metric">
          <p className="text-sm text-slate-500">段落数</p>
          <p className="mt-2 text-2xl font-bold">{features.paragraphCount}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StatList title="标点使用情况" data={features.punctuationStats} />
        <StatList title="高频连接词" data={features.connectorStats} />
        <StatList title="不确定性词" data={features.hedgeWordStats} />
        <StatList title="断言词" data={features.assertiveWordStats} />
        <StatList title="口语标记" data={features.oralMarkerStats} />
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-3 font-semibold text-slate-950">高频短语</h3>
          <div className="flex flex-wrap gap-2">
            {features.topRepeatedPhrases.length ? (
              features.topRepeatedPhrases.map((item) => (
                <span key={item.phrase} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                  {item.phrase} {item.count}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">暂无重复短语</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
