const CACHE = 'calc-pwa-v3';
const APP_PATH = '/calculadora-pwa/';

const ASSETS = [
  APP_PATH,
  APP_PATH + 'index.html',
  APP_PATH + 'manifest.json',
  APP_PATH + 'icons/icon-192.png',
  APP_PATH + 'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith(APP_PATH)) {
    e.respondWith(
      caches.match(e.request).then(res =>
        res || fetch(e.request).then(net => {
          caches.open(CACHE).then(c => c.put(e.request, net.clone()));
          return net;
        })
      )
    );
  }
});
