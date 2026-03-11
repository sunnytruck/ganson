import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const correctIndex = Number(formData.get("correctIndex"));

  const created = await prisma.question.create({
    data: {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
      explanation: String(formData.get("explanation") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      isPublished: formData.get("isPublished") === "on",
      choices: {
        create: [1, 2, 3, 4].map((num) => ({
          label: String(formData.get(`choiceLabel${num}`) ?? ""),
          value: String(num),
          sortOrder: num,
          isCorrect: correctIndex === num
        }))
      }
    }
  });

  return NextResponse.redirect(new URL(`/admin/questions/${created.id}/edit`, request.url));
}
