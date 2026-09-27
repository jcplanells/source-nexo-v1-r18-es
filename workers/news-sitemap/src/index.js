// Worker de Cloudflare para nexo.la
//
// /news-sitemap.xml  Sitemap de Google News con las notas de las últimas 48 h,
//                    generado desde la Content API de Ghost.
//
// El robots.txt que lo declara vive en la raíz del tema (robots.txt).

const WINDOW_HOURS = 48;      // Google News solo considera notas de los últimos 2 días
const MAX_URLS = 1000;        // Límite de Google por news sitemap
const CACHE_SECONDS = 300;

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname === '/news-sitemap.xml') {
            return cached(request, ctx, () => newsSitemap(env));
        }
        return fetch(request);
    }
};

async function cached(request, ctx, build) {
    const cache = caches.default;
    const key = new Request(request.url, { method: 'GET' });

    const hit = await cache.match(key);
    if (hit) return hit;

    const response = await build();
    if (response.ok) ctx.waitUntil(cache.put(key, response.clone()));
    return response;
}

async function newsSitemap(env) {
    let posts;
    try {
        posts = await recentPosts(env);
    } catch (e) {
        return new Response('Error leyendo la Content API de Ghost', { status: 502 });
    }

    const items = posts.map(p => `  <url>
    <loc>${xml(p.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xml(env.PUBLICATION_NAME)}</news:name>
        <news:language>${xml(env.PUBLICATION_LANGUAGE)}</news:language>
      </news:publication>
      <news:publication_date>${xml(p.published_at)}</news:publication_date>
      <news:title>${xml(p.title)}</news:title>
    </news:news>
  </url>`).join('\n');

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>
`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': `public, max-age=${CACHE_SECONDS}`
        }
    });
}

async function recentPosts(env) {
    const since = new Date(Date.now() - WINDOW_HOURS * 3600 * 1000).toISOString();
    const posts = [];
    let page = 1;

    // La Content API pagina de a 100 como máximo
    while (page && posts.length < MAX_URLS) {
        const api = new URL('/ghost/api/content/posts/', env.GHOST_URL);
        api.searchParams.set('key', env.GHOST_CONTENT_KEY);
        api.searchParams.set('filter', `published_at:>'${since}'`);
        api.searchParams.set('fields', 'url,title,published_at');
        api.searchParams.set('order', 'published_at desc');
        api.searchParams.set('limit', '100');
        api.searchParams.set('page', String(page));

        const r = await fetch(api, { headers: { 'Accept-Version': 'v5.0' } });
        if (!r.ok) throw new Error(`Ghost ${r.status}`);
        const data = await r.json();

        posts.push(...data.posts);
        page = data.meta.pagination.next;
    }

    return posts.slice(0, MAX_URLS);
}

function xml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
