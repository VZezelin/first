module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const pageUrl = 'https://mcpagentsmarket.com/submit';
  const out = {};
  try {
    const page = await fetch(pageUrl, {
      headers: { 'user-agent': 'SignalLabSubmissionInspector/1.0', accept: 'text/html,*/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const html = await page.text();
    const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
    const submitScript = scripts.find((s) => s.includes('/app/submit/page-'));
    out.page = { status: page.status, submitScript, scripts };
    if (submitScript) {
      const jsUrl = new URL(submitScript, page.url).toString();
      const jsResp = await fetch(jsUrl, {
        headers: { 'user-agent': 'SignalLabSubmissionInspector/1.0', accept: 'application/javascript,*/*' },
        signal: AbortSignal.timeout(15000),
      });
      const js = await jsResp.text();
      const apiMatches = [...new Set(js.match(/\/(?:api|submit)[A-Za-z0-9_?&=\-/.]*/g) || [])];
      const urlMatches = [...new Set(js.match(/https?:\\?\/\\?\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%-]+/g) || [])];
      const snippets = [];
      for (const needle of ['fetch(', '/api/', 'submit', 'repo', 'categories']) {
        let i = 0;
        while ((i = js.indexOf(needle, i)) !== -1 && snippets.length < 40) {
          snippets.push(js.slice(Math.max(0, i - 500), Math.min(js.length, i + 1200)));
          i += needle.length;
        }
      }
      out.script = { status: jsResp.status, jsUrl, apiMatches, urlMatches: urlMatches.slice(0, 50), snippets };
    }
  } catch (error) {
    out.error = String(error);
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, out });
};
