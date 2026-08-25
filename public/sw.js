// Bump this on any deploy that needs to force already-installed clients to
// pick up fresh content (see the controllerchange reload in src/main.js) -
// the browser only re-checks for updates when this file's bytes change.
const VERSION = 2;

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
