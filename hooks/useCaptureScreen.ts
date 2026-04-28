"use client";

import { useState } from "react";
import { suggestSessionName } from "@/features/session/session.utils";
import { useSurveyStore } from "@/features/survey/survey.store";
import type { Player, Session } from "@/features/survey/survey.types";
import { ROSTER } from "@/features/survey/survey.utils";

export type Filter = "all" | "done" | "pending";

export function useCaptureScreen(session: Session): {
  closeScore: () => void;
  done: number;
  editingRoster: boolean;
  filter: Filter;
  filtered: Player[];
  handleClear: () => void;
  handleNameBlur: (value: string) => void;
  handleNameChange: (value: string) => void;
  handleSave: (score: number, note: string) => void;
  handleToggleRoster: (id: number) => void;
  openPlayer: Player | null;
  openScore: (id: number) => void;
  pct: number;
  setEditingRoster: (v: boolean) => void;
  setFilter: (f: Filter) => void;
  total: number;
  visibleRoster: Player[];
} {
  const { clearScore, setScore, updateSession } = useSurveyStore();

  const [openId, setOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [editingRoster, setEditingRoster] = useState(false);

  const visibleRoster = ROSTER.filter((pl) =>
    session.rosterIds.includes(pl.id)
  );
  const done = visibleRoster.filter(
    (pl) => session.scores[pl.id] != null
  ).length;
  const total = visibleRoster.length;
  const pct = total ? (done / total) * 100 : 0;

  const openPlayer =
    openId == null ? null : (ROSTER.find((pl) => pl.id === openId) ?? null);

  const filtered = visibleRoster.filter((pl) => {
    if (filter === "pending") {
      return session.scores[pl.id] == null;
    }
    if (filter === "done") {
      return session.scores[pl.id] != null;
    }
    return true;
  });

  const openScore = (id: number) => setOpenId(id);
  const closeScore = () => setOpenId(null);

  const handleSave = (score: number, note: string) => {
    if (openId == null) {
      return;
    }
    setScore(session.id, openId, score, note);
    setOpenId(null);
  };

  const handleClear = () => {
    if (openId == null) {
      return;
    }
    clearScore(session.id, openId);
    setOpenId(null);
  };

  const handleToggleRoster = (id: number) => {
    const wasIn = session.rosterIds.includes(id);
    const rosterIds = wasIn
      ? session.rosterIds.filter((x) => x !== id)
      : [...session.rosterIds, id];
    updateSession(session.id, { rosterIds });
    if (wasIn && session.scores[id] != null) {
      clearScore(session.id, id);
    }
  };

  const handleNameChange = (value: string) =>
    updateSession(session.id, { name: value });

  const handleNameBlur = (value: string) => {
    if (!value.trim()) {
      updateSession(session.id, { name: suggestSessionName() });
    }
  };

  return {
    closeScore,
    done,
    editingRoster,
    filter,
    filtered,
    handleClear,
    handleNameBlur,
    handleNameChange,
    handleSave,
    handleToggleRoster,
    openPlayer,
    openScore,
    pct,
    setEditingRoster,
    setFilter,
    total,
    visibleRoster,
  };
}
