"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/app/actions/auth";
import { btnPrimary, inputClass, Seal } from "./ui";

const COPY = {
  login: {
    eyebrow: "Welcome back",
    title: "歡迎回來",
    desc: "登入後即可上傳合約、查看你的審查紀錄。",
    submit: "登入",
    pending: "登入中…",
    switchText: "還沒有帳號？",
    switchLink: "/signup",
    switchLabel: "免費註冊",
  },
  signup: {
    eyebrow: "Create account",
    title: "建立你的帳號",
    desc: "只需要 Email 與密碼，馬上開始審查第一份合約。",
    submit: "建立帳號",
    pending: "建立中…",
    switchText: "已經有帳號了？",
    switchLink: "/login",
    switchLabel: "登入",
  },
} as const;

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, pending] = useActionState(mode === "login" ? login : signup, undefined);
  const copy = COPY[mode];

  return (
    <div className="paper-grain flex flex-1 items-center justify-center px-5 py-16 sm:py-24">
      <div className="w-full max-w-md animate-rise rounded-3xl border border-line bg-surface p-8 shadow-[0_30px_60px_-35px_rgb(27_26_23/0.35)] sm:p-10">
        <Seal className="size-11 -rotate-6 text-xl" />
        <p className="mt-8 text-xs tracking-[0.25em] text-seal uppercase">{copy.eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold">{copy.title}</h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{copy.desc}</p>

        <form action={action} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              defaultValue={state?.email}
              className={`${inputClass} font-normal`}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            密碼
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder={mode === "signup" ? "至少 8 個字元" : "••••••••"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className={`${inputClass} font-normal`}
            />
          </label>

          {state?.error && (
            <p className="rounded-xl border border-risk-high/30 bg-risk-high-soft px-4 py-3 text-sm text-risk-high">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className={`${btnPrimary} mt-2 w-full py-3.5`}>
            {pending ? copy.pending : copy.submit}
          </button>
        </form>

        <p className="mt-8 border-t border-line pt-6 text-center text-sm text-ink-soft">
          {copy.switchText}
          <Link href={copy.switchLink} className="ml-1 font-medium text-ink underline decoration-seal/40 underline-offset-4 hover:text-seal">
            {copy.switchLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
