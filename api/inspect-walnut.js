module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const base = 'https://walnut.world';
    const page = await fetch(base + '/', { headers: { 'user-agent': 'SignalLab/1.0 (public submission contract inspection)' } });
    const html = await page.text();
    const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
    const results = [];
    for (const src of scripts.slice(0, 40)) {
      const url = src.startsWith('http') ? src : base + src;
      try {
        const r = await fetch(url, { headers: { 'user-agent': 'SignalLab/1.0 (public submission contract inspection)' } });
        const js = await r.text();
        const lower = js.toLowerCase();
        if (!['index it','/api/','fetch(','sourceurl','source_url','github.com/owner/repo','ownership remains unclaimed'].some((n) => lower.includes(n))) continue;
        const snippets = [];
        for (const needle of ['fetch(', '/api/', 'source_url', 'sourceurl', 'github.com/owner/repo', 'index it']) {
          let from = 0;
          while (snippets.length < 40) {
            const i = lower.indexOf(needle.toLowerCase(), from);
            if (i < 0) break;
            snippets.push(js.slice(Math.max(0, i - 700), Math.min(js.length, i + 1800)));
            from = i + needle.length;
          }
        }
        results.push({ url, status: r.status, length: js.length, snippets });
      } catch (e) {
        results.push({ url, error: e instanceof Error ? e.message : String(e) });
      }
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ pageStatus: page.status, scripts, results });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
