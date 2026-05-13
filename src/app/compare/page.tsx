import { CompareForm } from "@/components/CompareForm";
import { PageShell } from "@/components/PageShell";
import { ENGINE_VERSION } from "@/lib/style-engine/constants";
import { createClient } from "@/lib/supabase/server";

export default async function ComparePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("style_profiles")
    .select("total_char_count")
    .eq("user_id", user!.id)
    .eq("engine_version", ENGINE_VERSION)
    .maybeSingle();

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black">新文本对比</h1>
        <p className="mt-2 text-slate-600">输入一段新文本，系统用确定性特征与当前画像对比，不保存对比文本。</p>
      </div>
      <CompareForm unstable={!data || data.total_char_count < 500} />
    </PageShell>
  );
}
