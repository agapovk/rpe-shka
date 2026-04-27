"use client";

import { redirect, useRouter } from "next/navigation";
import { use } from "react";
import CaptureScreen from "@/components/survey/CaptureScreen";
import { useSurveyStore } from "@/features/survey/survey.store";

export default function SurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const session = useSurveyStore((s) => s.getSession(id));

  if (!session) {
    return redirect("/");
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center overflow-auto md:p-6"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -200px, rgba(255,255,255,0.025), transparent 60%), var(--color-bg)",
      }}
    >
      <div className="flex w-full flex-1 flex-col items-center gap-6">
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
    </div>
  );
}
