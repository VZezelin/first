module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const upstream = await fetch('https://vivioo.io/api/showcase/guide', {
      headers: { 'user-agent': 'SignalLab-Acquisition/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    const text = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/plain; charset=utf-8');
    return res.status(upstream.status).send(text);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'UPSTREAM_FETCH_FAILED', detail: String(error && error.message || error) });
  }
};
