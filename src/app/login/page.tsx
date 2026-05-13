import { signInAction, signUpAction } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-5xl items-center gap-8 px-5 py-10 md:grid-cols-2">
      <section>
        <p className="text-sm font-semibold text-indigo-600">文风指纹</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">登录或注册</h1>
        <p className="mt-4 leading-7 text-slate-600">
          使用 Supabase Auth 邮箱密码登录。系统只保存你主动提交的文本和规则分析结果。
        </p>
        {params.error ? <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{params.error}</p> : null}
      </section>
      <section className="grid gap-5">
        <form action={signInAction} className="card grid gap-4">
          <h2 className="text-xl font-bold">登录</h2>
          <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
          <input className="input" name="email" type="email" placeholder="邮箱" required />
          <input className="input" name="password" type="password" placeholder="密码" required minLength={6} />
          <button className="btn-primary" type="submit">
            登录
          </button>
        </form>
        <form action={signUpAction} className="card grid gap-4">
          <h2 className="text-xl font-bold">注册</h2>
          <input className="input" name="email" type="email" placeholder="邮箱" required />
          <input className="input" name="password" type="password" placeholder="密码，至少 6 位" required minLength={6} />
          <button className="btn-secondary" type="submit">
            创建账号
          </button>
        </form>
      </section>
    </main>
  );
}
