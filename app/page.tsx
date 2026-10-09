import Link from "next/link";
import { btnPrimary, btnSecondary, Eyebrow, Seal } from "./components/ui";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FormatStrip />
      <HowItWorks />
      <Features />
      <RiskLevels />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ───────────── Hero ───────────── */

function Hero() {
  return (
    <section className="paper-grain relative overflow-hidden border-b border-line">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        <div className="animate-rise">
          <Eyebrow>AI Contract Review</Eyebrow>
          <h1 className="mt-6 font-serif text-[2.6rem] leading-[1.18] font-bold tracking-tight sm:text-6xl sm:leading-[1.12]">
            簽名之前，
            <br />
            先看清<span className="relative whitespace-nowrap text-seal">
              每一條
              <svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none" aria-hidden>
                <path d="M2 8 C 50 2, 120 2, 198 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            。
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-ink-soft">
            上傳租約、勞動契約、合作協議，AI 會逐條閱讀，
            找出對你不利的條款、<strong className="font-medium text-ink">逐字引述原文</strong>，
            並告訴你具體該怎麼改。
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className={btnPrimary}>
              免費開始審查
              <span aria-hidden>→</span>
            </Link>
            <Link href="#how" className={btnSecondary}>
              了解運作方式
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-faint">支援 PDF・Word・TXT ／ 約 30 秒完成</p>
        </div>

        <DocumentPreview />
      </div>
    </section>
  );
}

function DocumentPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:150ms] lg:max-w-none">
      {/* 後面那張紙 */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-2xl border border-line bg-sunken" />

      <div className="relative rounded-2xl border border-line bg-surface p-7 shadow-[0_30px_60px_-30px_rgb(27_26_23/0.35)] sm:p-9">
        <Seal className="absolute -top-5 -right-3 size-16 animate-stamp text-3xl sm:-right-5" />

        <p className="text-xs tracking-[0.2em] text-ink-faint">示意畫面</p>
        <h3 className="mt-2 font-serif text-xl font-bold">房屋租賃契約</h3>

        <div className="mt-6 space-y-3 font-serif text-[15px] leading-7 text-ink-soft">
          <p>第二條　租金每月新台幣 15,000 元，乙方應於每月一日前支付。</p>
          <p>
            第五條　乙方不得提前終止本契約；
            <mark className="rounded-sm bg-risk-high-soft px-0.5 text-ink decoration-risk-high decoration-wavy decoration-1 underline-offset-4 [text-decoration-line:underline]">
              甲方得隨時通知乙方終止本契約。
            </mark>
          </p>
          <div className="space-y-2 pt-1" aria-hidden>
            <div className="h-2 w-full rounded bg-sunken" />
            <div className="h-2 w-4/5 rounded bg-sunken" />
          </div>
        </div>

        {/* AI 標註卡 */}
        <div className="mt-6 rounded-xl border border-line bg-paper p-4 sm:-mr-14 sm:shadow-[0_20px_40px_-20px_rgb(27_26_23/0.3)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-risk-high-soft px-2.5 py-0.5 text-xs font-medium text-risk-high">高風險</span>
            <span className="text-sm font-medium">對方可單方任意終止</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            <span className="font-medium text-ink">建議：</span>
            限定甲方終止事由，並約定至少 60 日前書面通知及搬遷補償。
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-ink-soft">
          <span className="rounded-full bg-risk-medium-soft px-2.5 py-0.5 text-xs font-medium text-risk-medium">中風險</span>
          合約中缺少押金返還期限
        </div>
      </div>
    </div>
  );
}

