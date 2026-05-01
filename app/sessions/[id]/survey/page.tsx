"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import CaptureScreen from "@/components/survey/CaptureScreen";
import { suggestSessionName } from "@/features/session/session.utils";
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
  const ensureSession = useSurveyStore((s) => s.ensureSession);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    ensureSession(id, suggestSessionName());
  }, [hydrated, id, ensureSession]);

  if (!(hydrated && session)) {
    return null;
  }

  return (
    <CaptureScreen
      onFinish={() => router.push(`/sessions/${id}/results`)}
      onHome={() => router.push("/")}
      session={session}
    />
  );
}
