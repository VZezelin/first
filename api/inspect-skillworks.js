module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  try {
    const response = await fetch('https://skillworks.thecompound.tech/submit', {
      headers: { 'user-agent': 'SignalLab/1.0 (public submission contract inspection)' }
    });
    const html = await response.text();
    const snippets = [];
    for (const needle of ['<form', 'action=', 'fetch(', '/api/', 'submit', 'repository']) {
      let from = 0;
      while (snippets.length < 30) {
        const i = html.toLowerCase().indexOf(needle.toLowerCase(), from);
        if (i < 0) break;
        snippets.push(html.slice(Math.max(0, i - 350), Math.min(html.length, i + 900)));
        from = i + needle.length;
      }
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ upstreamStatus: response.status, length: html.length, snippets });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
