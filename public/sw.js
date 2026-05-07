const CACHE = "rpe-shka-v3";

// Pre-cache shells for static routes plus one sentinel per dynamic route pattern.
// Dynamic-route HTMLs are id-agnostic (page components read the URL post-mount),
// so a single cached shell per pattern is enough to satisfy any /microcycles/X
// or /sessions/X navigation when offline — including microcycles created offline.
const PRECACHE_URLS = [
  "/",
  "/settings",
  "/microcycles/0",
  "/microcycles/0/report",
  "/sessions/0",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
      )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Map a navigation pathname to the exact pre-cached shell URL for its route
// family. Order matters: the report pattern must be tested before the
// microcycle-detail pattern (the latter would otherwise also match the report
// URL since it has `/microcycles/` + digits as a prefix).
const REPORT_ROUTE = /^\/microcycles\/\d+\/report\/?$/;
const MICROCYCLE_ROUTE = /^\/microcycles\/\d+\/?$/;
const SESSION_ROUTE = /^\/sessions\/\d+\/?$/;

async function matchRouteShell(pathname) {
  let shellUrl;
  if (REPORT_ROUTE.test(pathname)) {
    shellUrl = "/microcycles/0/report";
  } else if (MICROCYCLE_ROUTE.test(pathname)) {
    shellUrl = "/microcycles/0";
  } else if (SESSION_ROUTE.test(pathname)) {
    shellUrl = "/sessions/0";
  } else {
    return null;
  }
  const cache = await caches.open(CACHE);
  return cache.match(shellUrl, { ignoreVary: true });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== location.origin) {
    return;
  }

  // Cache-first for immutable versioned assets
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request, { ignoreVary: true }).then((hit) => {
        if (hit) {
          return hit;
        }
        return fetch(request).then((res) => {
          const clone = res.clone();
          if (res.ok) {
            caches.open(CACHE).then((c) => c.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        if (res.ok) {
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(async () => {
        // Exact URL match (handles previously visited pages and RSC payloads)
        const exact = await caches.match(request, { ignoreVary: true });
        if (exact) {
          return exact;
        }

        // RSC miss: return 503 so Next.js triggers browser-navigation fallback.
        // Never serve HTML as an RSC response — that causes the raw JSON display.
        if (url.searchParams.has("_rsc")) {
          return new Response("", { status: 503 });
        }

        // Navigation miss: serve a cached HTML shell for the same route family.
        // Pages read the actual id from window.location post-mount, so any cached
        // shell of the same pattern hydrates correctly at the new URL.
        if (request.mode === "navigate") {
          const routeShell = await matchRouteShell(url.pathname);
          if (routeShell) {
            return routeShell;
          }
          const home = await caches.match("/", { ignoreVary: true });
          return home ?? new Response("Offline", { status: 503 });
        }

        return new Response("", { status: 503 });
      })
  );
});
