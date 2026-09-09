export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const upstream = await fetch('https://agentskill.sh/api/skills/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        url: 'https://github.com/VZezelin/first'
      }),
    });
    const body = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    res.status(upstream.status).send(body);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ ok: false, error: 'agentskill_submit_upstream_failed' });
  }
}
