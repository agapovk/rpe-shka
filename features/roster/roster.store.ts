"use client";

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { Player } from "@/features/survey/survey.types";
import { ROSTER } from "@/features/survey/survey.utils";
import { idbStorage } from "@/lib/idb-storage";

interface RosterStore {
  addPlayer: (name: string, num: number) => void;
  players: Player[];
  removePlayer: (playerId: number) => void;
  updatePlayer: (
    playerId: number,
    patch: Partial<Pick<Player, "name" | "num">>
  ) => void;
}

export const useRosterStore = create<RosterStore>()(
  devtools(
    persist(
      (set, get) => ({
        players: ROSTER,

        addPlayer: (name, num) => {
          const players = get().players;
          const nextId =
            players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1;
          set((s) => ({
            players: [...s.players, { id: nextId, name, num }],
          }));
        },

        updatePlayer: (playerId, patch) => {
          set((s) => ({
            players: s.players.map((p) =>
              p.id === playerId ? { ...p, ...patch } : p
            ),
          }));
        },

        removePlayer: (playerId) => {
          set((s) => ({
            players: s.players.filter((p) => p.id !== playerId),
          }));
        },
      }),
      {
        name: "rpe-roster",
        storage: createJSONStorage(() => idbStorage),
      }
    ),
    { enabled: process.env.NODE_ENV === "development", name: "RosterStore" }
  )
);
