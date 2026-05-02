"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoriesSection from "@/components/settings/CategoriesSection";
import RosterSection from "@/components/settings/RosterSection";
import StorageSection from "@/components/settings/StorageSection";
import ThemeSection from "@/components/settings/ThemeSection";
import { useRosterStore } from "@/features/roster/roster.store";
import { useSurveyStore } from "@/features/survey/survey.store";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { sessions } = useSurveyStore();
  const { players } = useRosterStore();
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClearData() {
    if (typeof window === "undefined") {
      return;
    }
    indexedDB.deleteDatabase("keyval-store");
    window.location.href = "/";
  }

  return (
    <div className="scroll-hidden flex h-dvh flex-col items-center overflow-y-auto md:p-6">
      <div className="relative flex w-full max-w-3xl flex-1 flex-col bg-bg-1 md:rounded-3xl md:border md:border-line">
        {/* Header */}
        <header className="flex items-center gap-3 px-5 py-5 sm:px-7">
          <button
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-2 transition hover:bg-bg-3 hover:text-text active:scale-95"
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="font-bold font-display text-[24px] text-text uppercase tracking-tight">
            SETTINGS
          </span>
        </header>

        <div className="flex flex-col gap-8 px-5 pb-10 sm:px-7">
          <ThemeSection />
          <CategoriesSection />
          <RosterSection />
          <StorageSection />

          {/* Danger zone */}
          <section className="flex flex-col gap-3">
            <span className="font-mono text-[11px] text-text-2 uppercase tracking-widest">
              DATA
            </span>
            <div className="flex flex-col gap-2 rounded-xl border border-line bg-bg-2 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[13px] text-text">
                    All sessions & roster
                  </span>
                  <span className="font-mono text-[11px] text-text-3">
                    {sessions.length} sessions · {players.length} players
                  </span>
                </div>
                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-text-3">
                      Sure?
                    </span>
                    <button
                      className="rounded-lg bg-red-500/15 px-3 py-1.5 font-mono text-[11px] text-red-400 uppercase tracking-widest transition hover:bg-red-500/25"
                      onClick={handleClearData}
                      type="button"
                    >
                      YES, CLEAR
                    </button>
                    <button
                      className="rounded-lg bg-bg-3 px-3 py-1.5 font-mono text-[11px] text-text-2 uppercase tracking-widest transition hover:bg-bg-2"
                      onClick={() => setConfirmClear(false)}
                      type="button"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                      "font-mono text-[11px] text-red-400 uppercase tracking-widest",
                      "bg-red-500/10 transition hover:bg-red-500/20"
                    )}
                    onClick={() => setConfirmClear(true)}
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    CLEAR ALL
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
