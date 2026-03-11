import { NextResponse } from "next/server";
import { creatorLoginSchema } from "@/lib/validators";
import { setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = creatorLoginSchema.safeParse({ loginId: formData.get("loginId"), password: formData.get("password") });
  if (!parsed.success) return NextResponse.json({ error: "入力が不正です" }, { status: 400 });

  if (parsed.data.loginId !== process.env.CREATOR_LOGIN_ID || parsed.data.password !== process.env.CREATOR_LOGIN_PASSWORD) {
    return NextResponse.json({ error: "認証に失敗しました" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.redirect(new URL("/admin/questions", request.url));
}
