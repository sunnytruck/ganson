import { prisma } from "@/lib/prisma";
import { requireExamineeCookie } from "@/lib/auth";
import { PageTitle } from "@/components/PageTitle";

export default async function ResultPage() {
  const profile = await requireExamineeCookie();
  const examinee = await prisma.examinee.findFirst({
    where: { employeeCode: profile.employeeCode, name: profile.name },
    include: { answers: { include: { question: true }, orderBy: { answeredAt: "desc" } } }
  });

  const total = examinee?.answers.length ?? 0;
  const correct = examinee?.answers.filter((a) => a.isCorrect).length ?? 0;

  return (
    <>
      <PageTitle title="自分の回答結果" subtitle={`${profile.department} ${profile.employeeCode} ${profile.name}`} />
      <div className="mb-3 rounded border bg-white p-4">総問題数: {total} / 正答数: {correct}</div>
      <div className="space-y-2">
        {examinee?.answers.map((ans) => (
          <div key={ans.id} className="rounded border bg-white p-3 text-sm">
            <p className="font-medium">{ans.question.title}</p>
            <p>結果: {ans.isCorrect ? "正解" : "不正解"}</p>
          </div>
        ))}
      </div>
    </>
  );
}
