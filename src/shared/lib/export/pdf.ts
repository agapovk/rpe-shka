import { formatDuration } from "../format";
import type { PlayerReportRow } from "../report";
import { slugify } from "./download";

const COL_X = [14, 110, 135, 158, 178];
const PAGE_BREAK_Y = 270;
const ROW_STEP = 7;
const NO_DATA = "—";

export function buildPdfRows(rows: PlayerReportRow[]): string[][] {
  return rows.map((row) => {
    const hasData = row.sessions > 0;
    return [
      row.name,
      hasData ? String(row.sessions) : NO_DATA,
      hasData ? formatDuration(row.totalDuration) : NO_DATA,
      hasData ? row.avgRpe.toFixed(1) : NO_DATA,
      hasData ? String(row.totalSrpe) : NO_DATA,
    ];
  });
}

export async function exportPdf(
  microcycleName: string,
  dateRange: string,
  rows: PlayerReportRow[]
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(microcycleName, 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(dateRange, 14, y);
  y += 12;

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80);
  doc.text("PLAYER", COL_X[0], y);
  doc.text("SESSIONS", COL_X[1], y);
  doc.text("DURATION", COL_X[2], y);
  doc.text("AVG RPE", COL_X[3], y);
  doc.text("sRPE", COL_X[4], y);
  y += 2;

  doc.setLineWidth(0.3);
  doc.setDrawColor(180);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30);

  for (const row of buildPdfRows(rows)) {
    if (y > PAGE_BREAK_Y) {
      doc.addPage();
      y = 20;
    }
    for (const [i, cell] of row.entries()) {
      doc.text(cell, COL_X[i], y);
    }
    y += ROW_STEP;
  }

  doc.save(`${slugify(microcycleName)}-report.pdf`);
}
