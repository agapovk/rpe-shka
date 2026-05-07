"use client";

import { useEffect } from "react";
import { OFFLINE_READY_EVENT } from "@/src/shared/ui/offline-ready-toast";

const PRECACHE_ROUTES = [
  "/",
  "/settings",
  "/microcycles/0",
  "/microcycles/0/report",
  "/sessions/0",
];

const ASSET_PATTERN = /\/_next\/static\/[^"'\s<>)]+/g;

export function RegisterPWA() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => warmCache())
      .catch(() => {
        // SW registration failures (e.g. unsupported browser) are non-fatal
      });
  }, []);
  return null;
}

// Fetches every route shell plus the JS/CSS/font chunks they reference so the
// SW caches the full set on first online load. Without this, only routes the
// user actually visited online would work offline — a microcycle created
// offline could navigate to a route whose JS chunks were never fetched.
async function warmCache() {
  if (!navigator.onLine) {
    return;
  }
  await navigator.serviceWorker.ready;

  const htmls = await Promise.all(
    PRECACHE_ROUTES.map((url) =>
      fetch(url, { cache: "reload" })
        .then((r) => (r.ok ? r.text() : ""))
        .catch(() => "")
    )
  );

  const assets = new Set<string>();
  for (const html of htmls) {
    for (const match of html.matchAll(ASSET_PATTERN)) {
      assets.add(match[0]);
    }
  }

  await Promise.allSettled(
    Array.from(assets).map((url) => fetch(url).catch(() => null))
  );

  window.dispatchEvent(new CustomEvent(OFFLINE_READY_EVENT));
}
