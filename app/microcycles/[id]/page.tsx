"use client";

import { MicrocycleView } from "@views/microcycle";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MICROCYCLE_PATH = /^\/microcycles\/(\d+)\/?$/;

export default function MicrocyclePage() {
  const pathname = usePathname();
  const [id, setId] = useState<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on client-side nav; we read window.location to override stale SSR'd pathname when SW serves a fallback shell
  useEffect(() => {
    const match = window.location.pathname.match(MICROCYCLE_PATH);
    setId(match ? Number(match[1]) : null);
  }, [pathname]);

  if (id === null) {
    return null;
  }
  return <MicrocycleView microcycleId={id} />;
}
