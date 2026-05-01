"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Session } from "@/features/survey/survey.types";
import { ROSTER } from "@/features/survey/survey.utils";
import { type Filter, useCaptureScreen } from "@/hooks/useCaptureScreen";
import RosterEditRow from "./RosterEditRow";
import RosterScoreRow from "./RosterScoreRow";
import ScoreSheet from "./ScoreSheet";

interface Props {
  onFinish: () => void;
  onHome: () => void;
  session: Session;
}

export default function CaptureScreen({ onFinish, onHome, session }: Props) {
  const {
    closeScore,
    done,
    editingRoster,
    filter,
    filtered,
    handleClear,
    handleNameBlur,
    handleNameChange,
    handleSave,
    handleToggleRoster,
    openPlayer,
    openScore,
    pct,
    setEditingRoster,
    setFilter,
    total,
  } = useCaptureScreen(session);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 font-mono text-[11px] text-text-2 uppercase tracking-[0.14em]">
            <span className="h-2 w-2 rounded-full bg-accent [box-shadow:0_0_12px_var(--color-accent)]" />
            <span>
              SESSION · {done === total && total > 0 ? "READY" : "IN PROGRESS"}
            </span>
          </div>
          <input
            className="w-full border-transparent border-b-[1.5px] bg-transparent py-0.5 font-bold font-display text-[32px] text-text uppercase leading-[0.95] tracking-tight outline-none transition-colors hover:border-line-2 focus:border-accent sm:text-5xl"
            onBlur={(e) => handleNameBlur(e.target.value)}
            onChange={(e) => handleNameChange(e.target.value)}
            value={session.name}
          />
        </header>

        {/* Progress */}
        <section className="flex flex-col gap-3.5 border-line border-y py-4.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-1.5 font-display">
              <span
                className={`font-bold text-[30px] tabular-nums leading-none transition-colors sm:text-[44px] ${done === total && total > 0 ? "text-accent" : "text-text"}`}
              >
                {done}
              </span>
              <span className="mr-2.5 font-medium text-[16px] text-text-3 sm:text-[22px]">
                / {total}
              </span>
              <span className="font-medium font-mono text-[11px] text-text-2 uppercase sm:tracking-[0.14em]">
                <span className="hidden sm:inline">PLAYERS</span>
                SCORED
              </span>
            </div>
            <div className="flex gap-0.5 rounded-lg border border-line bg-bg-2 p-0.75">
              {(["all", "pending", "done"] as Filter[]).map((f) => {
                const counts = { all: total, done, pending: total - done }[f];
                const labels = { all: "ALL", done: "DONE", pending: "PENDING" }[
                  f
                ];
                const on = filter === f;
                return (
                  <button
                    className={`rounded-md px-2.5 py-1.5 font-medium font-mono text-[10px] transition sm:tracking-[0.12em] ${on ? "bg-bg-3 text-text" : "text-text-3 hover:text-text-2"}`}
                    key={f}
                    onClick={() => setFilter(f)}
                    type="button"
                  >
                    {labels} · {counts}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-bg-3">
            <div
              className="absolute top-0 bottom-0 left-0 rounded-full bg-accent transition-[width] duration-400"
              style={{ width: `${pct}%` }}
            />
          </div>
        </section>

        {/* Roster */}
        <section className="flex flex-col gap-3">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-bg-1 py-1">
            <span className="font-mono text-[11px] text-text-2 uppercase tracking-[0.14em]">
              Tap a player to score
            </span>
            <button
              className="py-1 font-mono text-[11px] text-accent uppercase tracking-[0.14em] underline-offset-4 hover:underline"
              onClick={() => setEditingRoster(!editingRoster)}
              type="button"
            >
              {editingRoster ? "Done editing" : "Edit roster"}
            </button>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-bg-2">
            {(editingRoster ? ROSTER : filtered).map((pl) =>
              editingRoster ? (
                <RosterEditRow
                  inSession={session.rosterIds.includes(pl.id)}
                  key={pl.id}
                  onToggle={handleToggleRoster}
                  player={pl}
                  score={session.scores[pl.id]}
                />
              ) : (
                <RosterScoreRow
                  key={pl.id}
                  note={session.notes[pl.id]}
                  onOpen={openScore}
                  player={pl}
                  score={session.scores[pl.id]}
                />
              )
            )}
            {!editingRoster && filtered.length === 0 && (
              <div className="px-6 py-10 text-center font-mono text-[12px] text-text-3 tracking-[0.12em]">
                {filter === "pending"
                  ? "All players scored 🎯"
                  : filter === "done"
                    ? "Nobody scored yet"
                    : "Roster is empty"}
              </div>
            )}
          </div>
        </section>
      </div>

      {openPlayer && (
        <ScoreSheet
          initialNote={session.notes[openPlayer.id] ?? ""}
          initialScore={session.scores[openPlayer.id] ?? null}
          onClear={handleClear}
          onClose={closeScore}
          onSave={handleSave}
          player={openPlayer}
        />
      )}

      {/* CTA bar */}
      <div
        className="flex shrink-0 items-stretch gap-3 pt-5"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg-1) 60%, transparent)",
        }}
      >
        <button
          className="flex aspect-square min-h-14 shrink-0 items-center justify-center gap-2.5 rounded-[14px] bg-bg-3 px-4 py-4 font-bold font-display text-[16px] text-text uppercase tracking-[0.06em] transition hover:bg-bg-2 sm:min-h-18 sm:px-7 sm:py-5.5 sm:text-[22px]"
          onClick={onHome}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-[14px] bg-accent px-3 py-4 font-bold font-display text-[14px] text-bg uppercase tracking-[0.06em] transition hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale-[0.4] sm:min-h-18 sm:gap-2.5 sm:px-7 sm:py-5.5 sm:text-[22px]"
          disabled={done === 0}
          onClick={onFinish}
          type="button"
        >
          {done === total && total > 0
            ? "VIEW RESULTS"
            : "FINISH & VIEW RESULTS"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
