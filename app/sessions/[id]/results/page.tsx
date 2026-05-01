"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import ResultsScreen from "@/components/results/ResultsScreen";
import { suggestSessionName } from "@/features/session/session.utils";
import { useSurveyStore } from "@/features/survey/survey.store";
import { useHydrated } from "@/hooks/useHydrated";

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
    const newId = createSession(suggestSessionName());
    router.push(`/sessions/${newId}/survey`);
  };

  return (
    <ResultsScreen
      onBack={() => router.push(`/sessions/${id}/survey`)}
      onNew={handleNew}
      session={session}
    />
  );
}
