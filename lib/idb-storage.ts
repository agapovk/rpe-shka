import { del, get, set } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const idbValue = await get<string>(name);
    if (idbValue !== undefined) {
      return idbValue;
    }

    // One-time migration from localStorage
    if (typeof window === "undefined") {
      return null;
    }
    const lsValue = localStorage.getItem(name);
    if (lsValue !== null) {
      await set(name, lsValue);
      localStorage.removeItem(name);
      return lsValue;
    }

    return null;
  },

  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },

  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
