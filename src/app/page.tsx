import Link from "next/link";

const abilities = ["积累自己的真实文本样本", "生成稳定可复现的文风画像", "查看句长、标点、连接词、语气词等指标", "输入新文本，判断是否接近本人历史风格"];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <section className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-4 text-sm font-semibold text-indigo-600">不调用 AI 的个人语言习惯分析器</p>
          <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-7xl">文风指纹</h1>
          <p className="mt-5 text-2xl font-semibold text-slate-700">稳定、可解释的个人语言习惯分析器</p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            持续添加你真实写过的文本，系统会用确定性统计规则分析句长、标点、连接词、语气词和段落习惯，生成可复现的个人文风画像。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-primary">
              开始使用
            </Link>
            <Link href="/login" className="btn-secondary">
              登录/注册
            </Link>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold text-slate-950">产品边界</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-700">
            <p>不调用 AI，不调用大模型 API。</p>
            <p>不做 AI 代写，不做改写降重。</p>
            <p>不提供规避 AI 检测能力。</p>
            <p>所有分析来自确定性规则和统计特征。</p>
          </div>
        </div>
      </section>
      <section className="mt-14 grid gap-4 md:grid-cols-4">
        {abilities.map((item) => (
          <div key={item} className="card">
            <p className="font-semibold text-slate-900">{item}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
