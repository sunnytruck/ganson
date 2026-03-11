import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDate, toCsv } from "@/lib/export";

export async function GET() {
  const answers = await prisma.answer.findMany({ include: { examinee: true, question: true }, orderBy: { answeredAt: "desc" } });
  const rows = answers.map((a) => ({
    所属部署: a.examinee.department,
    社員番号: a.examinee.employeeCode,
    名前: a.examinee.name,
    問題ID: a.questionId,
    問題タイトル: a.question.title,
    問題文: a.question.body,
    選択した回答: a.selectedChoice,
    正解: a.isCorrect ? a.selectedChoice : "(問題マスタ参照)",
    正誤: a.isCorrect ? "正解" : "不正解",
    回答日時: formatDate(a.answeredAt)
  }));

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="answers.csv"'
    }
  });
}
