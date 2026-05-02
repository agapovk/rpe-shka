"use client";

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { idbStorage } from "@/lib/idb-storage";
import type { Category, Session } from "./survey.types";
import { DEFAULT_CATEGORIES } from "./survey.utils";

interface SurveyStore {
  addCategory: (name: string) => void;
  categories: Category[];
  clearScore: (sessionId: string, playerId: number) => void;
  createSession: (name: string, rosterIds: number[]) => string;
  deleteSession: (id: string) => void;
  duplicateSession: (id: string) => string | undefined;
  ensureSession: (id: string, name: string, rosterIds: number[]) => void;
  getSession: (id: string) => Session | undefined;
  removeCategory: (categoryId: string) => void;
  sessions: Session[];
  setScore: (
    sessionId: string,
    playerId: number,
    score: number,
    note: string
  ) => void;
  updateCategory: (categoryId: string, name: string) => void;
  updateSession: (
    id: string,
    patch: Partial<Pick<Session, "categoryId" | "name" | "rosterIds">>
  ) => void;
}

export const useSurveyStore = create<SurveyStore>()(
  devtools(
    persist(
      (set, get) => ({
        categories: DEFAULT_CATEGORIES,
        sessions: [],

        createSession: (name, rosterIds) => {
          const id = crypto.randomUUID();
          const session: Session = {
            date: new Date().toISOString(),
            id,
            name,
            notes: {},
            rosterIds,
            scores: {},
          };
          set((s) => ({ sessions: [...s.sessions, session] }));
          return id;
        },

        ensureSession: (id, name, rosterIds) => {
          if (get().sessions.some((s) => s.id === id)) {
            return;
          }
          const session: Session = {
            date: new Date().toISOString(),
            id,
            name,
            notes: {},
            rosterIds,
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

        duplicateSession: (id) => {
          const source = get().sessions.find((s) => s.id === id);
          if (!source) {
            return;
          }
          const newId = crypto.randomUUID();
          const session: Session = {
            categoryId: source.categoryId,
            date: new Date().toISOString(),
            id: newId,
            name: source.name,
            notes: {},
            rosterIds: [...source.rosterIds],
            scores: {},
          };
          set((s) => ({ sessions: [...s.sessions, session] }));
          return newId;
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

        addCategory: (name) => {
          set((s) => ({
            categories: [...s.categories, { id: crypto.randomUUID(), name }],
          }));
        },

        updateCategory: (categoryId, name) => {
          set((s) => ({
            categories: s.categories.map((c) =>
              c.id === categoryId ? { ...c, name } : c
            ),
          }));
        },

        removeCategory: (categoryId) => {
          set((s) => ({
            categories: s.categories.filter((c) => c.id !== categoryId),
          }));
        },
      }),
      {
        name: "rpe-storage",
        partialize: ({ categories, sessions }) => ({ categories, sessions }),
        storage: createJSONStorage(() => idbStorage),
      }
    ),
    { enabled: process.env.NODE_ENV === "development", name: "SurveyStore" }
  )
);
