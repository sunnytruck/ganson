import { PageTitle } from "@/components/PageTitle";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <>
      <PageTitle title="回答開始" subtitle="回答者情報を入力して開始します" />
      <Card>
        <form action="/api/examinee/session" method="post" className="space-y-4">
          <div>
            <label>所属部署</label>
            <input name="department" required />
          </div>
          <div>
            <label>社員番号</label>
            <input name="employeeCode" required />
          </div>
          <div>
            <label>名前</label>
            <input name="name" required />
          </div>
          <button type="submit">開始する</button>
        </form>
      </Card>
    </>
  );
}
