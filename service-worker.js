const CACHE_NAME = "conversor-pwa-v3";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/imagem_icon_192x192.png",
  "./icons/imagem_icon_512x512.png"
];

// Instalação e cache inicial
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Cache inicial criado!");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação (limpa caches antigos)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  console.log("♻️ Service Worker ativo e limpo!");
  return self.clients.claim();
});

// Fetch: responde com cache ou rede + fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("./index.html"))
      );
    })
  );
});
