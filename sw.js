const CACHE_NAME = "accesorios-moviles-runtime-v1";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./Img/Imagen1.png",
  "./Img/charger.png",
  "./Img/earphone.png",
  "./Img/user-interface.png",
  "./Img/smartphone.png",
  "./Img/tempered-glass.png",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png"
];

// Instalación: precache de la “cáscara” de la app
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activación: limpiar caches viejos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: estrategia network-first con fallback a cache
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // No tocar peticiones externas (Firebase, CDNs, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Solo cacheamos GET
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Si la red responde, guardamos copia en cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Si no hay red, intentamos responder desde el cache
        return caches.match(request);
      })
  );
});