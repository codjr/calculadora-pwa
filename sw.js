const CACHE = 'calc-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './firebase-config.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(res=>res||fetch(e.request).then(net=>{
      caches.open(CACHE).then(c=>c.put(e.request,net.clone()));
      return net;
    }).catch(()=>caches.match('./index.html')))
  );
});
