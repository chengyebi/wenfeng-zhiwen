import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "文风指纹",
  description: "稳定、可解释的个人语言习惯分析器",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="font-bold text-slate-950">
              文风指纹
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-950">
                隐私与安全
              </Link>
              <Link href="/login" className="hover:text-slate-950">
                登录/注册
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
