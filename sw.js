const CACHE_NAME = "accesorios-moviles-v1";

const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  // Imágenes de productos
  "./Img/Imagen1.png",
  "./Img/charger.png",
  "./Img/earphone.png",
  "./Img/user-interface.png",
  "./Img/smartphone.png",
  "./Img/tempered-glass.png",
  // Manifest e íconos
  "./manifest.json",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-144x144.png",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png"
];

// Instalar y cachear recursos iniciales
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activar y limpiar caches viejos
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

// Interceptar requests y responder desde cache si existe
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en cache, lo devuelve, si no, va a red
      return response || fetch(event.request);
    })
  );
});