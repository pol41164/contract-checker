import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getReview } from "@/lib/reviews";
import { formatDate, ReviewResult } from "../../components/ReviewResult";
import { Eyebrow } from "../../components/ui";

export const metadata: Metadata = { title: "審查報告｜AI 合約審查器" };

export default function ReviewDetailPage({ params }: PageProps<"/history/[id]">) {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <Link href="/history" className="text-sm text-ink-soft transition hover:text-seal">
        ← 返回歷史紀錄
      </Link>
      <Suspense fallback={<DetailSkeleton />}>
        {params.then(({ id }) => (
          <Detail id={id} />
        ))}
      </Suspense>
    </div>
  );
}

async function Detail({ id }: { id: string }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // 找不到或不是自己的紀錄都回 404，不透露紀錄是否存在
  const review = await getReview(user.id, id);
  if (!review) notFound();

  return (
    <div className="animate-rise">
      <div className="mt-8 mb-12">
        <Eyebrow>Review Report</Eyebrow>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight break-all sm:text-4xl">{review.fileName}</h1>
        <p className="mt-3 font-mono text-sm text-ink-faint">審查時間　{formatDate(review.createdAt, true)}</p>
      </div>
      <ReviewResult review={review} />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-8 space-y-6">
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-sunken" />
      <div className="h-72 animate-pulse rounded-3xl bg-sunken" />
    </div>
  );
}
