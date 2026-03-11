import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { PageTitle } from "@/components/PageTitle";

export default async function AdminQuestionList() {
  await requireAdminSession();
  const questions = await prisma.question.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <>
      <PageTitle title="問題一覧管理" />
      <div className="mb-4 flex gap-3 text-sm">
        <Link className="text-blue-700 underline" href="/admin/questions/new">新規作成</Link>
        <Link className="text-blue-700 underline" href="/admin/answers">回答結果一覧</Link>
        <Link className="text-blue-700 underline" href="/admin/export">CSV / Excel 出力</Link>
      </div>
      <div className="space-y-2">
        {questions.map((q) => (
          <div key={q.id} className="rounded border bg-white p-3">
            <p className="font-medium">{q.title}</p>
            <p className="text-sm">公開: {q.isPublished ? "公開中" : "非公開"}</p>
            <Link href={`/admin/questions/${q.id}/edit`} className="text-sm text-blue-700 underline">編集</Link>
          </div>
        ))}
      </div>
    </>
  );
}
