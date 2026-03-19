const CACHE = 'dayzen-v2'; // bump version on updates

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// INSTALL
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// ACTIVATE
self.addEventListener('activate', (e) => {
  self.clients.claim();
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
});

// FETCH
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 🔥 Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // 🔥 API → Network-first
  if (url.pathname.startsWith('/api')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // 🔥 Static → Cache-first (SAFE)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;

      return fetch(e.request)
        .then((res) => {
          // ❌ IMPORTANT FIX
          if (!res || res.status !== 200) return res;

          // ❌ Skip cross-origin / opaque responses
          if (res.type !== 'basic') return res;

          const clone = res.clone();

          caches.open(CACHE).then((cache) => {
            cache.put(e.request, clone).catch(() => {});
          });

          return res;
        })
        .catch(() => {
          // fallback for navigation
          if (e.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});