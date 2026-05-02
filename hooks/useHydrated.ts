"use client";

import { useEffect, useState } from "react";
import { useSurveyStore } from "@/features/survey/survey.store";

// With async IDB storage, Zustand hydration completes after mount.
// We subscribe to onFinishHydration instead of relying on a simple useEffect delay.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    useSurveyStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (useSurveyStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useSurveyStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  return hydrated;
}
