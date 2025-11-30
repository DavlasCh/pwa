const CACHE_NAME = "accesorios-moviles-v1";

const URLS_TO_CACHE = [
  "/pwa/",
  "/pwa/index.html",
  "/pwa/styles.css",
  "/pwa/app.js",
  "/pwa/manifest.json",
  // Imágenes
  "/pwa/Img/Imagen1.png",
  "/pwa/Img/charger.png",
  "/pwa/Img/earphone.png",
  "/pwa/Img/user-interface.png",
  "/pwa/Img/smartphone.png",
  "/pwa/Img/tempered-glass.png",
  // Íconos
  "/pwa/icons/icon-192x192.png",
  "/pwa/icons/icon-512x512.png"
];

// Instalación: cachear assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activación: limpiar caches viejos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch: estrategia cache-first sencilla
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en cache, lo usamos; si no, vamos a red
      return response || fetch(event.request);
    })
  );
});
