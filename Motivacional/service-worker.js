const CACHE="frases-pwa-v3";
const ASSETS=[
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/imagem_icon_48x48.png",
  "./icons/imagem_icon_72x72.png",
  "./icons/imagem_icon_96x96.png",
  "./icons/imagem_icon_128x128.png",
  "./icons/imagem_icon_144x144.png",
  "./icons/imagem_icon_152x152.png",
  "./icons/imagem_icon_192x192.png",
  "./icons/imagem_icon_256x256.png",
  "./icons/imagem_icon_384x384.png",
  "./icons/imagem_icon_512x512.png"
];

// Instalação do cache
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

// Busca do cache
self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(resp=>resp||fetch(e.request))
  );
});

// Atualização de cache
self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Clique em notificação
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  e.waitUntil(clients.openWindow("./index.html"));
});
