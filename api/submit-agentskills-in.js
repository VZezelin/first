export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const payload = {
    full_name: 'VZezelin/first',
    html_url: 'https://github.com/VZezelin/first',
    description: '',
    stars: 0,
    language: 'HTML',
    license: '',
    default_branch: 'main',
    skills_count: 6,
    skill_paths: [
      '.agents/skills/signal-lab-apify-tools/SKILL.md',
      '.well-known/skills/signal-lab-apify-tools/SKILL.md',
      'SKILL.md',
      'skills/amazon-price-tracker/SKILL.md',
      'skills/signal-lab-apify-tools/SKILL.md',
      'skills/youtube-transcript-api/SKILL.md'
    ]
  };

  try {
    const response = await fetch('https://www.agentskills.in/api/repos/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await response.text();
    return res.status(200).json({
      ok: response.ok,
      upstreamStatus: response.status,
      upstreamBody: body
    });
  } catch (error) {
    return res.status(502).json({ ok: false, error: String(error) });
  }
}
