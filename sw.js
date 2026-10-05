// 兽魂 iPhone/iPad 离线版: 第一次打开时把整个游戏存进手机，之后优先用本机缓存(断网也能玩)
const CACHE = 'beastsoul-d12456d747';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.png', './icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith('beastsoul-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    const hit = await caches.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    if (e.request.mode === 'navigate') {
      const page = await caches.match('./index.html');
      if (page) return page;
    }
    return fetch(e.request);
  })());
});
