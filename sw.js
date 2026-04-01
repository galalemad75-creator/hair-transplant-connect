// Hair Transplant Connect — Service Worker v4
// Force clear ALL old caches and never cache
var CACHE_NAME = 'htc-v4';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) { return caches.delete(name); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Always fetch from network, never from cache
  event.respondWith(
    fetch(event.request).then(function(response) {
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
