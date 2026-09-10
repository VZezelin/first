export default async function handler(req, res) {
  if (req.method !== 'GET' || req.query.run !== 'signal-lab-bth-20260910') {
    return res.status(404).json({ ok: false });
  }

  try {
    const response = await fetch('https://betterthanhtml.com/mcp-registry/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Signal Lab Apify Tools',
        url: 'https://mcp.apify.com?tools=signal_lab/amazon-price-tracker,signal_lab/google-autocomplete-keywords,signal_lab/website-to-markdown-crawler,signal_lab/youtube-transcript-scraper,signal_lab/reddit-search-comments,signal_lab/job-vacancy-scraper,signal_lab/restaurant-menu-extractor',
        description: 'Focused Apify-hosted MCP tools for public-data workflows including Amazon price tracking, buyer-intent Google Autocomplete, website-to-Markdown for RAG, YouTube transcripts, Reddit research, public job extraction, and restaurant menus. Authentication is handled by Apify.',
        author: 'VZezelin / Signal Lab'
      })
    });

    const text = await response.text();
    res.status(response.status).json({ upstreamStatus: response.status, body: text });
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
