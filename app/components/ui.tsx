import Link from "next/link";

// 全站共用的小元件與樣式

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-seal disabled:pointer-events-none disabled:opacity-40";
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-ink transition hover:border-ink";
export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition placeholder:text-ink-faint focus:border-ink focus:ring-4 focus:ring-ink/5";

/** 朱砂方印 */
export function Seal({ char = "審", className = "" }: { char?: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-grid place-items-center rounded-[6px] bg-seal font-serif font-black leading-none text-paper shadow-[inset_0_0_0_2px_var(--seal),inset_0_0_0_3.5px_var(--paper)] ${className}`}
    >
      {char}
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <Seal className="size-8 text-[17px] transition group-hover:-rotate-6" />
      <span className="font-serif text-[17px] font-bold tracking-wide">AI 合約審查器</span>
    </Link>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-seal uppercase">
      <span className="h-px w-8 bg-seal" />
      {children}
    </p>
  );
}

export function PageHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="animate-rise">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight sm:text-[2.75rem]">{title}</h1>
      {desc && <p className="mt-3 max-w-xl leading-7 text-ink-soft">{desc}</p>}
    </div>
  );
}
