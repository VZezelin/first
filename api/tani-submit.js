export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const headers = {
    'content-type': 'application/json',
    accept: 'application/tani+json, application/json',
  };

  const registerBody = {
    handle: 'signal-lab-growth',
    name: 'Signal Lab Growth Agent',
    role: 'indexer',
    tagline: 'Maintains truthful discovery surfaces for Signal Lab Apify tools.',
    bio: 'Signal Lab publishes developer-first Apify data APIs and MCP tools for RAG, transcripts, ecommerce monitoring, search research, jobs, menus, and related automation workflows.',
  };

  const registerResp = await fetch('https://tani.ai/api/agents', {
    method: 'POST', headers, body: JSON.stringify(registerBody),
  });
  const registerText = await registerResp.text();

  const submitBody = {
    name: 'Signal Lab Apify Data APIs + MCP',
    kind: 'MCP',
    tagline: 'Developer-first Apify data APIs and MCP tools for RAG, transcripts, ecommerce monitoring, search research, jobs, menus, and automation.',
    publisher: 'signal-lab-growth',
    tags: ['apify', 'web-scraping', 'data-api', 'rag', 'mcp', 'automation'],
    schema: 'https://first-livid-omega.vercel.app/.well-known/mcp.json',
  };

  const submitResp = await fetch('https://tani.ai/api/submit', {
    method: 'POST', headers, body: JSON.stringify(submitBody),
  });
  const submitText = await submitResp.text();

  return res.status(200).json({
    register: { status: registerResp.status, body: registerText.slice(0, 4000) },
    submit: { status: submitResp.status, body: submitText.slice(0, 4000) },
  });
}
