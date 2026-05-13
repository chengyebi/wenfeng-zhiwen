import { PageShell } from "@/components/PageShell";
import { ENGINE_VERSION } from "@/lib/style-engine/constants";
import type { StyleProfile } from "@/lib/style-engine/types";
import { createClient } from "@/lib/supabase/server";

function top(map: Record<string, number>) {
  return Object.entries(map)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("style_profiles")
    .select("*")
    .eq("user_id", user!.id)
    .eq("engine_version", ENGINE_VERSION)
    .maybeSingle();

  if (!data) {
    return (
      <PageShell>
        <div className="card">
          <h1 className="text-3xl font-black">文风画像</h1>
          <p className="mt-3 text-slate-600">还没有画像。请先添加文本样本。</p>
        </div>
      </PageShell>
    );
  }

  const profile = data.profile_json as StyleProfile;

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black">文风画像</h1>
        <p className="mt-2 text-slate-600">同一批文本在 {ENGINE_VERSION} 下会生成相同画像。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric">
          <p className="text-sm text-slate-500">样本数量</p>
          <p className="mt-2 text-3xl font-black">{profile.sampleCount}</p>
        </div>
        <div className="metric">
          <p className="text-sm text-slate-500">总字数</p>
          <p className="mt-2 text-3xl font-black">{profile.totalCharCount}</p>
        </div>
        <div className="metric">
          <p className="text-sm text-slate-500">画像可信度</p>
          <p className="mt-2 text-xl font-bold">{profile.reliabilityLevel}</p>
        </div>
      </div>
      <section className="card mt-6">
        <h2 className="mb-3 text-xl font-bold">规则说明</h2>
        <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{data.summary_text}</pre>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">句长与段落习惯</h2>
          <div className="grid gap-3 text-sm text-slate-700">
            <p>平均句长：{profile.avgSentenceLength}</p>
            <p>短句比例：{Math.round(profile.shortSentenceRatio * 100)}%</p>
            <p>中句比例：{Math.round(profile.mediumSentenceRatio * 100)}%</p>
            <p>长句比例：{Math.round(profile.longSentenceRatio * 100)}%</p>
            <p>平均段落长度：{profile.structureStats.avgParagraphLength}</p>
            <p>单句成段比例：{Math.round(profile.structureStats.oneSentenceParagraphRatio * 100)}%</p>
          </div>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">标点偏好</h2>
          <div className="flex flex-wrap gap-2">
            {top(profile.punctuationStats).map(([key, value]) => (
              <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {key} {value}
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">常用连接词</h2>
          <div className="flex flex-wrap gap-2">
            {top(profile.connectorStats).map(([key, value]) => (
              <span key={key} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                {key} {value}
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">高频表达</h2>
          <div className="flex flex-wrap gap-2">
            {profile.topRepeatedPhrases.map((item) => (
              <span key={item.phrase} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {item.phrase} {item.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
