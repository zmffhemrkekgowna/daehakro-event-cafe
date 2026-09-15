const CACHE_NAME = 'daehakno-event-cafe-v1';
const CORE_ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything except the cached app shell,
  // so event data (Firestore) is never served stale from cache.
  const url = new URL(event.request.url);
  const isCoreAsset = CORE_ASSETS.some((asset) => url.pathname.endsWith(asset.replace('./', '/')));

  if (isCoreAsset) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
