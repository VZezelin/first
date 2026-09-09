export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const upstream = await fetch('https://api.runx.ai/v1/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        repo_url: 'https://github.com/VZezelin/first',
        ref: 'main',
      }),
    });
    const body = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    res.status(upstream.status).send(body);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ ok: false, error: 'runx_index_upstream_failed' });
  }
}
