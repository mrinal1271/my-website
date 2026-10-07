// PWA সার্ভিস ওয়ার্কার: স্ট্যাটিক ফাইল ক্যাশ, Firebase/API রিকোয়েস্ট সরাসরি নেটওয়ার্কে
const C = 'community-v1', FILES = ['/my-website/', '/my-website/index.html', '/my-website/manifest.json', '/my-website/icon-192.png', '/my-website/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); return res; }).catch(() => caches.match(r)));
});
