// ═══════════════════════════════════════════════════
// SERVICE WORKER — Zoonoses Jandira
// Versão: 1.0
// ═══════════════════════════════════════════════════

const CACHE_NAME = 'zoonoses-jandira-v2';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// INSTALAÇÃO — salva arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Arquivos em cache');
      return cache.addAll(ARQUIVOS);
    })
  );
  self.skipWaiting();
});

// ATIVAÇÃO — limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// FETCH — responde com cache quando offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Salva no cache se for uma requisição válida
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        // Offline: retorna o index.html como fallback
        return caches.match('./index.html');
      });
    })
  );
});
