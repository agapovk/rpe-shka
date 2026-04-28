"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import CaptureScreen from "@/components/survey/CaptureScreen";
import { useSurveyStore } from "@/features/survey/survey.store";
import { useHydrated } from "@/hooks/useHydrated";

export default function SurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHydrated();
  const session = useSurveyStore((s) => s.getSession(id));

  if (!hydrated) {
    return null;
  }

  if (!session) {
    router.replace("/");
    return null;
  }

  return (
    <CaptureScreen
      onFinish={() => router.push(`/sessions/${id}/results`)}
      session={session}
    />
  );
}
