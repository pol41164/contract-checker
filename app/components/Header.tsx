import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "./ui";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />
        {/* 讀 cookie 的部分放在 Suspense 裡，其餘部分可以先顯示 */}
        <Suspense fallback={<div className="h-9 w-40 animate-pulse rounded-full bg-sunken" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}

const navLink = "rounded-full px-3 py-1.5 text-ink-soft transition hover:bg-sunken hover:text-ink";

async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <nav className="flex items-center gap-1 text-sm sm:gap-2">
        <Link href="/#how" className={`${navLink} hidden sm:block`}>
          運作方式
        </Link>
        <Link href="/#faq" className={`${navLink} hidden sm:block`}>
          常見問題
        </Link>
        <Link href="/login" className={navLink}>
          登入
        </Link>
        <Link
          href="/signup"
          className="ml-1 rounded-full bg-ink px-4 py-2 font-medium text-paper transition hover:bg-seal"
        >
          免費開始
        </Link>
      </nav>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-1 text-sm sm:gap-2">
      <Link href="/review" className={navLink}>
        審查合約
      </Link>
      <Link href="/history" className={navLink}>
        歷史紀錄
      </Link>
      <span className="mx-2 hidden h-5 w-px bg-line-strong md:block" />
      <span className="hidden max-w-48 truncate text-ink-faint md:inline">{user.email}</span>
      <form action={logout}>
        <button type="submit" className={`${navLink} shrink-0`}>
          登出
        </button>
      </form>
    </div>
  );
}
