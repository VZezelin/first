module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const out = {};
  try {
    const jsUrl = 'https://mcpagentsmarket.com/_next/static/chunks/551-ddcc0fda423c9ac2.js';
    const r = await fetch(jsUrl, {
      headers: { 'user-agent': 'SignalLabSubmissionInspector/1.0', accept: 'application/javascript,*/*' },
      signal: AbortSignal.timeout(15000),
    });
    const js = await r.text();
    const snippets = [];
    for (const needle of ['xj', 'fetch(', '/api/', 'submit', 'listing']) {
      let i = 0;
      while ((i = js.indexOf(needle, i)) !== -1 && snippets.length < 80) {
        snippets.push({ needle, text: js.slice(Math.max(0, i - 700), Math.min(js.length, i + 1800)) });
        i += needle.length;
      }
    }
    out.helper = {
      status: r.status,
      jsUrl,
      apiMatches: [...new Set(js.match(/\/(?:api|submit)[A-Za-z0-9_?&=\-/.]*/g) || [])].slice(0, 100),
      snippets,
    };
  } catch (error) {
    out.error = String(error);
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, out });
};
