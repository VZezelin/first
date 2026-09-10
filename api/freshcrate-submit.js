export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const payload = {
    name: 'signal-lab-apify-tools',
    short_desc: 'Developer-first Apify data APIs and MCP tools for scraping, monitoring, RAG, transcripts, jobs, Reddit, and restaurant data.',
    version: '1.0.1',
    author: 'Signal Lab',
    category: 'MCP Servers',
    description: 'Signal Lab publishes a focused bundle of public Apify Actors plus an Apify-hosted Streamable HTTP MCP endpoint for Amazon price tracking, Google Autocomplete, website-to-Markdown/RAG, YouTube transcripts, Reddit search/comments, public job posting extraction, and restaurant menu extraction. The public repository includes SKILL.md, MCP discovery metadata, API guides, and links to the live Apify Store Actors. Authentication for paid execution is handled by the user through Apify; no owner credentials are embedded.',
    homepage_url: 'https://first-livid-omega.vercel.app',
    repo_url: 'https://github.com/VZezelin/first',
    license: 'Unknown',
    changes: 'Initial Freshcrate directory submission for the existing Signal Lab Apify MCP and Agent Skill bundle.',
    tags: ['apify', 'mcp', 'model-context-protocol', 'web-scraping', 'data-api', 'rag', 'automation']
  };

  try {
    const response = await fetch('https://www.freshcrate.ai/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
    const text = await response.text();
    res.setHeader('cache-control', 'no-store');
    res.status(response.status).send(text);
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
