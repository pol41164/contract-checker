import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import { getSession } from "./session";
import { User } from "@/models/User";

export type CurrentUser = { id: string; email: string };

// 讀 cookie 並確認會員還存在；未登入回傳 null
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session || !isValidObjectId(session.userId)) return null;

  await connectDB();
  const user = await User.findById(session.userId).select("email").lean<{
    _id: unknown;
    email: string;
  }>();
  if (!user) return null;

  return { id: String(user._id), email: user.email };
}
