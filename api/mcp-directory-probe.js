export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' || req.query?.confirm !== 'submit_mcp_directory_once') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }
  const payload = {
    githubUrl: 'https://github.com/VZezelin/first',
    description: 'Apify data APIs and MCP tools for research, web scraping, RAG, and automation.'
  };
  const r = await fetch('https://mcp.directory/api/submit-server', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'SignalLab/1.0' },
    body: JSON.stringify(payload)
  });
  const text = await r.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text.slice(0, 4000); }
  return res.status(200).json({ ok: true, upstreamStatus: r.status, upstreamBody: body });
}
