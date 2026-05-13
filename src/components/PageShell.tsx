import { AppNav } from "./AppNav";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-[220px_1fr]">
      <AppNav />
      <section>{children}</section>
    </main>
  );
}
