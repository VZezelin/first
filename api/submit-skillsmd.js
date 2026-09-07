export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });

  const response = await fetch('https://skillsmd.dev/api/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      repo: 'VZezelin/first',
      name: 'signal-lab-apify-tools',
      description: 'Signal Lab Agent Skill for Apify data APIs and MCP workflows: website-to-Markdown for RAG, Amazon price tracking, Google buyer-intent keywords, YouTube transcripts, Reddit, jobs, and restaurant menus.'
    })
  });

  const text = await response.text();
  res.status(response.ok ? 200 : response.status).json({ ok: response.ok, status: response.status, body: text });
}
