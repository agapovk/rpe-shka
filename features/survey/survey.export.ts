import { utils as xlsxUtils, writeFile as xlsxWriteFile } from "xlsx";
import type { RecordedPlayer } from "./survey.utils";

export function exportSessionXlsx(
  sessionName: string,
  recorded: RecordedPlayer[]
): void {
  try {
    const fileName = `rpe_${sessionName.replace(/\s+/g, "_")}.xlsx`;
    const ws = xlsxUtils.json_to_sheet(
      recorded.map((p) => ({
        name: p.name,
        rpe: p.rpe,
        note: p.note ?? "",
      }))
    );
    const wb = xlsxUtils.book_new();
    xlsxUtils.book_append_sheet(wb, ws, "RPE");
    xlsxWriteFile(wb, fileName);
  } catch {
    // export failed — user can retry
  }
}
