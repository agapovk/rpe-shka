"use client";

import { useEffect, useState } from "react";

// Returns false on the server and on the first client render,
// true after mount — by which point localStorage has been read by Zustand.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
