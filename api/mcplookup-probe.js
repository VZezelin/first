const ENDPOINT = 'https://mcp.apify.com?tools=signal_lab/amazon-price-tracker,signal_lab/google-autocomplete-keywords,signal_lab/website-to-markdown-crawler,signal_lab/youtube-transcript-scraper,signal_lab/reddit-search-comments,signal_lab/job-vacancy-scraper,signal_lab/restaurant-menu-extractor';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' || req.query.confirm !== 'mcplookup-v1') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }
  try {
    const response = await fetch('https://mcplookup.com/api/submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'SignalLabSubmissionRelay/1.0',
      },
      body: JSON.stringify({
        url: ENDPOINT,
        website_url: 'https://first-livid-omega.vercel.app',
        documentation_url: 'https://first-livid-omega.vercel.app/mcp.json',
      }),
      redirect: 'manual',
      signal: AbortSignal.timeout(25000),
    });
    const text = await response.text();
    let body = text;
    try { body = JSON.parse(text); } catch {}
    return res.status(200).json({ ok: response.ok, upstreamStatus: response.status, body });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
