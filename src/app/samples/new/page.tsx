import { addSampleAction } from "@/lib/actions/samples";
import { SAMPLE_CATEGORIES } from "@/lib/style-engine/constants";
import { PageShell } from "@/components/PageShell";

export default async function NewSamplePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black">添加文本样本</h1>
        <p className="mt-2 text-slate-600">请添加你真实写过的文本，保存后会自动生成确定性特征。</p>
      </div>
      {params.error ? <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{params.error}</p> : null}
      <form action={addSampleAction} className="card grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">标题</span>
          <input className="input" name="title" required placeholder="例如：课程报告引言、一次技术复盘" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">分类</span>
          <select className="input" name="category" required defaultValue="其他">
            {SAMPLE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">正文</span>
          <textarea className="input min-h-72" name="content" required placeholder="粘贴你真实写过的文本。" />
        </label>
        <button className="btn-primary" type="submit">
          保存并分析
        </button>
      </form>
    </PageShell>
  );
}
