const CACHE = "frases-pwa-v5"; // mude este nome a cada nova versão
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/imagem_icon_192x192.png",
  "./icons/imagem_icon_512x512.png"
];

// === Instalar e cachear ===
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// === Ativar e atualizar automaticamente ===
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    const clientsList = await clients.matchAll({ type: "window" });
    for (const client of clientsList) {
      client.postMessage({ type: "UPDATE_AVAILABLE" });
    }
  })());
});

// === Buscar do cache ===
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// === Clique na notificação ===
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow("./index.html"));
});

// === Periodic Background Sync ===
self.addEventListener("periodicsync", e => {
  if (e.tag === "frase-diaria") {
    e.waitUntil(enviarFraseDiaria());
  }
});

// === Função de envio da frase diária ===
async function enviarFraseDiaria() {
  const frases = [
    "Acredite em você e vá além! 🚀",
    "A disciplina vence o cansaço. 💪",
    "Hoje é o dia perfeito para começar! 🌟",
    "Você é capaz de mudar tudo! 🔥",
    "Um passo de cada vez. 🧭",
    "Persistência constrói resultados. 🏁",
    "A ação cura a dúvida. 🎯",
    "O impossível só existe até ser feito. ✨"
  ];
  const frase = frases[Math.floor(Math.random() * frases.length)];
  await self.registration.showNotification("Frase do Dia 🌞", {
    body: frase,
    icon: "icons/imagem_icon_192x192.png",
    badge: "icons/imagem_icon_96x96.png"
  });
}
