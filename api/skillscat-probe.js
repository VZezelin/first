module.exports = async function handler(req, res) {
  if (req.method !== 'GET' || req.query.confirm !== 'skillscat-feed-v1') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }
  try {
    const urls = ['https://skills.cat/marketplace.json', 'https://skills.cat/.well-known/clawhub.json'];
    const results = [];
    for (const url of urls) {
      const response = await fetch(url, {
        headers: { 'user-agent': 'SignalLabSkillsCatCheck/1.0' },
        signal: AbortSignal.timeout(20000),
      });
      const text = await response.text();
      const lower = text.toLowerCase();
      const needles = ['vzezelin', 'signal-lab-apify-tools', 'vzezelin/first'];
      results.push({
        url,
        status: response.status,
        size: text.length,
        matches: Object.fromEntries(needles.map((n) => [n, lower.includes(n)])),
        contentType: response.headers.get('content-type'),
      });
    }
    return res.status(200).json({ ok: true, results });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
