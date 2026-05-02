"use client";

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { idbStorage } from "@/lib/idb-storage";
import type { Session } from "./survey.types";
import { ROSTER } from "./survey.utils";

interface SurveyStore {
  clearScore: (sessionId: string, playerId: number) => void;
  createSession: (name: string) => string;
  deleteSession: (id: string) => void;
  ensureSession: (id: string, name: string) => void;
  getSession: (id: string) => Session | undefined;
  sessions: Session[];
  setScore: (
    sessionId: string,
    playerId: number,
    score: number,
    note: string
  ) => void;
  updateSession: (
    id: string,
    patch: Partial<Pick<Session, "name" | "rosterIds">>
  ) => void;
}

export const useSurveyStore = create<SurveyStore>()(
  devtools(
    persist(
      (set, get) => ({
        sessions: [],

        createSession: (name) => {
          const id = crypto.randomUUID();
          const session: Session = {
            date: new Date().toISOString(),
            id,
            name,
            notes: {},
            rosterIds: ROSTER.map((p) => p.id),
            scores: {},
          };
          set((s) => ({ sessions: [...s.sessions, session] }));
          return id;
        },

        ensureSession: (id, name) => {
          if (get().sessions.some((s) => s.id === id)) {
            return;
          }
          const session: Session = {
            date: new Date().toISOString(),
            id,
            name,
            notes: {},
            rosterIds: ROSTER.map((p) => p.id),
            scores: {},
          };
          set((s) => ({ sessions: [...s.sessions, session] }));
        },

        updateSession: (id, patch) => {
          set((s) => ({
            sessions: s.sessions.map((session) =>
              session.id === id ? { ...session, ...patch } : session
            ),
          }));
        },

        setScore: (sessionId, playerId, score, note) => {
          set((s) => ({
            sessions: s.sessions.map((session) =>
              session.id === sessionId
                ? {
                    ...session,
                    notes: { ...session.notes, [playerId]: note },
                    scores: { ...session.scores, [playerId]: score },
                  }
                : session
            ),
          }));
        },

        clearScore: (sessionId, playerId) => {
          set((s) => ({
            sessions: s.sessions.map((session) => {
              if (session.id !== sessionId) {
                return session;
              }
              const { [playerId]: _s, ...scores } = session.scores;
              const { [playerId]: _n, ...notes } = session.notes;
              return { ...session, notes, scores };
            }),
          }));
        },

        deleteSession: (id) => {
          set((s) => ({
            sessions: s.sessions.filter((session) => session.id !== id),
          }));
        },

        getSession: (id) => get().sessions.find((s) => s.id === id),
      }),
      {
        name: "rpe-storage",
        partialize: ({ sessions }) => ({ sessions }),
        storage: createJSONStorage(() => idbStorage),
      }
    ),
    { enabled: process.env.NODE_ENV === "development", name: "SurveyStore" }
  )
);
