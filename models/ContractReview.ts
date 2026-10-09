import { Schema, model, models, type InferSchemaType } from "mongoose";

const RiskSchema = new Schema(
  {
    clause: String,
    issue: String,
    severity: { type: String, enum: ["low", "medium", "high"] },
    suggestion: String,
  },
  { _id: false },
);

const ContractReviewSchema = new Schema(
  {
    // 上傳者；所有查詢都必須帶這個條件，確保只看得到自己的合約
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    blobUrl: { type: String, required: true },
    blobPathname: { type: String, required: true },
    model: String,
    analysis: {
      summary: String,
      contractType: String,
      parties: [String],
      overallRisk: { type: String, enum: ["low", "medium", "high"] },
      keyTerms: [{ _id: false, title: String, content: String }],
      risks: [RiskSchema],
      missingClauses: [String],
      recommendations: [String],
    },
  },
  { timestamps: true },
);

export type ContractReviewDoc = InferSchemaType<typeof ContractReviewSchema>;

// 熱重載時避免 OverwriteModelError
export const ContractReview =
  models.ContractReview || model("ContractReview", ContractReviewSchema);
