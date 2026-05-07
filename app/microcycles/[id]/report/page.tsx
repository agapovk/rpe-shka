"use client";

import { MicrocycleReportView } from "@views/microcycle-report";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const REPORT_PATH = /^\/microcycles\/(\d+)\/report\/?$/;

export default function MicrocycleReportPage() {
  const pathname = usePathname();
  const [id, setId] = useState<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on client-side nav; we read window.location to override stale SSR'd pathname when SW serves a fallback shell
  useEffect(() => {
    const match = window.location.pathname.match(REPORT_PATH);
    setId(match ? Number(match[1]) : null);
  }, [pathname]);

  if (id === null) {
    return null;
  }
  return <MicrocycleReportView microcycleId={id} />;
}
