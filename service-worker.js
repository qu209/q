self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('push', e => {
  let data = {};
  try {
    data = e.data ? e.data.json() : {};
  } catch(err) {
    data = { title: '新消息', body: e.data ? e.data.text() : '' };
  }

  const title = data.title || '新消息';
  const options = {
    body: data.body || data.message || '',
    icon: 'https://i.postimg.cc/8Pgm5B6w/IMG-5211.png',
    badge: 'https://i.postimg.cc/8Pgm5B6w/IMG-5211.png',
    tag: data.taskId ? 'task-' + data.taskId + '-' + (data.messageIndex || 0) : 'msg-' + Date.now(),
    data: data
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    if (list.length > 0) return list[0].focus();
    return clients.openWindow('/');
  }));
});
