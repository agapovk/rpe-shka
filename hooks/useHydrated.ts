"use client";

import { useEffect, useState } from "react";
import { useRosterStore } from "@/features/roster/roster.store";
import { useSurveyStore } from "@/features/survey/survey.store";

function allHydrated(): boolean {
  return (
    useSurveyStore.persist.hasHydrated() && useRosterStore.persist.hasHydrated()
  );
}

// With async IDB storage, both stores hydrate after mount.
// We subscribe to onFinishHydration on each and only resolve when both are done.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    if (allHydrated()) {
      setHydrated(true);
      return;
    }

    function check() {
      if (allHydrated()) {
        setHydrated(true);
      }
    }

    const unsubSurvey = useSurveyStore.persist.onFinishHydration(check);
    const unsubRoster = useRosterStore.persist.onFinishHydration(check);

    return () => {
      unsubSurvey();
      unsubRoster();
    };
  }, []);

  return hydrated;
}
