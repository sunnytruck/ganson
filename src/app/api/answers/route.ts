import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getExamineeCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const profile = await getExamineeCookie();
  if (!profile) return NextResponse.redirect(new URL("/", request.url));

  const formData = await request.formData();
  const questionId = String(formData.get("questionId") ?? "");
  const choiceId = String(formData.get("choiceId") ?? "");

  const question = await prisma.question.findUnique({ where: { id: questionId }, include: { choices: true } });
  if (!question) return NextResponse.json({ error: "問題が見つかりません" }, { status: 404 });
  const choice = question.choices.find((c) => c.id === choiceId);
  if (!choice) return NextResponse.json({ error: "選択肢が不正です" }, { status: 400 });

  const examinee = await prisma.examinee.upsert({
    where: { employeeCode_name: { employeeCode: profile.employeeCode, name: profile.name } },
    update: { department: profile.department },
    create: profile
  });

  await prisma.answer.upsert({
    where: { examineeId_questionId: { examineeId: examinee.id, questionId: question.id } },
    update: { selectedChoice: choice.label, isCorrect: choice.isCorrect, answeredAt: new Date() },
    create: { examineeId: examinee.id, questionId: question.id, selectedChoice: choice.label, isCorrect: choice.isCorrect }
  });

  return NextResponse.redirect(new URL("/complete", request.url));
}
