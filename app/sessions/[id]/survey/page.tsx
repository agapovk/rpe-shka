"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import CaptureScreen from "@/components/survey/CaptureScreen";
import { useSurveyStore } from "@/features/survey/survey.store";
import { useHydrated } from "@/lib/useHydrated";

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
    <div
      className="flex h-dvh flex-col items-center overflow-hidden md:p-6"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -200px, rgba(255,255,255,0.025), transparent 60%), var(--color-bg)",
      }}
    >
      <div
        className="relative flex w-full max-w-3xl flex-1 flex-col overflow-hidden bg-bg-1 px-7 py-8 md:rounded-[28px] md:border md:border-line"
        style={{
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03) inset, 0 40px 80px rgba(0,0,0,0.5)",
        }}
      >
        <CaptureScreen
          onFinish={() => router.push(`/sessions/${id}/results`)}
          session={session}
        />
      </div>
    </div>
  );
}
