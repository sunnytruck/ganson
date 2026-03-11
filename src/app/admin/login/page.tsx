import { PageTitle } from "@/components/PageTitle";

export default function AdminLoginPage() {
  return (
    <>
      <PageTitle title="作成者ログイン" />
      <form action="/api/admin/login" method="post" className="max-w-md space-y-3 rounded border bg-white p-4">
        <div>
          <label>ログインID</label>
          <input name="loginId" required />
        </div>
        <div>
          <label>パスワード</label>
          <input name="password" type="password" required />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </>
  );
}
