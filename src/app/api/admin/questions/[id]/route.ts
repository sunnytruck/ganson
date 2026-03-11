import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await request.formData();
  const method = String(formData.get("_method") ?? "").toLowerCase();

  if (method === "delete") {
    await prisma.question.delete({ where: { id } });
    return NextResponse.redirect(new URL("/admin/questions", request.url));
  }

  const correctIndex = Number(formData.get("correctIndex"));
  await prisma.question.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
      explanation: String(formData.get("explanation") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      isPublished: formData.get("isPublished") === "on"
    }
  });

  await Promise.all([1, 2, 3, 4].map((num) => {
    const choiceId = String(formData.get(`choiceId${num}`) ?? "");
    return prisma.choice.update({
      where: { id: choiceId },
      data: { label: String(formData.get(`choiceLabel${num}`) ?? ""), isCorrect: correctIndex === num }
    });
  }));

  return NextResponse.redirect(new URL(`/admin/questions/${id}/edit`, request.url));
}
