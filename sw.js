const CACHE_NAME = "ge-ix-pos-v1";

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

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        FILES_TO_CACHE.map(file =>
          cache.add(file).catch(err => console.warn("Failed to cache:", file))
        )
      ))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // fallback to index.html for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      })
  );
});
