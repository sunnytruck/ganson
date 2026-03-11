import { z } from "zod";

export const examineeSchema = z.object({
  department: z.string().min(1, "所属部署を入力してください"),
  employeeCode: z.string().min(1, "社員番号を入力してください"),
  name: z.string().min(1, "名前を入力してください")
});

export const creatorLoginSchema = z.object({
  loginId: z.string().min(1),
  password: z.string().min(1)
});
