module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  try {
    const url = 'https://skillworks.thecompound.tech/_next/static/chunks/app/submit/page-79448354d6132e79.js';
    const response = await fetch(url, {
      headers: { 'user-agent': 'SignalLab/1.0 (public submission contract inspection)' }
    });
    const js = await response.text();
    const snippets = [];
    for (const needle of ['fetch(', '/api/', 'repo_url', 'website', 'submission', 'submit']) {
      let from = 0;
      while (snippets.length < 50) {
        const i = js.toLowerCase().indexOf(needle.toLowerCase(), from);
        if (i < 0) break;
        snippets.push(js.slice(Math.max(0, i - 500), Math.min(js.length, i + 1400)));
        from = i + needle.length;
      }
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ upstreamStatus: response.status, length: js.length, snippets });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
