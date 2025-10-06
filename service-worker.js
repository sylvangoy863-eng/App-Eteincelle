const CACHE_NAME = 'etincelle-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    // Ajoutez ici les chemins de vos icônes
    '/image/icon-192x192.png', 
    '/image/icon-512x512.png',
    // Tailwind CSS est chargé depuis un CDN, donc pas besoin de le cacher.
];

// Installation : Mise en cache des ressources statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Ouverture du cache et mise en cache des URLs...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation : Suppression des anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch : Servir les actifs mis en cache en premier
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retourner la réponse du cache
        if (response) {
          return response;
        }
        // Aucune correspondance dans le cache - récupérer à partir du réseau
        return fetch(event.request);
      }
    )
  );

});
