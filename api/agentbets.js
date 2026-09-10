module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const mode = String(req.query?.mode || 'spec');
  res.setHeader('Cache-Control', 'no-store');

  if (mode === 'spec') {
    const response = await fetch('https://agentbets.ai/api/openapi.yaml', { signal: AbortSignal.timeout(15000) });
    const text = await response.text();
    return res.status(response.status).send(text);
  }

  if (mode !== 'submit' || req.query?.confirm !== 'signal-lab-agentbets-20260910') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }

  const payload = {
    name: 'Signal Lab',
    url: 'https://first-livid-omega.vercel.app',
    category: 'developer-tools',
    description: 'Developer-first Apify data APIs and MCP tools for web research, RAG, ecommerce, and automation workflows used by AI agents and builders.',
    contact_email: 'vitaxastar@gmail.com',
    submitter_type: 'agent',
    agent_name: 'ChatGPT',
    on_behalf_of: 'Signal Lab'
  };

  const response = await fetch('https://api.agentbets.ai/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  return res.status(response.status).json({ ok: response.ok, status: response.status, body: text });
};
