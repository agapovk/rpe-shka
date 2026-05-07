import type { PlayerReportRow } from "../report";
import { slugify, triggerDownload } from "./download";

const HEADER = "Player,Sessions,Duration (min),Avg RPE,Total sRPE";

export function buildCsv(rows: PlayerReportRow[]): string {
  const body = rows.map((r) =>
    [
      `"${r.name}"`,
      r.sessions,
      r.totalDuration,
      r.sessions > 0 ? r.avgRpe.toFixed(1) : "",
      r.sessions > 0 ? r.totalSrpe : "",
    ].join(",")
  );
  return [HEADER, ...body].join("\n");
}

export function exportCsv(
  microcycleName: string,
  rows: PlayerReportRow[]
): void {
  const csv = buildCsv(rows);
  triggerDownload(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    `${slugify(microcycleName)}-report.csv`
  );
}
