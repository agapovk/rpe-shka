import { describe, expect, it } from "vitest";
import { rpeBgClass, rpeBucket, rpeTextClass } from "./rpe";

describe("rpeBucket", () => {
	it("returns LIGHT for 1–3", () => {
		expect(rpeBucket(1)).toBe("LIGHT");
		expect(rpeBucket(2)).toBe("LIGHT");
		expect(rpeBucket(3)).toBe("LIGHT");
	});

	it("returns MODERATE for 4–6", () => {
		expect(rpeBucket(4)).toBe("MODERATE");
		expect(rpeBucket(6)).toBe("MODERATE");
	});

	it("returns HARD for 7–8", () => {
		expect(rpeBucket(7)).toBe("HARD");
		expect(rpeBucket(8)).toBe("HARD");
	});

	it("returns MAXIMAL for 9–10", () => {
		expect(rpeBucket(9)).toBe("MAXIMAL");
		expect(rpeBucket(10)).toBe("MAXIMAL");
	});
});

describe("rpeTextClass", () => {
	it("returns correct Tailwind class per bucket", () => {
		expect(rpeTextClass(1)).toBe("text-rpe-light");
		expect(rpeTextClass(5)).toBe("text-rpe-moderate");
		expect(rpeTextClass(8)).toBe("text-rpe-hard");
		expect(rpeTextClass(10)).toBe("text-rpe-maximal");
	});
});

describe("rpeBgClass", () => {
	it("returns correct Tailwind class per bucket", () => {
		expect(rpeBgClass(3)).toBe("bg-rpe-light");
		expect(rpeBgClass(6)).toBe("bg-rpe-moderate");
		expect(rpeBgClass(7)).toBe("bg-rpe-hard");
		expect(rpeBgClass(9)).toBe("bg-rpe-maximal");
	});
});
