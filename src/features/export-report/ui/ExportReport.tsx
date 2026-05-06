"use client";

import type { PlayerReportRow } from "@shared/lib";
import { formatDuration } from "@shared/lib";
import { BottomSheet, Button } from "@shared/ui";
import { Download, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { useState } from "react";

interface ExportReportProps {
  dateRange: string;
  microcycleName: string;
  rows: PlayerReportRow[];
}

export function ExportReport({
  microcycleName,
  dateRange,
  rows,
}: ExportReportProps) {
  const [open, setOpen] = useState(false);

  function handleCsv() {
    exportCsv(microcycleName, rows);
    setOpen(false);
  }

  function handleXlsx() {
    exportXlsx(microcycleName, rows);
    setOpen(false);
  }

  async function handlePdf() {
    await exportPdf(microcycleName, dateRange, rows);
    setOpen(false);
  }

  return (
    <>
      <Button className="h-12 w-full gap-2" onClick={() => setOpen(true)}>
        <Download className="h-5 w-5" />
        Export report
      </Button>

      <BottomSheet onClose={() => setOpen(false)} open={open} title="Export as">
        <div className="flex flex-col gap-3 pb-6">
          <Button
            className="h-14 w-full justify-start gap-4"
            onClick={handlePdf}
            variant="outline"
          >
            <FileText className="h-5 w-5" />
            PDF
          </Button>
          <Button
            className="h-14 w-full justify-start gap-4"
            onClick={handleCsv}
            variant="outline"
          >
            <Sheet className="h-5 w-5" />
            CSV
          </Button>
          <Button
            className="h-14 w-full justify-start gap-4"
            onClick={handleXlsx}
            variant="outline"
          >
            <FileSpreadsheet className="h-5 w-5" />
            XLSX
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}

function slugify(name: string) {
  return name.replace(/\s+/g, "-").toLowerCase();
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv(microcycleName: string, rows: PlayerReportRow[]) {
  const header = "Player,Sessions,Duration (min),Avg RPE,Total sRPE";
  const body = rows.map((r) =>
    [
      `"${r.name}"`,
      r.sessions,
      r.totalDuration,
      r.sessions > 0 ? r.avgRpe.toFixed(1) : "",
      r.sessions > 0 ? r.totalSrpe : "",
    ].join(",")
  );
  const csv = [header, ...body].join("\n");
  triggerDownload(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    `${slugify(microcycleName)}-report.csv`
  );
}

function exportXlsx(microcycleName: string, rows: PlayerReportRow[]) {
  import("xlsx").then((XLSX) => {
    const data = [
      ["Player", "Sessions", "Duration (min)", "Avg RPE", "Total sRPE"],
      ...rows.map((r) => [
        r.name,
        r.sessions,
        r.totalDuration,
        r.sessions > 0 ? Number(r.avgRpe.toFixed(1)) : "",
        r.sessions > 0 ? r.totalSrpe : "",
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${slugify(microcycleName)}-report.xlsx`);
  });
}

async function exportPdf(
  microcycleName: string,
  dateRange: string,
  rows: PlayerReportRow[]
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  const colX = [14, 110, 135, 158, 178];
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
  doc.text("PLAYER", colX[0], y);
  doc.text("SESSIONS", colX[1], y);
  doc.text("DURATION", colX[2], y);
  doc.text("AVG RPE", colX[3], y);
  doc.text("sRPE", colX[4], y);
  y += 2;

  doc.setLineWidth(0.3);
  doc.setDrawColor(180);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30);

  for (const row of rows) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const hasData = row.sessions > 0;
    doc.text(row.name, colX[0], y);
    doc.text(hasData ? String(row.sessions) : "—", colX[1], y);
    doc.text(hasData ? formatDuration(row.totalDuration) : "—", colX[2], y);
    doc.text(hasData ? row.avgRpe.toFixed(1) : "—", colX[3], y);
    doc.text(hasData ? String(row.totalSrpe) : "—", colX[4], y);
    y += 7;
  }

  doc.save(`${slugify(microcycleName)}-report.pdf`);
}
