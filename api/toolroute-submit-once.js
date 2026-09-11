module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const payload = {
    repo_url: 'https://github.com/VZezelin/first',
    canonical_name: 'Signal Lab Apify Data APIs MCP',
    short_description: 'Developer-first Apify data APIs and a remote MCP endpoint for web research, web scraping, buyer-intent discovery, transcripts, ecommerce monitoring, and structured data workflows.',
    vendor_name: 'Signal Lab',
    email: '',
    notes: 'Public repository includes MCP manifests, Agent Skill documentation, and direct links to the Apify-hosted Streamable HTTP MCP endpoint. Authentication is handled by Apify at connection time; no credentials are embedded in this repository.',
    workflow_slug: 'research-competitive-intelligence',
    vertical_slug: 'devtools',
    capabilities: ['web-search', 'web-crawling-scraping'],
    transport_type: 'streamable-http',
    install_method: 'remote',
    license: 'Other'
  };

  const response = await fetch('https://toolroute.io/api/skills/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json({ upstreamStatus: response.status, upstreamBody: text });
};
