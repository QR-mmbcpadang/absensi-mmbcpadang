const CACHE_NAME = "MMBC-PADANG-v1.0.1";

self.addEventListener("install", (event) => {
    console.log("Service Worker Installed");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated");
    event.waitUntil(
        self.clients.claim()
    );
});

self.addEventListener("fetch", (event) => {
    // Selalu ambil data langsung dari server (Network-Only) 
    // agar file dan data absen selalu yang terbaru tanpa nyangkut di cache.
    event.respondWith(
        fetch(event.request).catch(() => {
            // Opsional: Bisa diarahkan ke halaman fallback offline jika diperlukan nanti
            return caches.match(event.request);
        })
    );
});
