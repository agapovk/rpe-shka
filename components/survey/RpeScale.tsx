"use client";

// import type { ScaleLayout } from "@/features/survey/survey.types";
import { rpeColor } from "@/features/survey/survey.utils";

interface Props {
  onChange: (n: number) => void;
  value: number | null;
}

export default function RpeScale({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
        const on = value === n;
        const c = rpeColor(n);

        return (
          <button
            className={`rpe-btn ${on ? "rpe-on" : ""}`}
            key={n}
            onClick={() => onChange(n)}
            style={{ ["--c" as string]: c }}
            type="button"
          >
            <span className="rpe-num">{n}</span>
          </button>
        );
      })}
    </div>
  );
}
