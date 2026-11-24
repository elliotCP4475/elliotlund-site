// The Lund Cabin: offline support.
const V = 'lund-v7';
const CORE = ['./', 'index.html', 'cabin-map.geojson', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'lake-depth.jpg', 'stove-damper.jpg', 'stove-air.jpg', 'stove-handle.jpg', 'stove-door.jpg', 'stove-ash.jpg', 'fish-video.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'];
const TILES = ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/11657/8201", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/11658/8201", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/11657/8202", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/11658/8202", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23314/16403", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23315/16403", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23316/16403", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23314/16404", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23315/16404", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23316/16404", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23314/16405", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23315/16405", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/23316/16405", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46629/32806", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46630/32806", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46631/32806", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46632/32806", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46629/32807", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46630/32807", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46631/32807", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46632/32807", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46629/32808", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46630/32808", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46631/32808", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46632/32808", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46629/32809", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46630/32809", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46631/32809", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46632/32809", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46629/32810", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46630/32810", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46631/32810", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/46632/32810", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93259/65613", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93260/65613", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93261/65613", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93262/65613", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93263/65613", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93264/65613", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93259/65614", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93260/65614", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93261/65614", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93262/65614", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93263/65614", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93264/65614", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93259/65615", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93260/65615", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93261/65615", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93262/65615", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93263/65615", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93264/65615", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93259/65616", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93260/65616", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93261/65616", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93262/65616", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93263/65616", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93264/65616", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93259/65617", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93260/65617", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93261/65617", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93262/65617", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93263/65617", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93264/65617", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93259/65618", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93260/65618", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93261/65618", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93262/65618", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93263/65618", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93264/65618", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93259/65619", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93260/65619", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93261/65619", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93262/65619", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93263/65619", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93264/65619", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93259/65620", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93260/65620", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93261/65620", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93262/65620", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93263/65620", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/93264/65620"];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await Promise.all(CORE.map(u => c.add(new Request(u, {cache:'reload'})).catch(() => {})));
    const t = await caches.open('lund-tiles');
    Promise.all(TILES.map(u => t.match(u).then(hit => hit || fetch(u, {mode:'no-cors'}).then(r => t.put(u, r)).catch(() => {}))));
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('lund-v') && k !== V) await caches.delete(k);
    await self.clients.claim();
  })());
});

// Network first, fall back to the last copy we saved.
async function netFirst(req, cacheName, key){
  const c = await caches.open(cacheName);
  key = key || req;
  try {
    const r = await fetch(req);
    if (r && (r.ok || r.type === 'opaque')) c.put(key, r.clone());
    return r;
  } catch(err){
    const hit = await c.match(key, {ignoreSearch: req.mode === 'navigate'});
    if (hit) return hit;
    if (req.mode === 'navigate') { const idx = await c.match('index.html'); if (idx) return idx; }
    throw err;
  }
}
// Cache first, refresh in the background.
async function cacheFirst(req, cacheName){
  const c = await caches.open(cacheName);
  const hit = await c.match(req);
  const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
  return hit || (await net) || Response.error();
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.hostname.endsWith('webcam.io')) return;                                   // live cam: never cached
  if (req.mode === 'navigate' || (u.origin === location.origin && /\/cabin\/(index\.html)?$/.test(u.pathname)))
    return e.respondWith(netFirst(req, V));
  if (u.origin === location.origin && u.pathname.endsWith('.geojson')) return e.respondWith(netFirst(req, V));
  if (u.hostname.includes('script.google') || u.hostname.includes('googleusercontent') || u.hostname.includes('open-meteo') || u.hostname.includes('swpc.noaa.gov'))
    return e.respondWith(netFirst(req, 'lund-data', u.hostname.includes('script.google') ? u.origin + u.pathname : req));                            // lists and weather: last known copy offline
  if (u.hostname.includes('arcgisonline') || u.hostname.includes('tile.openstreetmap'))
    return e.respondWith(cacheFirst(req, 'lund-tiles'));
  if (u.origin === location.origin || u.hostname.includes('cdnjs') || u.hostname.includes('fonts.g') || u.hostname.includes('drive.google'))
    return e.respondWith(cacheFirst(req, V));
});
