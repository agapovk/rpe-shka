"use client";

import { useMemo, useState } from "react";

import type { Session } from "@/features/survey//survey.types";
import {
  calcSessionStats,
  type RecordedPlayer,
  ROSTER,
  type SessionStats,
} from "@/features/survey//survey.utils";
import { exportSessionXlsx } from "@/features/survey/survey.export";

export function useResultsScreen(session: Session): {
  doExport: () => void;
  recorded: RecordedPlayer[];
  sortDesc: boolean;
  sorted: RecordedPlayer[];
  stats: SessionStats;
  toggleSort: () => void;
} {
  const [sortDesc, setSortDesc] = useState(true);

  const recorded = ROSTER.filter((p) => session.rosterIds.includes(p.id))
    .map((p) => ({
      ...p,
      note: session.notes[p.id],
      rpe: session.scores[p.id],
    }))
    .filter((p): p is RecordedPlayer => p.rpe != null);

  const stats = useMemo(() => calcSessionStats(recorded), [recorded]);

  const sorted = [...recorded].sort((a, b) =>
    sortDesc ? b.rpe - a.rpe : a.rpe - b.rpe
  );

  const toggleSort = () => setSortDesc((d) => !d);

  const doExport = () => exportSessionXlsx(session.name, recorded);

  return { doExport, recorded, sortDesc, sorted, stats, toggleSort };
}
