module.exports = async function handler(req, res) {
  if (req.method !== 'GET' || req.query.confirm !== 'skillscat-submit-v1') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }
  try {
    const response = await fetch('https://skills.cat/api/submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'skillscat-cli/0.1.0',
        'x-skillscat-background-submit': '1',
      },
      body: JSON.stringify({
        url: 'https://github.com/VZezelin/first',
        skillPath: 'skills/signal-lab-apify-tools',
      }),
      redirect: 'manual',
      signal: AbortSignal.timeout(25000),
    });
    const text = await response.text();
    let body = text;
    try { body = JSON.parse(text); } catch {}
    return res.status(200).json({
      ok: response.ok,
      upstreamStatus: response.status,
      contentType: response.headers.get('content-type'),
      body,
    });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
