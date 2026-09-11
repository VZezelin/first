const SUBMIT_URL = 'https://aipo.st/api/submit';
const TARGET_URL = 'https://first-livid-omega.vercel.app';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  if (req.query.confirm !== 'aipo-submit-once') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }

  try {
    const upstream = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'user-agent': 'SignalLab-AIPO-Submission/1.0',
      },
      body: JSON.stringify({ url: TARGET_URL, source: 'agent' }),
      redirect: 'follow',
    });
    const text = await upstream.text();
    return res.status(upstream.ok ? 200 : 502).json({
      ok: upstream.ok,
      target: TARGET_URL,
      upstreamStatus: upstream.status,
      upstreamContentType: upstream.headers.get('content-type'),
      upstream: text.slice(0, 6000),
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
