"use client";

import type { PlayerReportRow } from "@shared/lib";
import { exportCsv, exportPdf, exportXlsx } from "@shared/lib";
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

  async function handleXlsx() {
    await exportXlsx(microcycleName, rows);
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
