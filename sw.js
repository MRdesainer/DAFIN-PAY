// Service Worker - DAFIN-PAY
// Ganti "CACHE" versi di bawah ini setiap kali Anda memperbarui app
// agar pengguna mendapat versi baru (cache ikut ter-refresh).
const CACHE = 'dafinpay-v34';

const PRECACHE = [
    './index.html',
    './kasir.html',
    './wali.html',
    './config.js',
    './manifest.json',
    './manifest-kasir.json',
    './manifest-wali.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './suara-sukses.mp3'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(PRECACHE))
            .catch(() => {})
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const url = e.request.url;
    // Jangan cache request ke Firebase/gstatic (data & SDK selalu ambil terbaru)
    if (url.indexOf('firebase') !== -1 || url.indexOf('gstatic.com') !== -1) return;
    // Halaman (navigasi): ambil dari server dulu agar selalu versi terbaru,
    // fallback ke cache hanya saat offline.
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, copy));
                    return res;
                })
                .catch(() => caches.match(e.request))
        );
        return;
    }
    e.respondWith(
        caches.match(e.request).then(cached => {
            const fetchPromise = fetch(e.request)
                .then(res => {
                    if (res && res.ok && e.request.method === 'GET') {
                        const copy = res.clone();
                        caches.open(CACHE).then(c => c.put(e.request, copy));
                    }
                    return res;
                })
                .catch(() => cached);
            return cached || fetchPromise;
        })
    );
});
