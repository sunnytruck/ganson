import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { PageTitle } from "@/components/PageTitle";

export default async function AdminAnswersPage() {
  await requireAdminSession();
  const answers = await prisma.answer.findMany({
    include: { examinee: true, question: true },
    orderBy: { answeredAt: "desc" },
    take: 200
  });

  return (
    <>
      <PageTitle title="回答結果一覧" />
      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100"><tr><th>所属</th><th>社員番号</th><th>名前</th><th>問題</th><th>正誤</th></tr></thead>
          <tbody>
            {answers.map((a) => (
              <tr key={a.id} className="border-t"><td>{a.examinee.department}</td><td>{a.examinee.employeeCode}</td><td>{a.examinee.name}</td><td>{a.question.title}</td><td>{a.isCorrect ? "正" : "誤"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
