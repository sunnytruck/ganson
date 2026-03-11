import { NextResponse } from "next/server";
import { setExamineeCookie } from "@/lib/auth";
import { examineeSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = examineeSchema.safeParse({
    department: formData.get("department"),
    employeeCode: formData.get("employeeCode"),
    name: formData.get("name")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await setExamineeCookie(parsed.data);
  return NextResponse.redirect(new URL("/questions", request.url));
}
