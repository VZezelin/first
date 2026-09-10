const TARGET = 'https://www.awesomeskills.dev/en/submit';

function collectScripts(html, base) {
  const out = [];
  const re = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(re)) {
    try { out.push(new URL(match[1], base).toString()); } catch {}
  }
  return [...new Set(out)].slice(0, 40);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' }));
  }
  try {
    const page = await fetch(TARGET, { redirect: 'follow', headers: { 'user-agent': 'SignalLabContractInspector/1.0' } });
    const html = await page.text();
    const scripts = collectScripts(html, page.url || TARGET);
    const inspected = [];
    for (const url of scripts.slice(0, 20)) {
      try {
        const r = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'SignalLabContractInspector/1.0' } });
        const text = await r.text();
        if (/submit|github|skill/i.test(text)) {
          const matches = [...text.matchAll(/.{0,180}(?:\/api\/[A-Za-z0-9_./?=&-]+|fetch\([^)]{0,300}|axios\.[a-z]+\([^)]{0,300}).{0,180}/gsi)]
            .map((m) => m[0].replace(/\s+/g, ' ').slice(0, 700))
            .slice(0, 12);
          if (matches.length) inspected.push({ url, matches });
        }
      } catch {}
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true, status: page.status, finalUrl: page.url, scripts, inspected }));
  } catch (error) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 502;
    return res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
  }
}
