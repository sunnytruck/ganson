import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { PageTitle } from "@/components/PageTitle";

export default async function AdminEditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const question = await prisma.question.findUnique({ where: { id }, include: { choices: { orderBy: { sortOrder: "asc" } } } });
  if (!question) notFound();

  return (
    <>
      <PageTitle title="問題編集" />
      <form action={`/api/admin/questions/${question.id}`} method="post" className="space-y-3 rounded border bg-white p-4">
        <input type="hidden" name="_method" value="put" />
        <input name="title" defaultValue={question.title} required />
        <textarea name="body" defaultValue={question.body} required />
        <textarea name="explanation" defaultValue={question.explanation} required />
        <input name="sortOrder" type="number" defaultValue={question.sortOrder} required />
        <label className="flex items-center gap-2"><input className="w-auto" type="checkbox" name="isPublished" defaultChecked={question.isPublished} />公開する</label>
        {question.choices.map((c, i) => (
          <div key={c.id} className="rounded border p-2">
            <input type="hidden" name={`choiceId${i + 1}`} value={c.id} />
            <input name={`choiceLabel${i + 1}`} defaultValue={c.label} required />
            <label className="mt-1 flex items-center gap-2 text-sm"><input className="w-auto" type="radio" name="correctIndex" value={String(i + 1)} defaultChecked={c.isCorrect} required />正解にする</label>
          </div>
        ))}
        <div className="flex gap-3">
          <button type="submit">更新</button>
          <button formAction={`/api/admin/questions/${question.id}`} name="_method" value="delete" className="bg-rose-600 hover:bg-rose-700">削除</button>
        </div>
      </form>
    </>
  );
}
