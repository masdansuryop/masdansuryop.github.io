importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js')

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/service-worker.js', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/assets/pages/nav.html', revision: '1' },
    { url: '/assets/styles/materialize.min.css', revision: '1' },
    { url: '/assets/scripts/materialize.min.js', revision: '1' },
    { url: '/assets/scripts/moment.min.js', revision: '1' },
    { url: '/assets/styles/style.css', revision: '1' },
    { url: '/assets/scripts/jquery-3.5.1.min.js', revision: '1' },
])

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-stylesheets',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
)

workbox.routing.registerRoute(
  new RegExp('/assets/img/icon/'),
  workbox.strategies.cacheFirst({
    cacheName: 'icons',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
)

workbox.routing.registerRoute(
  new RegExp('/assets/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
)

workbox.routing.registerRoute(
  new RegExp('/assets/scripts/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'scripts',
  })
)

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-data-api',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
)

self.addEventListener('push', function (event) {
  var body
  if (event.data) {
    body = event.data.text()
  } else {
    body = 'Push message no payload'
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  )
})
