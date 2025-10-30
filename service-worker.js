const CACHE_NAME = "conversor-pwa-v5";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/imagem_icon_192x192.png",
  "./icons/imagem_icon_512x512.png"
];

// Instalação e cache inicial
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Resposta offline (fallback para index)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request).catch(() => caches.match("./index.html")))
  );
});
