import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ExamineeProfile } from "@/types/auth";

const ADMIN_COOKIE_KEY = "creator_session";
const EXAMINEE_COOKIE_KEY = "examinee_profile";

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_KEY, "ok", { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE_KEY)?.value !== "ok") {
    redirect("/admin/login");
  }
}

export async function setExamineeCookie(profile: ExamineeProfile) {
  const cookieStore = await cookies();
  cookieStore.set(EXAMINEE_COOKIE_KEY, JSON.stringify(profile), { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function getExamineeCookie(): Promise<ExamineeProfile | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(EXAMINEE_COOKIE_KEY)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExamineeProfile;
  } catch {
    return null;
  }
}

export async function requireExamineeCookie() {
  const profile = await getExamineeCookie();
  if (!profile) redirect("/");
  return profile;
}
