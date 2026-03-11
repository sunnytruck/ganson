import dayjs from "dayjs";

export function toCsv(rows: Record<string, string | number | boolean>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;
  const csvRows = [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h] ?? "")).join(","))];
  return csvRows.join("\n");
}

export function formatDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}
