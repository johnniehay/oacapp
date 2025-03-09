'use client'

// declare const self as unknown as ServiceWorkerGlobalScope: ServiceWorkerGlobalScope;
const SWself = self as unknown as ServiceWorkerGlobalScope
SWself.addEventListener('push', function (event: PushEvent) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(SWself.registration.showNotification(data.title, options))
  }
})

SWself.addEventListener('notificationclick', function (event: NotificationEvent) {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(SWself.clients.openWindow('<https://dev.oac.cids.org.za/>'))
})