"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { suggestSessionName } from "@/features/session/session.utils";
import { useSurveyStore } from "@/features/survey/survey.store";
import { useHydrated } from "@/lib/useHydrated";

export default function HomePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { sessions, createSession } = useSurveyStore();

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const last = sessions.at(-1);
    if (last) {
      router.replace(`/sessions/${last.id}/survey`);
    } else {
      const id = createSession(suggestSessionName());
      router.replace(`/sessions/${id}/survey`);
    }
  }, [hydrated, sessions, router, createSession]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse font-mono text-[11px] text-text-3 uppercase tracking-widest">
        Loading...
      </div>
    </div>
  );
}
