const SUBMIT_URL = 'https://openakita.ai/api/skills/submit-repo';
const REPO_URL = 'https://github.com/VZezelin/first';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  if (req.query.confirm !== 'openakita-submit-once') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }

  try {
    const upstream = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'user-agent': 'SignalLab-OpenAkita-Submission/1.0',
      },
      body: JSON.stringify({ repoUrl: REPO_URL }),
      redirect: 'follow',
    });
    const text = await upstream.text();
    return res.status(upstream.ok ? 200 : 502).json({
      ok: upstream.ok,
      repoUrl: REPO_URL,
      upstreamStatus: upstream.status,
      upstreamContentType: upstream.headers.get('content-type'),
      upstream: text.slice(0, 6000),
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
