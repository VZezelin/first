module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  if (req.query?.confirm !== 'signal-lab-qevra-20260910') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }

  const payload = {
    url: 'https://first-livid-omega.vercel.app',
    email: 'vitaxastar@gmail.com',
    name: 'Signal Lab',
    tagline: 'Developer-first Apify data APIs and MCP tools for web research, RAG, ecommerce, and automation.',
    category: 'Developer Tools',
    board_notes: false,
  };

  const response = await fetch('https://qevra.app/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  const text = await response.text();
  res.setHeader('Cache-Control', 'no-store');
  return res.status(response.status).json({
    ok: response.ok,
    status: response.status,
    body: text,
  });
};
