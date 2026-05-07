"use client";

import { SessionView } from "@views/session";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SESSION_PATH = /^\/sessions\/(\d+)\/?$/;

export default function SessionPage() {
  const pathname = usePathname();
  const [id, setId] = useState<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on client-side nav; we read window.location to override stale SSR'd pathname when SW serves a fallback shell
  useEffect(() => {
    const match = window.location.pathname.match(SESSION_PATH);
    setId(match ? Number(match[1]) : null);
  }, [pathname]);

  if (id === null) {
    return null;
  }
  return <SessionView sessionId={id} />;
}
