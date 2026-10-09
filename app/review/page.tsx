import type { Metadata } from "next";
import ContractChecker from "../components/ContractChecker";

export const metadata: Metadata = { title: "審查合約｜AI 合約審查器" };

export default function ReviewPage() {
  return <ContractChecker />;
}
