self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("img-converter-v3").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.webmanifest",
        "./icons/imagem_icon_192x192.png",
        "./icons/imagem_icon_512x512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});