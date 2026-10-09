import { put } from "@vercel/blob";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { analyzeContract, getFileKind } from "@/lib/analyze";
import { OPENAI_MODEL } from "@/lib/openai";
import { listReviews } from "@/lib/reviews";
import { ContractReview } from "@/models/ContractReview";

// AI 分析可能需要一段時間
export const maxDuration = 60;

// Vercel Function 的 request body 上限約 4.5MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

const unauthorized = () => Response.json({ error: "請先登入" }, { status: 401 });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "請上傳合約檔案" }, { status: 400 });
    }
    const kind = getFileKind(file);
    if (!kind) {
      return Response.json(
        { error: "只支援 PDF、Word (.docx) 或純文字 (.txt) 檔案" },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "檔案不能超過 4MB" }, { status: 400 });
    }

    // 先跑 AI 分析，成功後才存檔，避免留下沒用的檔案
    const analysis = await analyzeContract(file, kind);

    const blob = await put(`contracts/${user.id}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });

    await connectDB();
    const review = await ContractReview.create({
      user: user.id,
      fileName: file.name,
      fileType: kind,
      fileSize: file.size,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      model: OPENAI_MODEL,
      analysis,
    });

    return Response.json(review, { status: 201 });
  } catch (err) {
    console.error("合約審查失敗:", err);
    const message = err instanceof Error ? err.message : "未知錯誤";
    return Response.json({ error: `合約審查失敗：${message}` }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  // 首頁只顯示最近 5 筆，完整列表在 /history
  return Response.json(await listReviews(user.id, 5));
}
