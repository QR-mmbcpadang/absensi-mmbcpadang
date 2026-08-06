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

    // Untuk saat ini biarkan request langsung ke server
    // Tidak melakukan cache agar selalu memakai file terbaru.

});
