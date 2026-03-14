const CACHE_NAME = "gix-ix-bbs-app";

const FILES_TO_CACHE = [

"./",
"./index.html",
"./pos.html",

"./assets/js/config.js",
"./assets/js/auth.js",
"./assets/js/pos.js",

"./assets/vendor/jquery.min.js",
"./assets/vendor/bootstrap.bundle.min.js",
"./assets/vendor/bootstrap.min.css",
"./assets/vendor/toastr.min.js",
"./assets/vendor/toastr.min.css",
"./assets/vendor/bootstrap-icons.css",

"./assets/vendor/fonts/bootstrap-icons.woff",
"./assets/vendor/fonts/bootstrap-icons.woff2",

"./assets/images/logo.png"

];

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME).then(cache => {

return Promise.all(

FILES_TO_CACHE.map(file => {

return cache.add(file).catch(err => {
console.warn("Failed to cache:", file);
});

})

);

})

);

});

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request).then(response => {

return response || fetch(event.request);

})

);

});