function FormatStrip() {
  const items = ["PDF 直接解析", "Word (.docx)", "純文字 (.txt)", "繁體中文報告", "紀錄僅本人可見"];
  return (
    <div className="border-b border-line bg-surface">
      <ul className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-6 text-sm text-ink-soft sm:px-8">
        {items.map((t) => (
          <li key={t} className="flex items-center gap-2.5">
            <span className="size-1.5 rotate-45 bg-seal" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── 運作方式 ───────────── */

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: React.ReactNode; desc?: string }) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-[2.6rem]">{title}</h2>
      {desc && <p className="mt-5 text-lg leading-8 text-ink-soft">{desc}</p>}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "上傳合約", desc: "拖放 PDF、Word 或純文字檔。不用整理格式；電子原始檔會比掃描檔更準確。" },
    { n: "02", title: "AI 逐條閱讀", desc: "AI 以律師助理的角度通讀全文，比對每一條款的權利義務是否對你公平。" },
    { n: "03", title: "取得審查報告", desc: "風險條款、原文引述、具體修改建議、缺漏條款，一份報告全部到位。" },
  ];
  return (
    <section id="how" className="scroll-mt-16">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionTitle
          eyebrow="How it works"
          title="三個步驟，把合約看透"
          desc="不需要法律背景，也不用逐字啃條文。你只要上傳，剩下的交給 AI。"
        />
        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="bg-surface p-8 sm:p-10">
              <span className="font-serif text-5xl font-black text-seal/90">{s.n}</span>
              <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 leading-7 text-ink-soft">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── 功能特色 ───────────── */

const ICONS = {
  quote: <path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" />,
  layers: <path d="M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />,
  pen: <path d="m14 4 6 6L9 21H3v-6L14 4Zm-3 3 6 6" />,
  search: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4M8 11h6" />,
  clock: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2" />,
  lock: <path d="M6 10h12v10H6V10Zm2 0V7a4 4 0 1 1 8 0v3m-4 4v2" />,
};

function Features() {
  const features: { icon: keyof typeof ICONS; title: string; desc: string }[] = [
    { icon: "quote", title: "原文逐字引述", desc: "每一個風險都附上合約原文，一字不改，讓你快速定位、拿去談判時有憑有據。" },
    { icon: "layers", title: "三級風險分級", desc: "高、中、低風險一目了然，先處理真正會讓你吃虧的條款。" },
    { icon: "pen", title: "具體修改建議", desc: "不說「建議再確認」這種空話，而是「加註違約金上限為合約總價 20%」。" },
    { icon: "search", title: "缺漏條款提醒", desc: "合約沒寫的往往更危險。AI 會指出押金返還、爭議解決等該有卻沒有的條款。" },
    { icon: "clock", title: "歷史紀錄隨時查", desc: "每一份審查報告都會保存，日後續約、比對新舊版本都方便。" },
    { icon: "lock", title: "紀錄只有你看得到", desc: "審查紀錄綁定你的帳號，其他會員無法查看；密碼經 bcrypt 加密儲存。" },
  ];
  return (
    <section id="features" className="scroll-mt-16 border-y border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionTitle eyebrow="Features" title={<>不只是摘要，<br className="sm:hidden" />是一份能拿去談判的報告</>} />
        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group">
              <div className="grid size-11 place-items-center rounded-xl border border-line bg-paper text-ink transition group-hover:border-seal group-hover:text-seal">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[f.icon]}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 leading-7 text-ink-soft">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 風險分級 ───────────── */

function RiskLevels() {
  const levels = [
    {
      label: "高風險",
      en: "HIGH",
      color: "bg-risk-high",
      desc: "可能造成重大金錢損失、無上限責任、對方可單方終止，或明顯違反常規的條款。",
    },
    {
      label: "中風險",
      en: "MEDIUM",
      color: "bg-risk-medium",
      desc: "對你不利但仍在可談判範圍，或條文模糊、日後可能產生爭議。",
    },
    {
      label: "低風險",
      en: "LOW",
      color: "bg-risk-low",
      desc: "小瑕疵、用字不精確，建議補強但影響有限。",
    },
  ];
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:py-32">
        <div>
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-paper/60 uppercase">
            <span className="h-px w-8 bg-paper/60" />
            Risk Levels
          </p>
          <h2 className="mt-5 font-serif text-3xl leading-tight font-bold sm:text-[2.6rem]">
            標準一致，
            <br />
            判斷才有意義
          </h2>
          <p className="mt-5 leading-8 text-paper/70">
            每一份合約都用同一套準則評估。沒有明顯風險時，AI 不會為了湊數硬找問題。
          </p>
        </div>
        <ul className="divide-y divide-paper/15 border-y border-paper/15">
          {levels.map((l) => (
            <li key={l.en} className="grid grid-cols-[auto_1fr] gap-6 py-7">
              <span className={`mt-2 size-3 rounded-full ${l.color}`} />
              <div>
                <p className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl font-bold">{l.label}</span>
                  <span className="text-xs tracking-[0.2em] text-paper/50">{l.en}</span>
                </p>
                <p className="mt-2 leading-7 text-paper/75">{l.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */

function Faq() {
  const faqs = [
    { q: "支援哪些檔案格式？", a: "支援 PDF、Word（.docx）與純文字（.txt），單檔 4MB 以內。PDF 會直接交給 AI 閱讀，Word 會先轉成文字。" },
    { q: "審查一份合約需要多久？", a: "一般長度的合約大約 10–60 秒，視合約長度而定。" },
    { q: "AI 的審查結果可以取代律師嗎？", a: "不行。AI 審查能幫你快速找出值得注意的地方、準備談判重點，但結果僅供參考，不構成法律意見。涉及重大權益的合約，請諮詢專業律師。" },
    { q: "我的合約會被其他人看到嗎？", a: "審查紀錄綁定你的帳號，網站上只有你本人登入後才看得到；其他會員無法查詢或瀏覽你的紀錄。" },
    { q: "可以審查哪些類型的合約？", a: "租賃、勞動、買賣、委任、保密協議（NDA）、合作協議等常見合約都適用。如果上傳的文件不是合約，AI 也會直接告訴你。" },
  ];
  return (
    <section id="faq" className="scroll-mt-16">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:py-32">
        <SectionTitle eyebrow="FAQ" title="常見問題" />
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition group-open:rotate-45 group-open:border-seal group-open:text-seal">
                  +
                </span>
              </summary>
              <p className="mt-4 pr-12 leading-8 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 結尾 CTA ───────────── */

function FinalCta() {
  return (
    <section className="px-5 pb-24 sm:px-8 lg:pb-32">
      <div className="paper-grain relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-line bg-surface px-6 py-20 text-center sm:px-12">
        <Seal className="mx-auto size-14 -rotate-6 text-2xl" />
        <h2 className="mx-auto mt-8 max-w-2xl font-serif text-3xl leading-snug font-bold sm:text-5xl sm:leading-tight">
          下一份合約，
          <br className="sm:hidden" />
          先讓 AI 讀一遍
        </h2>
        <p className="mx-auto mt-5 max-w-md leading-8 text-ink-soft">註冊只需要 Email 與密碼，馬上就能上傳第一份合約。</p>
        <Link href="/signup" className={`${btnPrimary} mt-10`}>
          免費建立帳號
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
