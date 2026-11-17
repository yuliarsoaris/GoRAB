/* Service worker RAB Gedung: membuat aplikasi bisa dibuka tanpa internet. Naikkan VERSI setiap kali file aplikasi diganti. */
var VERSI = 'rab-gedung-v50';
var FILE = ['./', 'index.html', 'pdf-lib.min.js', 'jszip.min.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSI).then(function (c) { return c.addAll(FILE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate') {
    /* halaman: coba jaringan dulu supaya versi baru langsung terpakai, cadangannya dari simpanan */
    e.respondWith(fetch(r).then(function (res) { var cp = res.clone(); caches.open(VERSI).then(function (c) { c.put('index.html', cp); }); return res; }).catch(function () { return caches.match('index.html'); }));
    return;
  }
  e.respondWith(caches.match(r).then(function (hit) { return hit || fetch(r).then(function (res) { var cp = res.clone(); caches.open(VERSI).then(function (c) { c.put(r, cp); }); return res; }); }));
});
