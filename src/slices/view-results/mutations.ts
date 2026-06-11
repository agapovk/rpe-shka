import type { RecordedPlayer } from "./model";

export async function exportXlsx(
	sessionName: string,
	recorded: RecordedPlayer[]
): Promise<void> {
	// ~400 КБ грузятся только по клику, не попадают в precache PWA
	const { utils, writeFile } = await import("xlsx");
	const fileName = `rpe_${sessionName.replace(/\s+/g, "_")}.xlsx`;
	const sheet = utils.json_to_sheet(
		recorded.map((p) => ({
			num: p.num,
			name: p.name,
			rpe: p.score,
			note: p.note ?? "",
		}))
	);
	const book = utils.book_new();
	utils.book_append_sheet(book, sheet, "RPE");
	writeFile(book, fileName);
}
