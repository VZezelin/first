module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const response = await fetch('https://nothumansearch.ai/api/v1/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: 'https://first-livid-omega.vercel.app' }),
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(response.status).json({ ok: response.ok, upstreamStatus: response.status, upstreamBody: text.slice(0, 4000) });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
