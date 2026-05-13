import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { createClient } from "@/lib/supabase/server";

export default async function SamplesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: samples } = await supabase
    .from("writing_samples")
    .select("id,title,category,char_count,created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <PageShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">文本样本</h1>
          <p className="mt-2 text-slate-600">管理你主动提交的真实文本。</p>
        </div>
        <Link className="btn-primary" href="/samples/new">
          添加文本
        </Link>
      </div>
      <div className="card grid gap-3">
        {(samples ?? []).map((sample) => (
          <Link key={sample.id} href={`/samples/${sample.id}`} className="grid gap-2 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-semibold text-slate-950">{sample.title}</p>
              <p className="text-sm text-slate-500">{sample.category}</p>
            </div>
            <p className="text-sm text-slate-500">
              {sample.char_count} 字 · {new Date(sample.created_at).toLocaleString("zh-CN")}
            </p>
          </Link>
        ))}
        {!samples?.length ? <p className="text-slate-500">还没有样本，先添加一段你真实写过的文本。</p> : null}
      </div>
    </PageShell>
  );
}
