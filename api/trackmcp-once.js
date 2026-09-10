const PAYLOAD = {
  name: 'Signal Lab Apify Data APIs + MCP',
  type: 'mcp',
  source: 'github',
  github_url: 'https://github.com/VZezelin/first',
  categories: [
    'Developer Tools',
    'Web Scraping & Data Collection',
    'API Development',
    'Research',
    'Productivity & Workflow'
  ],
  provider: 'Signal Lab',
  website: 'https://first-livid-omega.vercel.app',
  use_cases: [
    'Extract YouTube transcripts for RAG and LLM workflows',
    'Convert public websites to clean Markdown for retrieval pipelines',
    'Fetch structured job posting data and other public web data through Apify Actors',
    'Use Signal Lab data tools from MCP-compatible AI agents'
  ],
  faq: [],
  try_url: 'https://first-livid-omega.vercel.app',
  email: 'vitaxastar@gmail.com'
};

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const r = await fetch('https://api.mcpagentsmarket.com/api/submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'user-agent': 'SignalLabDirectorySubmission/1.0'
      },
      body: JSON.stringify(PAYLOAD),
      signal: AbortSignal.timeout(20000),
    });
    const text = await r.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: r.ok, upstreamStatus: r.status, body: text });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: false, error: String(error) });
  }
};
