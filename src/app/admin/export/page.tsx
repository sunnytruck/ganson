import { requireAdminSession } from "@/lib/auth";
import { PageTitle } from "@/components/PageTitle";

export default async function ExportPage() {
  await requireAdminSession();
  return (
    <>
      <PageTitle title="CSV / Excel 出力" />
      <div className="space-y-2 rounded border bg-white p-4">
        <a href="/api/admin/export/csv" className="block text-blue-700 underline">回答結果CSVをダウンロード</a>
        <a href="/api/admin/export/excel" className="block text-blue-700 underline">回答結果Excelをダウンロード</a>
      </div>
    </>
  );
}
