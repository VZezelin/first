module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const endpoint = 'https://mcp.apify.com?tools=signal_lab/amazon-price-tracker,signal_lab/google-autocomplete-keywords,signal_lab/website-to-markdown-crawler,signal_lab/youtube-transcript-scraper,signal_lab/reddit-search-comments,signal_lab/job-vacancy-scraper,signal_lab/restaurant-menu-extractor';
  const payload = {
    name: 'Signal Lab Apify Data APIs + MCP',
    description: 'Seven production Apify data tools exposed through one Streamable HTTP MCP endpoint for ecommerce monitoring, search intent, website-to-Markdown/RAG, YouTube transcripts, Reddit research, job data, and restaurant menus.',
    category: 'data',
    pricePerCall: 0,
    endpoint,
    endpointUrl: endpoint,
    website: 'https://first-livid-omega.vercel.app',
    github: 'https://github.com/VZezelin/first',
    tools: [
      { name: 'amazon-price-tracker', description: 'Track Amazon product price changes.' },
      { name: 'google-autocomplete-keywords', description: 'Extract Google Autocomplete buyer-intent keyword ideas.' },
      { name: 'website-to-markdown-crawler', description: 'Convert public websites to clean Markdown for RAG and LLM ingestion.' },
      { name: 'youtube-transcript-scraper', description: 'Extract YouTube transcripts for research and RAG workflows.' },
      { name: 'reddit-search-comments', description: 'Search public Reddit discussions and comments.' },
      { name: 'job-vacancy-scraper', description: 'Extract structured public job vacancy data.' },
      { name: 'restaurant-menu-extractor', description: 'Extract public restaurant menu items and prices.' }
    ]
  };

  try {
    const response = await fetch('https://parfournir.com/api/v1/mcp-hub/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ externalStatus: response.status, externalBody: text.slice(0, 5000) });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
