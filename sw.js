const CACHE_NAME = "mypayindia-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/app/stylesheets/main.css",
  "/app/stylesheets/views.css",
  "/app/scripts/app.js",
  "/app/scripts/api.js",
  "/app/scripts/menu.js",
  "/app/scripts/theme.js",
  "/app/scripts/devmode.js",
  "/app/scripts/quickActions.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});
