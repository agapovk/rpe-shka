import type { PlayerReportRow } from "../report";
import { slugify } from "./download";

type SheetCell = string | number;

const HEADER: SheetCell[] = [
  "Player",
  "Sessions",
  "Duration (min)",
  "Avg RPE",
  "Total sRPE",
];

export function buildSheetData(rows: PlayerReportRow[]): SheetCell[][] {
  return [
    HEADER,
    ...rows.map<SheetCell[]>((r) => [
      r.name,
      r.sessions,
      r.totalDuration,
      r.sessions > 0 ? Number(r.avgRpe.toFixed(1)) : "",
      r.sessions > 0 ? r.totalSrpe : "",
    ]),
  ];
}

export async function exportXlsx(
  microcycleName: string,
  rows: PlayerReportRow[]
): Promise<void> {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet(buildSheetData(rows));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${slugify(microcycleName)}-report.xlsx`);
}
