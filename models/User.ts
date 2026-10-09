import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // 只存 bcrypt 雜湊，不存明碼
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

// 熱重載時避免 OverwriteModelError
export const User = models.User || model("User", UserSchema);
