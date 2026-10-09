import type OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import mammoth from "mammoth";
import { z } from "zod";
import { openai, OPENAI_MODEL } from "./openai";

export const ContractAnalysisSchema = z.object({
  summary: z.string().describe("合約摘要，3-5 句"),
  contractType: z.string().describe("合約類型，例如租賃、勞動、買賣、NDA"),
  parties: z.array(z.string()).describe("合約當事人"),
  overallRisk: z.enum(["low", "medium", "high"]),
  keyTerms: z
    .array(z.object({ title: z.string(), content: z.string() }))
    .describe("重要條款，例如期間、金額、付款、終止條件"),
  risks: z.array(
    z.object({
      clause: z.string().describe("合約原文逐字引述；風險來自缺少條款時為空字串"),
      issue: z.string().describe("風險說明"),
      severity: z.enum(["low", "medium", "high"]),
      suggestion: z.string().describe("修改或協商建議"),
    }),
  ),
  missingClauses: z.array(z.string()).describe("建議補上但合約中缺少的條款"),
  recommendations: z.array(z.string()).describe("整體建議"),
});

export type ContractAnalysis = z.infer<typeof ContractAnalysisSchema>;

export type FileKind = "pdf" | "docx" | "txt";

// 有些瀏覽器不會帶 .docx 的 MIME type，所以也用副檔名判斷
export function getFileKind(file: File): FileKind | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (file.type === "application/pdf" || ext === "pdf") return "pdf";
  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  )
    return "docx";
  if (file.type === "text/plain" || ext === "txt") return "txt";
  return null;
}

// 提示詞裡的欄位名稱要和 ContractAnalysisSchema 一致（risks、clause）
const SYSTEM_PROMPT = `你是一位專業的合約審查律師助理。請仔細閱讀使用者提供的合約，
找出對簽約方不利或模糊的條款、潛在法律風險，並提出具體的修改建議。所有輸出請使用繁體中文。

判斷風險等級的標準：
- high：可能造成重大金錢損失、無上限責任、對方可單方終止、或明顯違反常規的條款
- medium：對我方不利但仍在可談判範圍，或條文模糊可能產生爭議
- low：小瑕疵、用字不精確、建議補強但影響有限

要求：
- clause 欄位必須是合約的原文直接引述，一個字都不能改寫。如果某個風險來自「合約缺少某條款」而非既有條文，clause 就留空字串。
- 不要為了湊數而列出無關痛癢的問題；沒有明顯風險時 risks 可以是空陣列。
- suggestion 要具體可執行，例如「加註違約金上限為合約總價 20%」，而不是「建議再確認」。
- 如果文件內容看起來根本不是合約，在 summary 說明這件事，並把 risks 留空。`;

export async function analyzeContract(
  file: File,
  kind: FileKind,
): Promise<ContractAnalysis> {
  const buffer = Buffer.from(await file.arrayBuffer());

  // PDF 直接交給 OpenAI 讀取；Word / 純文字先轉成文字
  let content: OpenAI.Responses.ResponseInputContent[];
  if (kind === "pdf") {
    content = [
      {
        type: "input_file",
        filename: file.name,
        file_data: `data:application/pdf;base64,${buffer.toString("base64")}`,
      },
      { type: "input_text", text: "請審查這份合約。" },
    ];
  } else {
    const text =
      kind === "docx"
        ? (await mammoth.extractRawText({ buffer })).value
        : buffer.toString("utf8");
    if (!text.trim()) throw new Error("無法從檔案中讀取到文字");
    content = [{ type: "input_text", text: `請審查這份合約：\n\n${text}` }];
  }

  const response = await openai.responses.parse({
    model: OPENAI_MODEL,
    instructions: SYSTEM_PROMPT,
    input: [{ role: "user", content }],
    text: { format: zodTextFormat(ContractAnalysisSchema, "contract_analysis") },
  });

  if (!response.output_parsed) throw new Error("AI 沒有回傳有效的分析結果");
  return response.output_parsed;
}
