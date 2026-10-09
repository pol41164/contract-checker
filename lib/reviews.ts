import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import { ContractReview } from "@/models/ContractReview";
import type { HistoryItem, Review } from "@/app/components/ReviewResult";

// 審查紀錄的資料存取層：每個查詢都必須帶 userId，只能拿到自己的紀錄

const LIST_FIELDS = "fileName blobUrl analysis.overallRisk analysis.contractType createdAt";

// ObjectId、Date 轉成純字串，才能交給前端元件
function toPlain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function listReviews(userId: string, limit?: number): Promise<HistoryItem[]> {
  await connectDB();
  const query = ContractReview.find({ user: userId }).sort({ createdAt: -1 }).select(LIST_FIELDS);
  if (limit) query.limit(limit);
  return toPlain(await query.lean());
}

export async function getReview(userId: string, id: string): Promise<Review | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const review = await ContractReview.findOne({ _id: id, user: userId }).select("-user").lean();
  return review ? toPlain(review) : null;
}
