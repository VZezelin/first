export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  if (req.query.run !== 'signal-lab-mcpad-20260911') return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });

  try {
    const upstream = await fetch('https://mcp.ad/api/submit-project', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'SignalLab/1.0 (+https://github.com/VZezelin/first)'
      },
      body: JSON.stringify({
        url: 'https://github.com/VZezelin/first'
      }),
      redirect: 'manual'
    });

    const text = await upstream.text();
    return res.status(200).json({
      ok: upstream.ok,
      upstreamStatus: upstream.status,
      location: upstream.headers.get('location'),
      contentType: upstream.headers.get('content-type'),
      body: text.slice(0, 4000)
    });
  } catch (error) {
    return res.status(200).json({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
