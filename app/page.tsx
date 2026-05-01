"use client";

import { useRouter } from "next/navigation";
import SessionCard from "@/components/home/SessionCard";
import StatStrip from "@/components/home/StatStrip";
import {
  calcHomeStats,
  calcSessionSummary,
  suggestSessionName,
} from "@/features/session/session.utils";
import { useSurveyStore } from "@/features/survey/survey.store";
import { useHydrated } from "@/hooks/useHydrated";

export default function HomePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { sessions, createSession } = useSurveyStore();

  function handleNewSession() {
    const id = createSession(suggestSessionName());
    router.push(`/sessions/${id}/survey`);
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse font-mono text-[11px] text-text-3 uppercase tracking-widest">
          Loading...
        </div>
      </div>
    );
  }

  const summaries = [...sessions].reverse().map(calcSessionSummary);
  const stats = calcHomeStats(sessions);

  return (
    <div className="flex min-h-dvh flex-col items-center md:p-6">
      <div className="relative flex w-full max-w-3xl flex-1 flex-col bg-bg-1 md:rounded-[28px] md:border md:border-line">
        {/* Sticky header */}
        <header
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-5 sm:px-7"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-bg-1) 80%, transparent)",
          }}
        >
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-[32px] text-text leading-none tracking-tight">
              RPE
            </span>
            <span className="font-mono text-[10px] text-text-3 uppercase tracking-[0.18em]">
              шка
            </span>
          </div>
          <button
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-bold font-display text-[14px] text-bg uppercase tracking-[0.08em] transition hover:brightness-105 active:translate-y-px"
            onClick={handleNewSession}
            type="button"
          >
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.6"
              viewBox="0 0 24 24"
              width="18"
            >
              <title>New session</title>
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            NEW SESSION
          </button>
        </header>

        <div className="flex flex-col gap-4 px-5 pb-6 sm:px-7">
          <StatStrip stats={stats} />

          {/* Sessions list */}
          <div className="mt-1 flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] text-text-2 uppercase tracking-[0.14em]">
                RECENT SESSIONS
              </span>
              <span className="font-display font-semibold text-[18px] text-text-3 tabular-nums">
                {sessions.length}
              </span>
            </div>
            {summaries.length === 0 ? (
              <div className="flex items-center justify-center py-16 font-mono text-[11px] text-text-3 uppercase tracking-[0.14em]">
                No sessions yet — tap NEW SESSION to start.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {summaries.map((summary) => (
                  <SessionCard
                    key={summary.id}
                    onClick={() =>
                      router.push(`/sessions/${summary.id}/survey`)
                    }
                    summary={summary}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
