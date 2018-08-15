currentCacheName = 'restaurant-reviews-app-v2'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCacheName)
    .then(cache => cache.addAll([
      './',
      './js/dbhelper.js',
      './js/main.js',
      './js/restaurant_info.js',
      './css/styles.css',
      './index.html',
      './restaurant.html'
    ]))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
        .filter(cacheName => cacheName.startsWith('restaurant-reviews-app-') && cacheName != currentCacheName)
        .map(cacheName => caches.delete(cacheName))
      );
    })
  )
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        //console.log(`${event.request.url} served from cache`);
        return response;
      }
      //console.log(`${event.request.url} didn't find in cache. Fetching from network and saving to cache`);
      return fetch(event.request)
        .then(resp => caches.open(currentCacheName)
          .then(cache => {
            cache.put(event.request, resp.clone());
            return resp;
          })
        );
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});