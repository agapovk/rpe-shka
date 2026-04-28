"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import ResultsScreen from "@/components/survey/ResultsScreen";
import { suggestSessionName } from "@/features/session/session.utils";
import { useSurveyStore } from "@/features/survey/survey.store";
import { CATEGORY } from "@/features/survey/survey.utils";
import { useHydrated } from "@/lib/useHydrated";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHydrated();
  const { getSession, createSession } = useSurveyStore();
  const session = getSession(id);

  if (!hydrated) {
    return null;
  }

  if (!session) {
    router.replace("/");
    return null;
  }

  const handleNew = () => {
    const newId = createSession(suggestSessionName(), CATEGORY[0].id);
    router.push(`/sessions/${newId}/survey`);
  };

  return (
    <div className="flex h-dvh flex-col items-center overflow-hidden md:p-6">
      <div className="relative flex w-full max-w-3xl flex-1 flex-col overflow-hidden bg-bg-1 md:rounded-[28px] md:border md:border-line">
        <ResultsScreen
          onBack={() => router.push(`/sessions/${id}/survey`)}
          onNew={handleNew}
          session={session}
        />
      </div>
    </div>
  );
}
