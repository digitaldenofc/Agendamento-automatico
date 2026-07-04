// ============================================================
// SERVICE WORKER — Gislaine Cristina • Agenda Mágica (PWA)
// Estratégia: Cache-First para assets estáticos,
//             Network-First para chamadas do Firebase/API
// ============================================================

const CACHE_NAME = 'agenda-magica-v1';

// Recursos essenciais que devem ficar no cache imediatamente
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './images/capa.png',
    './images/perfil.png',
    './images/icons/icon.svg',
    // CDN — Tailwind e FontAwesome (opcionais, mas melhoram a experiência offline)
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// ─── INSTALL ─────────────────────────────────────────────────
// Pré-cacheia os recursos essenciais na primeira instalação
// Cada recurso é cacheado individualmente para que uma falha não bloqueie as demais
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                console.log('[SW] Cacheando recursos essenciais...');
                for (const url of ASSETS_TO_CACHE) {
                    try {
                        await cache.add(url);
                    } catch (err) {
                        console.warn(`[SW] Não foi possível cachear: ${url}`, err);
                    }
                }
            })
            .then(() => self.skipWaiting()) // Ativa imediatamente
    );
});

// ─── ACTIVATE ────────────────────────────────────────────────
// Limpa caches antigos ao ativar uma nova versão
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker ativado.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Removendo cache antigo:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim()) // Toma controle de todas as abas abertas
    );
});

// ─── FETCH ───────────────────────────────────────────────────
// Estratégia inteligente:
//   • Firebase / APIs externas → Network-First (tenta rede, fallback no cache)
//   • Assets estáticos → Cache-First (usa cache, atualiza em background)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Ignorar requisições que não são GET
    if (event.request.method !== 'GET') return;

    // Firebase & APIs: sempre tenta a rede primeiro
    if (url.hostname.includes('firestore') ||
        url.hostname.includes('googleapis') ||
        url.hostname.includes('gstatic') ||
        url.hostname.includes('firebase') ||
        url.hostname.includes('whatsapp') ||
        url.hostname.includes('ui-avatars')) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Todo o resto: cache first
    event.respondWith(cacheFirst(event.request));
});

// ─── ESTRATÉGIAS ─────────────────────────────────────────────

// Cache-First: Retorna do cache se existir, senão busca na rede e cacheia
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const networkResponse = await fetch(request);
        // Só cacheia respostas válidas
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (err) {
        // Se offline e sem cache, retorna uma resposta genérica
        return new Response('Sem conexão. Verifique sua internet.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
}

// Network-First: Tenta a rede, se falhar usa o cache
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        // Cacheia a resposta da rede para uso offline futuro
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;

        return new Response('{}', {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
