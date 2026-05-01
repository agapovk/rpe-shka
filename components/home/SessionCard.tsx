import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  BUCKET_RPES,
  type SessionSummary,
} from "@/features/session/session.utils";
import { rpeColor } from "@/features/survey/survey.utils";

interface Props {
  editing?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  summary: SessionSummary;
}

export default function SessionCard({
  editing,
  onDelete,
  onClick,
  summary,
}: Props) {
  const { avg, date, dist, done, name, total } = summary;
  const incomplete = done < total;
  const max = Math.max(...dist, 1);
  const avgRounded = Math.max(1, Math.min(10, Math.round(avg)));
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setIsDeleting(true);
    setTimeout(() => onDelete?.(), 300);
  }

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isDeleting
          ? "max-h-0 scale-[0.97] opacity-0"
          : "max-h-40 scale-100 opacity-100"
      }`}
    >
      <div
        className={`flex overflow-hidden rounded-[14px] border transition-all duration-300 ${
          editing ? "border-line" : "border-line hover:border-line-2"
        }`}
      >
        <button
          className={`flex min-w-0 flex-1 flex-col gap-2.5 bg-bg-2 px-4 py-3 text-left transition ${
            editing
              ? "cursor-default"
              : "cursor-pointer hover:bg-bg-3 active:scale-[0.995]"
          }`}
          onClick={editing ? undefined : onClick}
          type="button"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-mono text-[10.5px] text-text-3 uppercase tracking-widest">
                {date}
              </span>
              <span className="font-display font-semibold text-[20px] text-text leading-[1.1] tracking-[0.005em]">
                {name}
              </span>
            </div>
            <span
              className={`flex shrink-0 items-baseline gap-px rounded-full border px-2.5 py-1 font-mono font-semibold text-[12px] tracking-[0.08em] ${
                incomplete
                  ? "border-[#FFB84D]/28 bg-[#FFB84D]/10 text-[#FFB84D]"
                  : "border-accent/25 bg-accent/12 text-accent"
              }`}
            >
              {done}
              <span className="text-[10.5px] opacity-60">/{total}</span>
            </span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-0">
              <span
                className="font-bold font-display text-[28px] tabular-nums leading-[0.95]"
                style={{ color: done > 0 ? rpeColor(avgRounded) : undefined }}
              >
                {done > 0 ? avg.toFixed(1) : "—"}
              </span>
              <span className="font-mono text-[9.5px] text-text-3 uppercase tracking-widest">
                AVG RPE
              </span>
            </div>
            <div
              aria-label="RPE distribution"
              className="flex h-7 items-end gap-1"
              role="img"
            >
              {dist.map((count, i) => {
                const bucketRpe = BUCKET_RPES[i];
                const heightPct = Math.max((count / max) * 100, 14);
                const opacity = count === 0 ? 0.18 : 0.4 + (count / max) * 0.6;
                return (
                  <span
                    className="min-h-1 w-2 rounded-[3px]"
                    key={bucketRpe}
                    style={{
                      background: rpeColor(bucketRpe),
                      height: `${heightPct}%`,
                      opacity,
                    }}
                    title={`${count} players`}
                  />
                );
              })}
            </div>
          </div>
        </button>

        {/* Delete panel slides in from right */}
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden bg-red-500/10 transition-all duration-300 ease-out ${
            editing ? "w-14 border-line border-l" : "w-0"
          }`}
        >
          <button
            aria-label={`Delete session ${name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition hover:bg-red-500/20 active:scale-95"
            onClick={handleDelete}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
