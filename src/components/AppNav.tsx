import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";

const links = [
  ["仪表盘", "/dashboard"],
  ["文本样本", "/samples"],
  ["文风画像", "/profile"],
  ["新文本对比", "/compare"],
  ["隐私说明", "/privacy"],
];

export function AppNav() {
  return (
    <aside className="card h-fit">
      <p className="mb-4 text-sm font-semibold text-slate-950">工作台</p>
      <nav className="grid gap-2 text-sm">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950">
            {label}
          </Link>
        ))}
      </nav>
      <form action={signOutAction} className="mt-6">
        <button className="btn-secondary w-full" type="submit">
          退出登录
        </button>
      </form>
    </aside>
  );
}
