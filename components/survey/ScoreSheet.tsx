"use client";

import { useEffect, useState } from "react";
import type { Player } from "@/features/survey/survey.types";
import { rpeColor } from "@/features/survey/survey.utils";
import RpeScale from "./RpeScale";

interface Props {
  initialNote: string;
  initialScore: number | null;
  onClear: () => void;
  onClose: () => void;
  onSave: (score: number, note: string) => void;
  player: Player;
}

export default function ScoreSheet({
  player,
  initialScore,
  initialNote,
  onSave,
  onClear,
  onClose,
}: Props) {
  const [score, setScore] = useState<number | null>(initialScore);
  const [note, setNote] = useState<string>(initialNote);

  useEffect(() => {
    setScore(initialScore);
    setNote(initialNote);
  }, [initialScore, initialNote]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    if (score != null) {
      onSave(score, note);
    }
  };

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: backdrop dismiss
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss
    <div
      className="fade-in absolute inset-0 z-100 flex items-end justify-center"
      onClick={onClose}
      style={{ backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.55)" }}
    >
      {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: stop propagation */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation */}
      <div
        aria-modal="true"
        className="sheet-anim flex max-h-[92%] w-full flex-col gap-4.5 overflow-y-auto rounded-t-3xl bg-bg-1 px-6 pt-3 pb-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        style={{
          borderTop: "1px solid var(--color-line-2)",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-line-2" />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 font-mono text-text-3 text-xs tracking-[0.14em]">
              #{String(player.num).padStart(2, "0")}
            </div>
            <div className="font-bold font-display text-[44px] uppercase leading-[0.95] tracking-tight">
              {player.name}
            </div>
          </div>
          <button
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-bg-2 text-text-2 transition hover:bg-bg-3 hover:text-text"
            onClick={onClose}
            type="button"
          >
            <svg
              fill="none"
              height="22"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.4"
              viewBox="0 0 24 24"
              width="22"
            >
              <title>Close</title>
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="-mt-2 font-display text-[18px] text-text-2">
          How hard was that session?
        </div>

        <RpeScale onChange={setScore} value={score} />

        <div className="-mt-2 flex flex-wrap gap-4 font-mono text-[10px] tracking-[0.14em]">
          <span style={{ color: rpeColor(2) }}>● LIGHT</span>
          <span style={{ color: rpeColor(5) }}>● MODERATE</span>
          <span style={{ color: rpeColor(8) }}>● HARD</span>
          <span style={{ color: rpeColor(10) }}>● MAX</span>
        </div>

        <input
          className="min-h-14 w-full rounded-xl border border-line bg-bg-2 px-4.5 py-4 text-[15px] text-text outline-none placeholder:text-text-3 focus:border-accent"
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional) — e.g. tight hamstring, felt sharp"
          value={note}
        />

        <div className="mt-1 flex items-stretch gap-3">
          {initialScore != null && (
            <button
              className="cta-base flex min-h-18 shrink-0 items-center gap-2.5 rounded-[14px] bg-bg-3 px-7 py-5.5 font-bold font-display text-[22px] text-text uppercase tracking-[0.06em] hover:bg-bg-2"
              onClick={onClear}
              type="button"
            >
              <svg
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
              >
                <title>Clear</title>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
              </svg>
              CLEAR
            </button>
          )}
          <button
            className="flex min-h-18 flex-1 items-center justify-center gap-2.5 rounded-[14px] bg-accent px-7 py-5.5 font-bold font-display text-[22px] text-bg uppercase tracking-[0.06em] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale-[0.4]"
            disabled={score == null}
            onClick={save}
            type="button"
          >
            {score == null ? (
              "SELECT A SCORE"
            ) : (
              <>
                <span className="text-[28px]">{score}</span>
                <span className="opacity-70">·</span>
                SAVE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
