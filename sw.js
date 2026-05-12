const CACHE_NAME = 'travelnest-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/explorer.html',
    '/budget.html',
    '/random.html',
    '/mood.html',
    '/feedback.html',
    '/style.css',
    '/script.js',
    '/countries.json',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching assets');
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request);
        })
    );
});
