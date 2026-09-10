module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const base = 'https://www.mcpinstall.com';
    const htmlResp = await fetch(base + '/submit', { headers: { 'user-agent': 'SignalLab-Acquisition/1.0' }, signal: AbortSignal.timeout(10000) });
    const html = await htmlResp.text();
    const srcs = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(m => m[1]).filter(Boolean).slice(0, 30);
    const findings = [];
    for (const src of srcs) {
      const url = src.startsWith('http') ? src : new URL(src, base).toString();
      try {
        const r = await fetch(url, { headers: { 'user-agent': 'SignalLab-Acquisition/1.0' }, signal: AbortSignal.timeout(8000) });
        const text = await r.text();
        const api = [...text.matchAll(/(?:https?:\\/\\/[^"'`\\s]+|\\/api\\/[^"'`\\s?&)}]+)/g)].map(m => m[0]).filter(v => /submit|mcp|server|tool/i.test(v));
        const context = [];
        for (const needle of ['submit', 'serverName', 'githubUrl', 'github_url', 'mcpServer']) {
          const i = text.indexOf(needle);
          if (i >= 0) context.push(text.slice(Math.max(0, i - 180), Math.min(text.length, i + 420)));
        }
        if (api.length || context.length) findings.push({ url, status: r.status, api: [...new Set(api)].slice(0, 20), context: context.slice(0, 8) });
      } catch (e) {
        findings.push({ url, error: String(e && e.message || e) });
      }
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ htmlStatus: htmlResp.status, scriptCount: srcs.length, srcs, findings });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'DISCOVERY_FAILED', detail: String(error && error.message || error) });
  }
};
