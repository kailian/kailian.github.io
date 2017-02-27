// You have to supply a name for your cache, this will
// allow us to remove an old one to avoid hitting disk
// space limits and displaying old resources
var cacheName = 'v1';

// Assesto catche
var assetsToCache = [
  '/assets/themes/twitter/bootstrap/css/bootstrap.css',
  '/assets/themes/twitter/bootstrap/js/bootstrap.min.js',
  '/assets/themes/twitter/css/style.css',
  '/assets/themes/twitter/js/jquery.js'
];

self.addEventListener('install', function(event) {
  // waitUntil() ensures that the Service Worker will not
  // install until the code inside has successfully occurred
  event.waitUntil(
    // Create cache with the name supplied above and
    // return a promise for it
    caches.open(cacheName).then(function(cache) {
        // Important to `return` the promise here to have `skipWaiting()`
        // fire after the cache has been updated.
        return cache.addAll(assetsToCache);
    }).then(function() {
      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      return self.skipWaiting();
    })
  );
});

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', function(event) {
  // `claim()` sets this worker as the active worker for all clients that
  // match the workers scope and triggers an `oncontrollerchange` event for
  // the clients.
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Get current path
  var requestUrl = new URL(event.request.url);
  // Save all resources on origin path only
  if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
      event.respondWith(
        // Open the cache created when install
        caches.open(cacheName).then(function(cache) {
          // Go to the network to ask for that resource
          return fetch(event.request).then(function(networkResponse) {
            // Add a copy of the response to the cache (updating the old version)
            cache.put(event.request, networkResponse.clone());
            // Respond with it
            return networkResponse;
          }).catch(function() {
            // If there is no internet connection, try to match the request
            // to some of our cached resources
            return cache.match(event.request);
          });
        })
      );
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
