module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  try {
    const response = await fetch('https://agentskillshub.top/api/submit-skill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_url: 'https://github.com/VZezelin/first' }),
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ upstreamStatus: response.status, upstreamBody: text });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
