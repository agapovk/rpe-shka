"use client";

import { ArrowDown, ArrowLeft, Download } from "lucide-react";
import type { Session } from "@/features/survey/survey.types";
import { rpeBucket, rpeColor } from "@/features/survey/survey.utils";
import { useResultsScreen } from "@/hooks/useResultsScreen";
import Stat from "./Stat";

interface Props {
  onBack: () => void;
  onNew: () => void;
  session: Session;
}

export default function ResultsScreen({ onBack, onNew, session }: Props) {
  const { doExport, recorded, sortDesc, sorted, stats, toggleSort } =
    useResultsScreen(session);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="scrollbar-hidden flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto sm:pt-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 font-mono text-[11px] text-text-2 uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>RESULTS · {session.name.toUpperCase()}</span>
          </div>
          <h1 className="m-0 font-bold font-display text-[32px] uppercase leading-11 tracking-tight sm:text-[56px]">
            {session.name}
          </h1>
        </header>

        <section
          className="grid gap-4"
          style={{ gridTemplateColumns: "1.2fr 1fr" }}
        >
          <div className="flex min-h-28 flex-col justify-between gap-1.5 rounded-2xl border border-line bg-bg-2 px-4 py-4 sm:min-h-42 sm:px-6 sm:py-7">
            <div className="font-mono text-[11px] text-text-2 uppercase tracking-[0.16em]">
              AVG RPE
            </div>
            <div className="font-bold font-display text-[48px] text-accent tabular-nums leading-[0.9] sm:text-[84px]">
              {stats.avg.toFixed(1)}
            </div>
            <div className="font-mono text-[11px] text-text-3 uppercase tracking-widest">
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
            <span className="font-mono text-[11px] text-text-2 uppercase tracking-widest">
              Individual load
            </span>
            <button
              className="flex items-center gap-1.5 rounded-lg border border-line bg-bg-2 px-3 py-2 font-mono text-[11px] text-text-2 tracking-widest hover:border-line-2 hover:text-text"
              onClick={toggleSort}
              type="button"
            >
              RPE
              <ArrowDown
                className="h-4 w-4"
                style={{
                  transform: sortDesc ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "transform 0.2s",
                }}
              />
              {sortDesc ? "HIGH → LOW" : "LOW → HIGH"}
            </button>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-bg-2">
            {sorted.map((p, i) => {
              const flag = p.rpe >= 9 || p.rpe <= 2;
              return (
                <div
                  className="grid items-center gap-2 border-line border-b px-3 py-3 transition-colors last:border-b-0 hover:bg-bg-3 sm:gap-3.5 sm:px-4.5 sm:py-3.5"
                  key={p.id}
                  style={{
                    gridTemplateColumns:
                      "28px minmax(0,1.4fr) minmax(60px,2fr) 32px",
                  }}
                >
                  <span className="font-medium font-mono text-[11px] text-text-3">
                    {flag && (
                      <span className="mr-1 font-bold text-accent">!</span>
                    )}
                    {String(p.num).padStart(2, "0")}
                  </span>
                  <span className="truncate font-display font-medium text-[16px] sm:text-[20px]">
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
                    className="text-right font-bold font-display text-[20px] tabular-nums leading-none sm:text-[28px]"
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
        className="flex shrink-0 items-stretch gap-3 pt-5 sm:pt-6"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg-1) 60%, transparent)",
        }}
      >
        <button
          className="flex aspect-square min-h-14 shrink-0 items-center justify-center gap-2.5 rounded-[14px] bg-bg-3 px-4 py-4 font-bold font-display text-[16px] text-text uppercase tracking-[0.06em] transition hover:bg-bg-2 sm:min-h-18 sm:px-7 sm:py-5.5 sm:text-[22px]"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          className="flex min-h-14 shrink-0 items-center justify-center gap-2.5 rounded-[14px] bg-bg-3 px-4 py-4 font-bold font-display text-[16px] text-text uppercase tracking-[0.06em] transition hover:bg-bg-2 sm:min-h-18 sm:px-7 sm:py-5.5 sm:text-[22px]"
          onClick={doExport}
          type="button"
        >
          <Download className="h-4 w-4" />
          XLSX
        </button>
        <button
          className="flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-[14px] bg-accent px-4 py-4 font-bold font-display text-[16px] text-bg uppercase tracking-[0.06em] transition hover:brightness-110 active:translate-y-px sm:min-h-18 sm:px-7 sm:py-5.5 sm:text-[22px]"
          onClick={onNew}
          type="button"
        >
          NEW REPORT
        </button>
      </div>
    </div>
  );
}
