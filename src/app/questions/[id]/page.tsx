import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireExamineeCookie } from "@/lib/auth";
import { PageTitle } from "@/components/PageTitle";

export default async function QuestionAnswerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireExamineeCookie();
  const { id } = await params;
  const question = await prisma.question.findFirst({ where: { id, isPublished: true }, include: { choices: { orderBy: { sortOrder: "asc" } } } });
  if (!question) notFound();

  return (
    <>
      <PageTitle title={question.title} subtitle={question.body} />
      <form action="/api/answers" method="post" className="space-y-3 rounded border bg-white p-4">
        <input type="hidden" name="questionId" value={question.id} />
        {question.choices.map((choice) => (
          <label key={choice.id} className="flex items-center gap-2 rounded border p-2">
            <input type="radio" name="choiceId" value={choice.id} required className="w-auto" />
            <span>{choice.label}</span>
          </label>
        ))}
        <button type="submit">回答を送信</button>
      </form>
    </>
  );
}
