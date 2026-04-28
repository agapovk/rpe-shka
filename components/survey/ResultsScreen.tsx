"use client";

import { useMemo, useState } from "react";
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from "xlsx";
import type { Session } from "@/features/survey/survey.types";
import {
  CATEGORY,
  ROSTER,
  rpeBucket,
  rpeColor,
} from "@/features/survey/survey.utils";

interface Props {
  onBack: () => void;
  onNew: () => void;
  session: Session;
}

export default function ResultsScreen({ session, onBack, onNew }: Props) {
  const [sortDesc, setSortDesc] = useState(true);
  const [exported, setExported] = useState(false);

  const recorded = ROSTER.filter((p) => session.rosterIds.includes(p.id))
    .map((p) => ({
      ...p,
      note: session.notes[p.id],
      rpe: session.scores[p.id],
    }))
    .filter((p): p is typeof p & { rpe: number } => p.rpe != null);

  const stats = useMemo(() => {
    if (recorded.length === 0) {
      return { avg: 0, hard: 0, hi: 0, lo: 0 };
    }
    const vals = recorded.map((p) => p.rpe);
    return {
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      hard: recorded.filter((p) => p.rpe >= 8).length,
      hi: Math.max(...vals),
      lo: Math.min(...vals),
    };
  }, [recorded]);

  const sorted = [...recorded].sort((a, b) =>
    sortDesc ? b.rpe - a.rpe : a.rpe - b.rpe
  );

  const categoryLabel =
    CATEGORY.find((c) => c.id === session.categoryId)?.label ?? "";

  const doExport = () => {
    try {
      const categoryShort =
        CATEGORY.find((c) => c.id === session.categoryId)?.short ?? "";
      const fileName = `rpe_${session.name.replace(/\s+/g, "_")}_${categoryShort}.xlsx`;
      const ws = xlsxUtils.json_to_sheet(
        recorded.map((p) => ({
          num: p.num,
          name: p.name,
          rpe: p.rpe,
          note: p.note ?? "",
        }))
      );
      const wb = xlsxUtils.book_new();
      xlsxUtils.book_append_sheet(wb, ws, "RPE");
      xlsxWriteFile(wb, fileName);
      setExported(true);
    } catch {
      // export failed silently — user can retry
    }
    setExported(false);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-7 pt-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 font-mono text-[11px] text-text-2 uppercase tracking-[0.14em]">
            <button
              aria-label="Back to capture"
              className="flex h-5.5 w-5.5 items-center justify-center border-none bg-transparent text-text-2 hover:text-text"
              onClick={onBack}
              type="button"
            >
              <svg
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
                viewBox="0 0 24 24"
                width="14"
              >
                <title>Back to capture</title>
                <line x1="19" x2="5" y1="12" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>RESULTS · {categoryLabel.toUpperCase()}</span>
          </div>
          <h1 className="m-0 font-bold font-display text-[56px] uppercase leading-[0.95] tracking-tight">
            {session.name}
          </h1>
        </header>

        <section
          className="grid gap-4"
          style={{ gridTemplateColumns: "1.2fr 1fr" }}
        >
          <div className="flex min-h-42 flex-col justify-between gap-1.5 rounded-2xl border border-line bg-bg-2 px-6 py-7">
            <div className="font-mono text-[11px] text-text-2 uppercase tracking-[0.16em]">
              AVG RPE
            </div>
            <div className="font-bold font-display text-[84px] text-accent tabular-nums leading-[0.9]">
              {stats.avg.toFixed(1)}
            </div>
            <div className="font-mono text-[11px] text-text-3 uppercase tracking-[0.14em]">
              {rpeBucket(Math.round(stats.avg))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat color={rpeColor(stats.hi)} label="HIGH" value={stats.hi} />
            <Stat color={rpeColor(stats.lo)} label="LOW" value={stats.lo} />
            <Stat label="PLAYERS" value={recorded.length} />
            <Stat
              color={stats.hard > 0 ? rpeColor(8) : "rgba(255,255,255,0.4)"}
              label="≥ 8 RPE"
              value={stats.hard}
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-text-2 uppercase tracking-[0.14em]">
              Individual load
            </span>
            <button
              className="flex items-center gap-1.5 rounded-lg border border-line bg-bg-2 px-3 py-2 font-mono text-[11px] text-text-2 tracking-[0.14em] hover:border-line-2 hover:text-text"
              onClick={() => setSortDesc(!sortDesc)}
              type="button"
            >
              RPE
              <svg
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
                style={{
                  transform: sortDesc ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "transform 0.2s",
                }}
                viewBox="0 0 24 24"
                width="14"
              >
                <title>Sort</title>
                <line x1="12" x2="12" y1="5" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
              {sortDesc ? "HIGH → LOW" : "LOW → HIGH"}
            </button>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-bg-2">
            {sorted.map((p, i) => {
              const flag = p.rpe >= 9 || p.rpe <= 2;
              return (
                <div
                  className="grid items-center gap-3.5 border-line border-b px-4.5 py-3.5 transition-colors last:border-b-0 hover:bg-bg-3"
                  key={p.id}
                  style={{
                    gridTemplateColumns:
                      "32px minmax(0,1.4fr) minmax(120px,2.2fr) 36px",
                  }}
                >
                  <span className="font-medium font-mono text-[11px] text-text-3">
                    {flag && (
                      <span className="mr-1 font-bold text-accent">!</span>
                    )}
                    {String(p.num).padStart(2, "0")}
                  </span>
                  <span className="truncate font-display font-medium text-[20px]">
                    {p.name}
                    {p.note && (
                      <span
                        className="ml-1.5 font-normal font-sans text-[11px] text-text-3 tracking-normal"
                        title={p.note}
                      >
                        · {p.note}
                      </span>
                    )}
                  </span>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-bg-3">
                    <div
                      className="bar-fill absolute top-0 bottom-0 left-0 rounded-full"
                      style={{
                        animationDelay: `${i * 30}ms`,
                        background: rpeColor(p.rpe),
                        width: `${(p.rpe / 10) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    className="text-right font-bold font-display text-[28px] tabular-nums leading-none"
                    style={{ color: rpeColor(p.rpe) }}
                  >
                    {p.rpe}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div
        className="flex shrink-0 items-stretch gap-3 px-7 py-6 pb-8"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg-1) 60%, transparent)",
        }}
      >
        <button
          className="flex min-h-18 shrink-0 items-center justify-center gap-2.5 rounded-[14px] bg-bg-3 px-7 py-5.5 font-bold font-display text-[22px] text-text uppercase tracking-[0.06em] transition hover:bg-bg-2"
          onClick={doExport}
          type="button"
        >
          {exported ? (
            <>
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="20"
              >
                <title>Exported</title>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              EXPORTED
            </>
          ) : (
            <>
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
              >
                <title>Export CSV</title>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              EXPORT XLS
            </>
          )}
        </button>
        <button
          className="flex min-h-18 flex-1 items-center justify-center gap-2.5 rounded-[14px] bg-accent px-7 py-5.5 font-bold font-display text-[22px] text-bg uppercase tracking-[0.06em] transition hover:brightness-110 active:translate-y-px"
          onClick={onNew}
          type="button"
        >
          NEW SESSION
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  color?: string;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-line bg-bg-2 px-4 py-3.5">
      <div className="font-mono text-[11px] text-text-2 uppercase tracking-[0.16em]">
        {label}
      </div>
      <div
        className="font-bold font-display text-[44px] tabular-nums leading-[0.9]"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
