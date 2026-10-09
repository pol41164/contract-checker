import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// 開發模式熱重載時重複使用同一條連線，避免連線數爆掉
const globalForMongoose = globalThis as unknown as {
  mongooseConn?: Promise<typeof mongoose>;
};

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("缺少環境變數 MONGODB_URI");
  }
  if (!globalForMongoose.mongooseConn) {
    globalForMongoose.mongooseConn = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .catch((err) => {
        globalForMongoose.mongooseConn = undefined;
        throw err;
      });
  }
  return globalForMongoose.mongooseConn;
}
