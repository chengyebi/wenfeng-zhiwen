export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <section className="card">
        <h1 className="text-3xl font-black">隐私与安全说明</h1>
        <div className="mt-6 grid gap-4 leading-8 text-slate-700">
          <p>系统只分析用户主动提交的文本。</p>
          <p>本项目不调用 AI，不把文本发送给 OpenAI、Claude 或任何大模型服务。</p>
          <p>用户可以删除自己的文本，删除后会重新生成当前画像。</p>
          <p>数据库启用 Row Level Security，用户只能访问自己的数据。</p>
          <p>建议不要上传身份证号、病历、密码、隐私聊天等高度敏感信息。</p>
          <p>新文本对比默认不保存输入内容，只在当前请求中计算相似度。</p>
        </div>
      </section>
    </main>
  );
}
