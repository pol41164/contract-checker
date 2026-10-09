import Link from "next/link";

// 伺服器元件（歷史頁）和前端元件（審查頁）共用的顯示元件

export type Risk = "low" | "medium" | "high";

export type Review = {
  _id: string;
  fileName: string;
  blobUrl: string;
  createdAt: string;
  analysis: {
    summary: string;
    contractType: string;
    parties: string[];
    overallRisk: Risk;
    keyTerms: { title: string; content: string }[];
    risks: { clause: string; issue: string; severity: Risk; suggestion: string }[];
    missingClauses: string[];
    recommendations: string[];
  };
};

export type HistoryItem = Pick<Review, "_id" | "fileName" | "blobUrl" | "createdAt"> & {
  analysis?: Partial<Pick<Review["analysis"], "overallRisk" | "contractType">>;
};

const RISK = {
  high: { label: "高風險", text: "text-risk-high", bg: "bg-risk-high-soft", bar: "bg-risk-high", order: 0 },
  medium: { label: "中風險", text: "text-risk-medium", bg: "bg-risk-medium-soft", bar: "bg-risk-medium", order: 1 },
  low: { label: "低風險", text: "text-risk-low", bg: "bg-risk-low-soft", bar: "bg-risk-low", order: 2 },
} as const;

// 固定台灣時區，伺服器和瀏覽器顯示才會一致
export function formatDate(value: string, withTime = false) {
  return new Date(value).toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  });
}

export function RiskBadge({ level }: { level: Risk }) {
  const r = RISK[level];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${r.bg} ${r.text}`}>
      <span className={`size-1.5 rounded-full ${r.bar}`} />
      {r.label}
    </span>
  );
}

export function HistoryList({ items }: { items: HistoryItem[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((h) => (
        <li key={h._id}>
          <Link
            href={`/history/${h._id}`}
            className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-5 transition sm:grid-cols-[6.5rem_1fr_auto_auto]"
          >
            <span className="order-3 col-span-2 font-mono text-xs text-ink-faint sm:order-none sm:col-span-1">
              {formatDate(h.createdAt)}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium transition group-hover:text-seal">{h.fileName}</span>
              {h.analysis?.contractType && (
                <span className="mt-0.5 block text-sm text-ink-faint">{h.analysis.contractType}</span>
              )}
            </span>
            {h.analysis?.overallRisk ? <RiskBadge level={h.analysis.overallRisk} /> : <span />}
            <span aria-hidden className="hidden text-ink-faint transition group-hover:translate-x-1 group-hover:text-seal sm:block">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SectionLabel({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h3 className="flex items-baseline gap-3 font-serif text-xl font-bold">
      {children}
      {count !== undefined && <span className="font-sans text-sm font-normal text-ink-faint">{count} 項</span>}
    </h3>
  );
}

export function ReviewResult({ review }: { review: Review }) {
  const a = review.analysis;
  const risks = [...a.risks].sort((x, y) => RISK[x.severity].order - RISK[y.severity].order);
  const counts = (["high", "medium", "low"] as const).map((lv) => ({
    lv,
    n: a.risks.filter((r) => r.severity === lv).length,
  }));
  const overall = RISK[a.overallRisk];

  return (
    <div className="space-y-14">
      {/* 總覽 */}
      <section className="overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="grid gap-8 p-7 sm:p-9 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs tracking-[0.2em] text-ink-faint">合約類型</p>
            <p className="mt-1 font-serif text-2xl font-bold">{a.contractType}</p>
            {a.parties.length > 0 && (
              <p className="mt-3 text-sm text-ink-soft">
                <span className="text-ink-faint">當事人　</span>
                {a.parties.join("、")}
              </p>
            )}
          </div>
          <div className={`flex items-center gap-4 self-start rounded-2xl px-5 py-4 ${overall.bg}`}>
            <span
              className={`grid size-14 -rotate-6 place-items-center rounded-lg border-2 font-serif text-lg leading-tight font-black ${overall.text} border-current`}
            >
              {overall.label.slice(0, 1)}
            </span>
            <div>
              <p className="text-xs text-ink-faint">整體風險</p>
              <p className={`font-serif text-xl font-bold ${overall.text}`}>{overall.label}</p>
            </div>
          </div>
        </div>
        <p className="border-t border-line px-7 py-7 leading-8 text-ink-soft sm:px-9">{a.summary}</p>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-sunken/50 px-7 py-4 sm:px-9">
          <div className="flex flex-wrap gap-5 text-sm">
            {counts.map(({ lv, n }) => (
              <span key={lv} className="flex items-center gap-2 text-ink-soft">
                <span className={`size-2 rounded-full ${RISK[lv].bar}`} />
                {RISK[lv].label}
                <span className="font-mono font-medium text-ink">{n}</span>
              </span>
            ))}
          </div>
          <a
            href={review.blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink-soft transition hover:text-seal"
          >
            查看原始檔案 ↗
          </a>
        </div>
      </section>

      {/* 風險條款 */}
      {risks.length > 0 && (
        <section>
          <SectionLabel count={risks.length}>風險條款</SectionLabel>
          <ol className="mt-6 space-y-4">
            {risks.map((r, i) => (
              <li key={i} className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 pl-8 sm:p-7 sm:pl-9">
                <span className={`absolute inset-y-0 left-0 w-1.5 ${RISK[r.severity].bar}`} />
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[17px] leading-7 font-bold">{r.issue}</p>
                  <RiskBadge level={r.severity} />
                </div>
                {r.clause ? (
                  <blockquote className="mt-4 rounded-xl bg-sunken/70 px-5 py-4 font-serif text-[15px] leading-7 text-ink-soft">
                    「{r.clause}」
                  </blockquote>
                ) : (
                  <p className="mt-4 inline-flex rounded-full border border-dashed border-line-strong px-3 py-1 text-xs text-ink-faint">
                    合約中缺少相關條款
                  </p>
                )}
                <div className="mt-4 flex gap-3 text-[15px] leading-7">
                  <span className="mt-1 shrink-0 self-start rounded-md bg-ink px-2 py-0.5 text-xs leading-5 font-medium text-paper">建議</span>
                  <p>{r.suggestion}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 重要條款 */}
      {a.keyTerms.length > 0 && (
        <section>
          <SectionLabel>重要條款</SectionLabel>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {a.keyTerms.map((t, i) => (
              <div key={i} className="bg-surface p-5 sm:p-6">
                <dt className="text-xs tracking-[0.15em] text-ink-faint">{t.title}</dt>
                <dd className="mt-2 leading-7">{t.content}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="grid gap-14 md:grid-cols-2 md:gap-10">
        <NumberedList title="建議補充的條款" items={a.missingClauses} />
        <NumberedList title="整體建議" items={a.recommendations} />
      </div>
    </div>
  );
}

function NumberedList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      <ol className="mt-6 space-y-4">
        {items.map((m, i) => (
          <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 leading-7 text-ink-soft">
            <span className="font-serif font-bold text-seal">{String(i + 1).padStart(2, "0")}</span>
            {m}
          </li>
        ))}
      </ol>
    </section>
  );
}
