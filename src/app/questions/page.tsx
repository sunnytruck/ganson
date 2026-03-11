import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireExamineeCookie } from "@/lib/auth";
import { PageTitle } from "@/components/PageTitle";

export default async function QuestionList() {
  await requireExamineeCookie();
  const questions = await prisma.question.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageTitle title="問題一覧" />
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="rounded border bg-white p-4">
            <p className="font-medium">{q.title}</p>
            <Link href={`/questions/${q.id}`} className="mt-2 inline-block text-blue-700 underline">回答する</Link>
          </div>
        ))}
      </div>
    </>
  );
}
