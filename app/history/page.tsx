import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { listReviews } from "@/lib/reviews";
import { HistoryList } from "../components/ReviewResult";
import { btnPrimary, PageHeading, Seal } from "../components/ui";

export const metadata: Metadata = { title: "歷史紀錄｜AI 合約審查器" };

export default function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeading eyebrow="History" title="歷史紀錄" desc="點選任一筆紀錄，查看完整的 AI 審查報告。" />
        <Link href="/review" className={`${btnPrimary} shrink-0 self-start sm:self-auto`}>
          ＋ 審查新合約
        </Link>
      </div>
      <div className="mt-12 animate-rise [animation-delay:100ms]">
        <Suspense fallback={<ListSkeleton />}>
          <Reviews />
        </Suspense>
      </div>
    </div>
  );
}

async function Reviews() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reviews = await listReviews(user.id);
  if (reviews.length === 0) {
    return (
      <div className="paper-grain rounded-3xl border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
        <Seal className="mx-auto size-12 -rotate-6 text-xl opacity-80" />
        <p className="mt-6 font-serif text-xl font-bold">還沒有任何審查紀錄</p>
        <p className="mt-2 text-ink-soft">上傳第一份合約，報告會保存在這裡。</p>
        <Link href="/review" className={`${btnPrimary} mt-8`}>
          開始審查 →
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="border-b border-line pb-4 text-sm text-ink-faint">共 {reviews.length} 份報告</p>
      <HistoryList items={reviews} />
    </>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-px">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-[76px] animate-pulse border-b border-line bg-sunken/40" />
      ))}
    </div>
  );
}
