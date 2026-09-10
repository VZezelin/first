module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  res.setHeader('Cache-Control', 'no-store');

  if (req.query?.confirm !== 'signal-lab-hypestar-20260910') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }

  const payload = {
    url: 'https://first-livid-omega.vercel.app',
    kind: 'site',
    categorySlug: 'developer-tools',
    supporterChoice: 'skipped'
  };

  const response = await fetch('https://hypestar.org/api/v1/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });

  const text = await response.text();
  return res.status(response.status).json({ ok: response.ok, status: response.status, body: text });
};
