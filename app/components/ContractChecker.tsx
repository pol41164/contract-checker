"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HistoryList, ReviewResult, type HistoryItem, type Review } from "./ReviewResult";
import { btnPrimary, PageHeading } from "./ui";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ACCEPTED = /\.(pdf|docx|txt)$/i;
const LOADING_STEPS = ["正在讀取文件…", "逐條閱讀合約條款…", "比對權利義務是否對等…", "整理風險與修改建議…"];

async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch("/api/contracts");
  return res.ok ? res.json() : [];
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function ContractChecker() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetchHistory().then(setHistory);
  }, []);

  // 等待時輪播進度文字
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 6000);
    return () => clearInterval(timer);
  }, [loading]);

  function pickFile(f: File | undefined) {
    if (!f) return;
    setError("");
    if (!ACCEPTED.test(f.name)) return setError("只支援 PDF、Word (.docx) 或純文字 (.txt) 檔案");
    if (f.size > MAX_FILE_SIZE) return setError("檔案不能超過 4MB");
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setStep(0);
    setError("");
    setReview(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/contracts", { method: "POST", body: formData });
      // 登入過期就回登入頁
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "上傳失敗");
      setReview(data);
      setFile(null);
      setHistory(await fetchHistory());
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <PageHeading
        eyebrow="New Review"
        title="審查一份合約"
        desc="上傳 PDF、Word 或 TXT（4MB 以內），AI 會逐條找出風險、引述原文並提出修改建議。"
      />

      <form onSubmit={handleSubmit} className="mt-10 animate-rise [animation-delay:100ms]">
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files[0]);
          }}
          className={`paper-grain relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-14 text-center transition ${
            dragging ? "border-seal bg-seal-soft/50" : "border-line-strong bg-surface hover:border-ink"
          } ${loading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="sr-only"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          {file ? (
            <>
              <FileIcon ext={file.name.split(".").pop() ?? ""} />
              <p className="mt-4 max-w-full truncate font-medium">{file.name}</p>
              <p className="mt-1 text-sm text-ink-faint">{formatSize(file.size)}・點擊可更換檔案</p>
            </>
          ) : (
            <>
              <div className="grid size-14 place-items-center rounded-2xl border border-line bg-paper">
                <svg viewBox="0 0 24 24" className="size-6 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 16V4m0 0-4 4m4-4 4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                </svg>
              </div>
              <p className="mt-5 font-medium">
                拖放合約到這裡，或<span className="text-seal underline decoration-seal/30 underline-offset-4">選擇檔案</span>
              </p>
              <p className="mt-1.5 text-sm text-ink-faint">PDF・DOCX・TXT，最大 4MB</p>
            </>
          )}
        </label>

        <div className="mt-5 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-ink-faint">審查結果僅供參考，不構成法律意見。</p>
          <button type="submit" disabled={!file || loading} className={`${btnPrimary} sm:min-w-40`}>
            {loading ? "審查中…" : "開始審查"}
          </button>
        </div>
      </form>

      {loading && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface p-6" role="status">
          <div className="flex items-center gap-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-seal opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-seal" />
            </span>
            <p className="font-medium">{LOADING_STEPS[step]}</p>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-sunken">
            <div className="h-full w-2/5 animate-scan rounded-full bg-gradient-to-r from-transparent via-seal to-transparent" />
          </div>
          <p className="mt-3 text-sm text-ink-faint">一般合約約需 10–60 秒，請不要關閉頁面。</p>
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-2xl border border-risk-high/30 bg-risk-high-soft px-5 py-4 text-sm text-risk-high">{error}</p>
      )}

      {review && (
        <div ref={resultRef} className="mt-16 scroll-mt-24 animate-rise">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="text-xs tracking-[0.2em] text-ink-faint">審查完成</p>
              <h2 className="mt-1 font-serif text-2xl font-bold break-all">{review.fileName}</h2>
            </div>
            <Link href={`/history/${review._id}`} className="shrink-0 text-sm text-ink-soft hover:text-seal">
              永久連結 →
            </Link>
          </div>
          <ReviewResult review={review} />
        </div>
      )}

      {history.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between border-b border-line pb-4">
            <h2 className="font-serif text-xl font-bold">最近的審查</h2>
            <Link href="/history" className="text-sm text-ink-soft transition hover:text-seal">
              查看全部 →
            </Link>
          </div>
          <HistoryList items={history} />
        </section>
      )}
    </div>
  );
}

function FileIcon({ ext }: { ext: string }) {
  return (
    <div className="relative h-16 w-13 rounded-lg border border-line-strong bg-paper shadow-sm">
      <div className="absolute top-0 right-0 size-4 rounded-bl-md border-b border-l border-line-strong bg-sunken" />
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-seal px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-paper uppercase">
        {ext}
      </span>
    </div>
  );
}
