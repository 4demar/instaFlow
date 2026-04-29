const CACHE_NAME = 'instaflow-v1'
const ASSETS_PARA_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
]

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_PARA_CACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET') return

  evento.respondWith(
    caches.match(evento.request).then((respostaCache) => {
      if (respostaCache) return respostaCache

      return fetch(evento.request)
        .then((resposta) => {
          if (!resposta || resposta.status !== 200 || resposta.type !== 'basic') {
            return resposta
          }
          const respostaClone = resposta.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(evento.request, respostaClone)
          })
          return resposta
        })
        .catch(() => {
          if (evento.request.destination === 'document') {
            return caches.match('/')
          }
          return new Response('Offline', { status: 503 })
        })
    })
  )
})
