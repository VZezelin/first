module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const payload = {
    full_name: 'VZezelin/first',
    html_url: 'https://github.com/VZezelin/first',
    description: '',
    stars: 0,
    language: 'HTML',
    license: '',
    default_branch: 'main',
    skills_count: 3,
    skill_paths: [
      'skills/amazon-price-tracker/SKILL.md',
      'skills/signal-lab-apify-tools/SKILL.md',
      'skills/youtube-transcript-api/SKILL.md'
    ]
  };

  try {
    const response = await fetch('https://www.agentskills.in/api/repos/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(response.status).send(JSON.stringify({
      ok: response.ok,
      upstreamStatus: response.status,
      upstreamBody: text.slice(0, 2000)
    }));
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
