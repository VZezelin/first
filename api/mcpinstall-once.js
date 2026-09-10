module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const base = 'https://www.mcpinstall.com';
    const htmlResp = await fetch(base + '/submit', { headers: { 'user-agent': 'SignalLab-Acquisition/1.0' }, signal: AbortSignal.timeout(10000) });
    const html = await htmlResp.text();
    const srcs = [];
    const re = /<script[^>]+src=["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(html)) !== null && srcs.length < 30) srcs.push(m[1]);
    const findings = [];
    for (const src of srcs) {
      const url = src.startsWith('http') ? src : new URL(src, base).toString();
      try {
        const r = await fetch(url, { headers: { 'user-agent': 'SignalLab-Acquisition/1.0' }, signal: AbortSignal.timeout(8000) });
        const text = await r.text();
        const snippets = [];
        for (const needle of ['/api/', 'submit', 'githubUrl', 'github_url', 'serverName', 'mcpServer', 'formData']) {
          let start = 0;
          for (let n = 0; n < 3; n++) {
            const i = text.indexOf(needle, start);
            if (i < 0) break;
            snippets.push(text.slice(Math.max(0, i - 220), Math.min(text.length, i + 700)));
            start = i + needle.length;
          }
        }
        if (snippets.length) findings.push({ url, status: r.status, snippets: snippets.slice(0, 16) });
      } catch (e) {
        findings.push({ url, error: String(e && e.message || e) });
      }
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ htmlStatus: htmlResp.status, htmlPreview: html.slice(0, 8000), scriptCount: srcs.length, srcs, findings });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'DISCOVERY_FAILED', detail: String(error && error.message || error) });
  }
};
