// Service Worker — Zoonoses Jandira v3
// Não faz cache — sempre busca versão mais recente

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Só intercepta requisições do próprio domínio
// Requisições externas (ViaCEP, Supabase) passam direto
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // Deixar passar: APIs externas
  if(!url.hostname.includes('github.io')){
    return; // Não interceptar — vai direto para a rede
  }

  // Para arquivos do próprio app: sempre busca na rede
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
