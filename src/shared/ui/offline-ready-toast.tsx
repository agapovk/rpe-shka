"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export const OFFLINE_READY_EVENT = "rpe-shka:offline-ready";
const STORAGE_KEY = "rpe-shka:offline-ready-ack";
const VISIBLE_MS = 4000;

export function OfflineReadyToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onReady() {
      try {
        if (localStorage.getItem(STORAGE_KEY) === "1") {
          return;
        }
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // localStorage may be unavailable; show toast anyway
      }
      setShow(true);
    }
    window.addEventListener(OFFLINE_READY_EVENT, onReady);
    return () => window.removeEventListener(OFFLINE_READY_EVENT, onReady);
  }, []);

  useEffect(() => {
    if (!show) {
      return;
    }
    const t = setTimeout(() => setShow(false), VISIBLE_MS);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) {
    return null;
  }
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-default bg-elevated px-4 py-2 text-primary text-sm shadow-lg">
      <Check className="h-4 w-4" />
      Ready for offline use
    </div>
  );
}
