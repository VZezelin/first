module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  try {
    const upstream = await fetch('https://gisthubs.com/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl: 'https://github.com/VZezelin/first' }),
      signal: AbortSignal.timeout(10000),
    });
    const text = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ upstreamStatus: upstream.status, upstreamBody: text });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
