import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { ENGINE_VERSION } from "@/lib/style-engine/constants";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [{ data: samples }, { data: profile }] = await Promise.all([
    supabase
      .from("writing_samples")
      .select("id,title,category,char_count,created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("style_profiles")
      .select("sample_count,total_char_count,reliability_level")
      .eq("user_id", user!.id)
      .eq("engine_version", ENGINE_VERSION)
      .maybeSingle(),
  ]);

  return (
    <PageShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950">仪表盘</h1>
          <p className="mt-2 text-slate-600">查看你的样本积累和当前画像状态。</p>
        </div>
        <Link href="/samples/new" className="btn-primary">
          添加文本
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric">
          <p className="text-sm text-slate-500">当前样本数量</p>
          <p className="mt-2 text-3xl font-black">{profile?.sample_count ?? 0}</p>
        </div>
        <div className="metric">
          <p className="text-sm text-slate-500">累计字数</p>
          <p className="mt-2 text-3xl font-black">{profile?.total_char_count ?? 0}</p>
        </div>
        <div className="metric">
          <p className="text-sm text-slate-500">画像可信度</p>
          <p className="mt-2 text-xl font-bold">{profile?.reliability_level ?? "暂无画像"}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/samples/new" className="card hover:border-indigo-200">
          添加文本样本
        </Link>
        <Link href="/profile" className="card hover:border-indigo-200">
          查看文风画像
        </Link>
        <Link href="/compare" className="card hover:border-indigo-200">
          新文本对比
        </Link>
      </div>
      <section className="card mt-6">
        <h2 className="mb-4 text-xl font-bold">最近添加</h2>
        <div className="grid gap-3">
          {(samples ?? []).map((sample) => (
            <Link key={sample.id} href={`/samples/${sample.id}`} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
              <p className="font-semibold">{sample.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                {sample.category} · {sample.char_count} 字
              </p>
            </Link>
          ))}
          {!samples?.length ? <p className="text-slate-500">还没有文本样本。</p> : null}
        </div>
      </section>
    </PageShell>
  );
}
