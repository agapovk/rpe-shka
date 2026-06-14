import { describe, expect, it } from "vitest";
import { parseRoster, serializeRoster } from "./model";

describe("parseRoster", () => {
	it("returns empty for blank input", () => {
		expect(parseRoster("   ")).toEqual({ players: [], errors: [] });
	});

	it("parses JSON array", () => {
		const { players, errors } = parseRoster(
			'[{"name":"Egor Mosin","num":9},{"name":"Leo","num":22}]'
		);
		expect(errors).toEqual([]);
		expect(players).toEqual([
			{ name: "Egor Mosin", num: 9 },
			{ name: "Leo", num: 22 },
		]);
	});

	it("reports invalid JSON", () => {
		expect(parseRoster("[oops").errors).toEqual(["Invalid JSON"]);
	});

	it("flags JSON items missing name or num", () => {
		const { players, errors } = parseRoster('[{"name":"A","num":1},{"num":2}]');
		expect(players).toEqual([{ name: "A", num: 1 }]);
		expect(errors).toHaveLength(1);
	});

	it("parses comma lines in either token order", () => {
		const { players, errors } = parseRoster("Egor Mosin, 9\n10, Martin");
		expect(errors).toEqual([]);
		expect(players).toEqual([
			{ name: "Egor Mosin", num: 9 },
			{ name: "Martin", num: 10 },
		]);
	});

	it("skips blank lines and flags lines without a number", () => {
		const { players, errors } = parseRoster("Leo, 22\n\nNoNumber");
		expect(players).toEqual([{ name: "Leo", num: 22 }]);
		expect(errors).toHaveLength(1);
	});
});

describe("serializeRoster", () => {
	it("sorts by name and keeps only name/num", () => {
		const json = serializeRoster([
			{ name: "Zed", num: 1 },
			{ name: "Abe", num: 2 },
		]);
		expect(JSON.parse(json)).toEqual([
			{ name: "Abe", num: 2 },
			{ name: "Zed", num: 1 },
		]);
	});
});
