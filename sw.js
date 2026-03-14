const CACHE_NAME = "ge-ix-pos-v2";

// Files to cache for offline use
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./pos.html",

  "./assets/js/config.js",
  "./assets/js/auth.js",
  "./assets/js/pos.js",
  "./assets/js/api.js",

  "./assets/vendor/jquery.min.js",
  "./assets/vendor/bootstrap.bundle.min.js",
  "./assets/vendor/bootstrap.min.css",
  "./assets/vendor/bootstrap-icons.css",
  "./assets/vendor/toastr.min.js",
  "./assets/vendor/toastr.min.css",

  "./assets/vendor/fonts/bootstrap-icons.woff",
  "./assets/vendor/fonts/bootstrap-icons.woff2",

  "./assets/images/logo.png"
];

// Install event: cache files
self.addEventListener("install", event => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        FILES_TO_CACHE.map(file =>
          cache.add(file).catch(err => console.warn("[SW] Failed to cache:", file))
        )
      )
    )
  );
  self.skipWaiting();
});

// Activate event: remove old caches
self.addEventListener("activate", event => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve cached assets, fallback gracefully
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Serve cached response if available
      if (cachedResponse) return cachedResponse;

      // Try network fetch
      return fetch(event.request)
        .then(networkResponse => networkResponse)
        .catch(() => {
          // Fallbacks
          if (event.request.mode === "navigate") {
            // SPA / navigation requests → serve index.html
            return caches.match("./index.html");
          } else if (event.request.destination === "image") {
            // For images → return a tiny transparent png
            return new Response(
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABBAEAHn5l1gAAAABJRU5ErkJggg==',
              {
                headers: { "Content-Type": "image/png" },
                status: 200,
                statusText: "offline-placeholder"
              }
            );
          } else {
            // For JS/CSS/fonts → return empty Response
            return new Response("", { status: 200, statusText: "offline-fallback" });
          }
        });
    })
  );
});
