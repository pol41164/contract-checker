import Link from "next/link";
import { Logo } from "./ui";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-sunken/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-ink-soft">
            簽名之前，先看清每一條。讓 AI 逐條閱讀你的合約，找出風險、引述原文、給出具體修改建議。
          </p>
        </div>
        <div>
          <h3 className="text-xs font-medium tracking-[0.2em] text-ink-faint">產品</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li><Link href="/#how" className="hover:text-ink">運作方式</Link></li>
            <li><Link href="/#features" className="hover:text-ink">功能特色</Link></li>
            <li><Link href="/#faq" className="hover:text-ink">常見問題</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-medium tracking-[0.2em] text-ink-faint">帳戶</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li><Link href="/review" className="hover:text-ink">審查合約</Link></li>
            <li><Link href="/history" className="hover:text-ink">歷史紀錄</Link></li>
            <li><Link href="/signup" className="hover:text-ink">註冊會員</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-6xl px-5 py-6 text-xs leading-5 text-ink-faint sm:px-8">
          AI 審查結果僅供參考，不構成法律意見；涉及重大權益的合約，請諮詢專業律師。
        </p>
      </div>
    </footer>
  );
}
