import Link from "next/link";
import { PageTitle } from "@/components/PageTitle";

export default function CompletePage() {
  return (
    <>
      <PageTitle title="回答を保存しました" />
      <div className="space-y-3 rounded border bg-white p-4">
        <p>回答ありがとうございました。</p>
        <Link href="/questions" className="text-blue-700 underline">問題一覧へ戻る</Link>
        <br />
        <Link href="/results" className="text-blue-700 underline">自分の結果を見る</Link>
      </div>
    </>
  );
}
