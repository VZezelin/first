module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  try {
    const response = await fetch('https://skillworks.thecompound.tech/api/submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'SignalLab/1.0 (public repository submission)'
      },
      body: JSON.stringify({
        repo_url: 'https://github.com/VZezelin/first',
        note: 'Signal Lab public repository with standard SKILL.md Agent Skills, Agent Plugins manifest, and MCP discovery metadata for developer-first Apify data/API workflows.',
        email: '',
        website: ''
      })
    });
    const body = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: response.ok, upstreamStatus: response.status, upstreamBody: body.slice(0, 3000) });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
