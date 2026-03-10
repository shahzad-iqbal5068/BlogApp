const CACHE_NAME = "blogapp-v1";
const STATIC_CACHE = "blogapp-static-v1";

const STATIC_ASSETS = ["/", "/blog", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  const isApi = url.pathname.startsWith("/api/");
  const isBlog = url.pathname.startsWith("/blog");
  const isStatic =
    url.pathname.match(/\.(js|css|png|jpg|ico|woff2?)$/) || url.pathname === "/";

  if (isApi && url.pathname.startsWith("/api/posts")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const res = await fetch(event.request);
          if (res.ok) cache.put(event.request, res.clone());
          return res;
        } catch {
          return cached || new Response('{"posts":[],"pagination":{"pages":0}}', {
            headers: { "Content-Type": "application/json" },
          });
        }
      })
    );
    return;
  }

  if (isBlog || isStatic) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          if (res.ok && (isBlog || isStatic))
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
