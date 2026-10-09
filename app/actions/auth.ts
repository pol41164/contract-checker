"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { User } from "@/models/User";

export type AuthState = { error?: string; email?: string } | undefined;

const CredentialsSchema = z.object({
  email: z.email("請輸入有效的 Email").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "密碼至少需要 8 個字元")
    .max(72, "密碼不能超過 72 個字元"), // bcrypt 只看前 72 bytes
});

function parseCredentials(formData: FormData) {
  return CredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

export async function signup(_state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = parseCredentials(formData);
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0].message, email };

  await connectDB();
  if (await User.exists({ email: parsed.data.email })) {
    return { error: "這個 Email 已經註冊過了", email };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  let userId: string;
  try {
    const user = await User.create({ email: parsed.data.email, passwordHash });
    userId = String(user._id);
  } catch (err) {
    // 兩個請求同時註冊同一個 Email 時，由 unique index 擋下
    if ((err as { code?: number }).code === 11000) {
      return { error: "這個 Email 已經註冊過了", email };
    }
    throw err;
  }

  await createSession(userId);
  redirect("/review");
}

export async function login(_state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = parseCredentials(formData);
  const email = String(formData.get("email") ?? "");
  // 不透露是 Email 還是密碼錯，避免被拿來探測帳號
  const invalid = { error: "Email 或密碼錯誤", email };
  if (!parsed.success) return invalid;

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email })
    .select("passwordHash")
    .lean<{ _id: unknown; passwordHash: string }>();
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return invalid;
  }

  await createSession(String(user._id));
  redirect("/review");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
