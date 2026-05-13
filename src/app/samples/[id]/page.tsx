import { notFound } from "next/navigation";
import { FeatureTable } from "@/components/FeatureTable";
import { PageShell } from "@/components/PageShell";
import { deleteSampleAction } from "@/lib/actions/samples";
import { ENGINE_VERSION } from "@/lib/style-engine/constants";
import type { TextFeatures } from "@/lib/style-engine/types";
import { createClient } from "@/lib/supabase/server";

export default async function SampleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: sample } = await supabase
    .from("writing_samples")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!sample) notFound();

  const { data: feature } = await supabase
    .from("sample_features")
    .select("features_json")
    .eq("sample_id", sample.id)
    .eq("user_id", user!.id)
    .eq("engine_version", ENGINE_VERSION)
    .single();

  return (
    <PageShell>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">{sample.title}</h1>
          <p className="mt-2 text-slate-600">
            {sample.category} · {sample.char_count} 字 · {new Date(sample.created_at).toLocaleString("zh-CN")}
          </p>
        </div>
        <form action={deleteSampleAction}>
          <input type="hidden" name="id" value={sample.id} />
          <button className="btn-secondary" type="submit">
            删除
          </button>
        </form>
      </div>
      <section className="card mb-6">
        <h2 className="mb-4 text-xl font-bold">原文</h2>
        <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{sample.content}</pre>
      </section>
      {feature ? <FeatureTable features={feature.features_json as TextFeatures} /> : null}
    </PageShell>
  );
}
