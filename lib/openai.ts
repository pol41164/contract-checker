import "server-only";
import OpenAI from "openai";

// 自動讀取環境變數 OPENAI_API_KEY
export const openai = new OpenAI();

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
