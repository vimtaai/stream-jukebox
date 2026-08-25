self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// No offline caching is implemented — this service worker exists solely to
// satisfy PWA installability requirements (Chrome/Android require a
// registered fetch handler for a site to be installable).
self.addEventListener("fetch", () => {});
