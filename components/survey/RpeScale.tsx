"use client";

import type { ScaleLayout } from "@/features/survey/survey.types";
import { rpeColor } from "@/features/survey/survey.utils";

interface Props {
  layout: ScaleLayout;
  onChange: (n: number) => void;
  value: number | null;
}

const ARC_OFFSETS = [20, 10, 2, 0, 0, 0, 0, 2, 10, 20];

export default function RpeScale({ value, onChange, layout }: Props) {
  const containerCls =
    layout === "row"
      ? "grid grid-cols-10 gap-2"
      : layout === "arc"
        ? "flex flex-wrap justify-center gap-[10px]"
        : "grid grid-cols-5 gap-3";

  return (
    <div className={containerCls}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n, i) => {
        const on = value === n;
        const c = rpeColor(n);
        const arcStyle =
          layout === "arc"
            ? {
                transform: `translateY(${ARC_OFFSETS[i]}px)`,
                width: "calc(20% - 10px)",
              }
            : undefined;
        return (
          <button
            className={`rpe-btn ${on ? "rpe-on" : ""}`}
            key={n}
            onClick={() => onChange(n)}
            style={{ ["--c" as string]: c, ...arcStyle }}
            type="button"
          >
            <span
              className={`rpe-num ${layout === "row" ? "text-[26px]!" : ""}`}
            >
              {n}
            </span>
          </button>
        );
      })}
    </div>
  );
}
