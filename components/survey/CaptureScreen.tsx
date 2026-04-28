"use client";

import { useState } from "react";
import { suggestSessionName } from "@/features/session/session.utils";
import { useSurveyStore } from "@/features/survey/survey.store";
import type { Session } from "@/features/survey/survey.types";
import { ROSTER, rpeColor } from "@/features/survey/survey.utils";
import ScoreSheet from "./ScoreSheet";

interface Props {
  onFinish: () => void;
  session: Session;
}

type Filter = "all" | "pending" | "done";

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: large capture UI
export default function CaptureScreen({ session, onFinish }: Props) {
  const { updateSession, setScore, clearScore } = useSurveyStore();

  const [openId, setOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [editingRoster, setEditingRoster] = useState(false);

  const visibleRoster = ROSTER.filter((pl) =>
    session.rosterIds.includes(pl.id)
  );
  const done = visibleRoster.filter(
    (pl) => session.scores[pl.id] != null
  ).length;
  const total = visibleRoster.length;
  const pct = total ? (done / total) * 100 : 0;

  const openPlayer =
    openId == null ? null : (ROSTER.find((pl) => pl.id === openId) ?? null);

  const toggleRoster = (id: number) => {
    const wasIn = session.rosterIds.includes(id);
    const rosterIds = wasIn
      ? session.rosterIds.filter((x) => x !== id)
      : [...session.rosterIds, id];
    updateSession(session.id, { rosterIds });
    if (wasIn && session.scores[id] != null) {
      clearScore(session.id, id);
    }
  };

  const filtered = visibleRoster.filter((pl) => {
    if (filter === "pending") {
      return session.scores[pl.id] == null;
    }
    if (filter === "done") {
      return session.scores[pl.id] != null;
    }
    return true;
  });

  const handleSave = (score: number, note: string) => {
    if (openId == null) {
      return;
    }
    setScore(session.id, openId, score, note);
    setOpenId(null);
  };

  const handleClear = () => {
    if (openId == null) {
      return;
    }
    clearScore(session.id, openId);
    setOpenId(null);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto">
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
            onBlur={(e) => {
              if (!e.target.value.trim()) {
                updateSession(session.id, { name: suggestSessionName() });
              }
            }}
            onChange={(e) =>
              updateSession(session.id, { name: e.target.value })
            }
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
          <div className="flex items-center justify-between">
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
            {(editingRoster ? ROSTER : filtered).map((pl) => {
              const inSession = session.rosterIds.includes(pl.id);
              const score = session.scores[pl.id];
              const hasScore = score != null;
              const note = session.notes[pl.id];

              if (editingRoster) {
                return (
                  <button
                    className={`flex min-h-14 items-center gap-4 border-line border-b px-4.5 py-3.5 text-left transition last:border-b-0 ${inSession ? "text-text" : "text-text-2"} hover:bg-bg-3 hover:text-text`}
                    key={pl.id}
                    onClick={() => toggleRoster(pl.id)}
                    type="button"
                  >
                    <span
                      className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border-[1.5px] transition ${inSession ? "border-accent bg-accent" : "border-line-2"}`}
                    >
                      {inSession && (
                        <svg
                          fill="none"
                          height="14"
                          stroke="#0D0D0F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3.5"
                          viewBox="0 0 24 24"
                          width="14"
                        >
                          <title>Remove from session</title>
                          <polyline points="4 12 10 18 20 6" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`w-6 font-medium font-mono text-[13px] ${inSession ? "text-text-2" : "text-text-3"}`}
                    >
                      {String(pl.num).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display font-medium text-[18px] sm:text-[22px]">
                      {pl.name}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  className={`grid min-h-14 items-center gap-3.5 border-line border-b px-4.5 py-3.5 text-left transition last:border-b-0 ${hasScore ? "bg-white/1.5 text-text" : "text-text-2"} group hover:bg-bg-3 hover:text-text`}
                  key={pl.id}
                  onClick={() => setOpenId(pl.id)}
                  style={{ gridTemplateColumns: "28px 1fr auto" }}
                  type="button"
                >
                  <span className="w-6 font-medium font-mono text-[13px] text-text-3">
                    {String(pl.num).padStart(2, "0")}
                  </span>
                  <span className="truncate font-display font-medium text-[18px] sm:text-[22px]">
                    {pl.name}
                    {note && (
                      <span className="ml-2 font-normal font-sans text-[11px] text-text-3 tracking-normal">
                        · {note}
                      </span>
                    )}
                  </span>
                  {hasScore ? (
                    <span className="flex items-center gap-3 font-mono text-[10px] tracking-[0.14em]">
                      <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-accent">
                        <svg
                          fill="none"
                          height="12"
                          stroke="#0D0D0F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3.5"
                          viewBox="0 0 24 24"
                          width="12"
                        >
                          <title>Scored</title>
                          <polyline points="4 12 10 18 20 6" />
                        </svg>
                      </span>
                      <span
                        className="min-w-5.5 text-right font-bold font-display text-[22px] tabular-nums leading-none sm:text-[28px]"
                        style={{ color: rpeColor(score) }}
                      >
                        {score}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2.5 font-mono text-[10px] text-text-3 tracking-[0.14em]">
                      <span className="font-medium transition-colors group-hover:text-accent">
                        TAP TO SCORE
                      </span>
                      <svg
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.4"
                        viewBox="0 0 24 24"
                        width="16"
                      >
                        <title>Tap to score</title>
                        <line x1="5" x2="19" y1="12" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
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
          onClose={() => setOpenId(null)}
          onSave={handleSave}
          player={openPlayer}
        />
      )}

      {/* CTA bar */}
      <div
        className="flex shrink-0 items-stretch gap-3 pt-6"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg-1) 60%, transparent)",
        }}
      >
        <div className="flex min-w-20 flex-col justify-center px-1 sm:min-w-27.5">
          <span
            className={`font-bold font-display text-[30px] leading-none sm:text-[44px] ${done === 0 ? "text-text-3" : "text-text"}`}
          >
            {done}
            <span className="text-[0.6em] text-text-3">/{total}</span>
          </span>
          <span className="mt-0.5 font-mono text-[10px] text-text-2 uppercase tracking-[0.16em]">
            {done === total && total > 0 ? "ALL DONE" : "SCORED"}
          </span>
        </div>
        <button
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-[14px] bg-accent px-3 py-4 font-bold font-display text-[14px] text-bg uppercase tracking-[0.06em] transition hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale-[0.4] sm:min-h-18 sm:gap-2.5 sm:px-7 sm:py-5.5 sm:text-[22px]"
          disabled={done === 0}
          onClick={onFinish}
          type="button"
        >
          {done === total && total > 0
            ? "VIEW RESULTS"
            : "FINISH & VIEW RESULTS"}
          <svg
            fill="none"
            height="22"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="22"
          >
            <title>Finish session</title>
            <line x1="5" x2="19" y1="12" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </>
  );
}
