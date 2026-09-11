module.exports = async function handler(req, res) {
  if (req.method !== 'GET' || req.query.confirm !== 'skillscat-check-v1') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }
  try {
    const queries = ['VZezelin', 'signal-lab-apify-tools', 'Signal Lab'];
    const results = [];
    for (const q of queries) {
      const response = await fetch(`https://skills.cat/api/search?q=${encodeURIComponent(q)}&limit=20`, {
        headers: { 'user-agent': 'SignalLabSkillsCatCheck/1.0' },
        signal: AbortSignal.timeout(15000),
      });
      const text = await response.text();
      let body = text;
      try { body = JSON.parse(text); } catch {}
      results.push({ q, status: response.status, body });
    }
    return res.status(200).json({ ok: true, results });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
