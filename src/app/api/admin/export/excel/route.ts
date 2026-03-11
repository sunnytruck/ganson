import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/export";

export async function GET() {
  const answers = await prisma.answer.findMany({ include: { examinee: true, question: true }, orderBy: { answeredAt: "desc" } });

  const detailRows = answers.map((a) => ({
    所属部署: a.examinee.department,
    社員番号: a.examinee.employeeCode,
    名前: a.examinee.name,
    問題ID: a.questionId,
    問題タイトル: a.question.title,
    問題文: a.question.body,
    選択した回答: a.selectedChoice,
    正誤: a.isCorrect ? "正解" : "不正解",
    回答日時: formatDate(a.answeredAt)
  }));

  const aggregateMap = new Map<string, { 所属部署: string; 社員番号: string; 名前: string; 総問題数: number; 正答数: number }>();
  for (const a of answers) {
    const key = `${a.examinee.employeeCode}-${a.examinee.name}`;
    const current = aggregateMap.get(key) ?? { 所属部署: a.examinee.department, 社員番号: a.examinee.employeeCode, 名前: a.examinee.name, 総問題数: 0, 正答数: 0 };
    current.総問題数 += 1;
    if (a.isCorrect) current.正答数 += 1;
    aggregateMap.set(key, current);
  }

  const aggregateRows = Array.from(aggregateMap.values()).map((row) => ({ ...row, 正答率: row.総問題数 === 0 ? "0%" : `${Math.round((row.正答数 / row.総問題数) * 100)}%` }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(detailRows), "回答詳細");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(aggregateRows), "回答者集計");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="answers.xlsx"'
    }
  });
}
