import { requireAdminSession } from "@/lib/auth";
import { PageTitle } from "@/components/PageTitle";

export default async function AdminNewQuestionPage() {
  await requireAdminSession();
  return (
    <>
      <PageTitle title="問題作成" />
      <form action="/api/admin/questions" method="post" className="space-y-3 rounded border bg-white p-4">
        <input name="title" placeholder="問題タイトル" required />
        <textarea name="body" placeholder="問題文" required />
        <textarea name="explanation" placeholder="解説" required />
        <input name="sortOrder" type="number" placeholder="並び順" defaultValue={0} required />
        <label className="flex items-center gap-2"><input className="w-auto" type="checkbox" name="isPublished" />公開する</label>
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="rounded border p-2">
            <input name={`choiceLabel${num}`} placeholder={`選択肢${num}`} required />
            <label className="mt-1 flex items-center gap-2 text-sm"><input className="w-auto" type="radio" name="correctIndex" value={String(num)} required />正解にする</label>
          </div>
        ))}
        <button type="submit">保存</button>
      </form>
    </>
  );
}
