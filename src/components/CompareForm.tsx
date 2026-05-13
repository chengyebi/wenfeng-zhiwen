"use client";

import { useState, useTransition } from "react";
import { compareAction } from "@/lib/actions/compare";
import type { CompareResult } from "@/lib/style-engine/types";

export function CompareForm({ unstable }: { unstable: boolean }) {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError("");
    setResult(null);
    startTransition(async () => {
      const response = await compareAction(content);
      if ("error" in response) {
        setError(response.error);
      } else {
        setResult(response);
      }
    });
  };

  return (
    <div className="grid gap-5">
      {unstable ? (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">样本过少，相似度结果不稳定。</p>
      ) : null}
      <textarea
        className="input min-h-64"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="输入一段新文本。系统只在当前请求中分析，不保存这段对比文本。"
      />
      <button className="btn-primary w-fit" type="button" disabled={pending || !content.trim()} onClick={submit}>
        {pending ? "分析中..." : "开始对比"}
      </button>
      {error ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {result ? (
        <section className="card">
          <p className="text-sm text-slate-500">相似度分数</p>
          <p className="mt-2 text-5xl font-black text-slate-950">{result.score}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-bold text-emerald-700">接近本人风格的地方</h3>
              <ul className="list-inside list-disc text-sm leading-7 text-slate-700">
                {result.matchedTraits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-bold text-rose-700">不像本人风格的地方</h3>
              <ul className="list-inside list-disc text-sm leading-7 text-slate-700">
                {result.differentTraits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {Object.entries(result.metricDiffs).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">{key}</p>
                <p className="mt-1 text-lg font-bold">{value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
