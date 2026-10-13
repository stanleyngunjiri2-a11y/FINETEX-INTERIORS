const CACHE_NAME = "finetex-public-v1";

const OFFLINE_URL = "/offline.html";

const PUBLIC_ASSETS = [
  "/",
  "/about",
  "/services",
  "/designs",
  "/gallery",
  "/contact",
  "/estimate",
  OFFLINE_URL,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PUBLIC_ASSETS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle normal GET requests.
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Only handle requests belonging to FINETEX.
  if (url.origin !== self.location.origin) {
    return;
  }

  // Never cache the admin area.
  if (url.pathname.startsWith("/admin")) {
    return;
  }

  // Never cache API/authentication/database requests.
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/auth")
  ) {
    return;
  }

  // HTML navigation:
  // Try the network first, then use the cache, then offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);

          return cachedResponse || caches.match(OFFLINE_URL);
        })
    );

    return;
  }

  // Static resources:
  // Use cache first, then network.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseClone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      });
    })
  );
});
