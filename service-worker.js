/**
 * Service Worker
 * 负责离线缓存和资源预加载
 */

const CACHE_NAME = 'time-memory-box-v3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './js/db.js',
    './js/musicTimeline.js',
    './js/sensors.js',
    './js/starfield.js',
    './js/vangoghSpiral.js',
    './js/clickPulse.js',
    './js/libs/howler.min.js',
    './js/libs/aframe.min.js',
    './img/no_photos.svg',
    './img/icon-192.png',
    './img/icon-512.png',
    './img/bg-pattern.svg',
    './img/music-wave.svg',
    './img/ar-icon.svg',
    './img/ar-qr-code.png',
    './img/canvas-texture.svg'
];

// 安装Service Worker并预缓存关键资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('预缓存资源中...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log(`删除旧缓存: ${name}`);
                        return caches.delete(name);
                    })
            );
        })
        .then(() => self.clients.claim())
    );
});

// 拦截网络请求，优先使用缓存
self.addEventListener('fetch', (event) => {
    // 跳过不支持缓存的请求（如IndexedDB操作）
    if (!event.request.url.startsWith('http')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果在缓存中找到响应，则返回缓存的响应
                if (response) {
                    return response;
                }
                
                // 否则发起网络请求
                return fetch(event.request).then((networkResponse) => {
                    // 检查响应是否有效
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    
                    // 克隆响应，因为响应是流，只能使用一次
                    const responseToCache = networkResponse.clone();
                    
                    // 将新响应添加到缓存
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return networkResponse;
                });
            })
            .catch(() => {
                // 如果网络请求失败且缓存中没有，返回离线页面
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                
                return new Response('离线模式，无法加载资源', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            })
    );
});

// 后台同步
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // 在这里处理数据同步逻辑
            console.log('执行后台数据同步')
        );
    }
});