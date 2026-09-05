const ALLOWED_PAGES = new Set(['home','youtube','website','jobs']);
const agentSkillsIndex = require('../agent-skills-index.json');

const apiCatalog = {
  linkset: [
    {
      anchor: 'https://first-livid-omega.vercel.app/.well-known/api-catalog',
      item: [
        { href: 'https://api.apify.com/v2/acts/signal_lab~amazon-price-tracker/runs' },
        { href: 'https://api.apify.com/v2/acts/signal_lab~google-autocomplete-keywords/runs' },
        { href: 'https://api.apify.com/v2/acts/signal_lab~website-to-markdown-crawler/runs' },
        { href: 'https://api.apify.com/v2/acts/signal_lab~youtube-transcript-scraper/runs' },
        { href: 'https://api.apify.com/v2/acts/signal_lab~reddit-search-comments/runs' },
        { href: 'https://api.apify.com/v2/acts/signal_lab~job-vacancy-scraper/runs' },
        { href: 'https://api.apify.com/v2/acts/signal_lab~restaurant-menu-extractor/runs' },
        { href: 'https://mcp.apify.com?tools=signal_lab/amazon-price-tracker,signal_lab/google-autocomplete-keywords,signal_lab/website-to-markdown-crawler,signal_lab/youtube-transcript-scraper,signal_lab/reddit-search-comments,signal_lab/job-vacancy-scraper,signal_lab/restaurant-menu-extractor' },
      ],
    },
  ],
};

function referrerHost(value) {
  try {
    return value ? new URL(value).hostname.toLowerCase() : 'direct';
  } catch {
    return 'direct';
  }
}

function agentClass(value) {
  const ua = String(value || '').toLowerCase();
  if (!ua) return 'unknown';
  if (/bot|crawler|spider|slurp|headless|curl|wget|python|httpclient|preview|vercel|github/.test(ua)) return 'bot_or_automation';
  if (/mozilla|chrome|safari|firefox|edg\//.test(ua)) return 'browser';
  return 'other';
}

module.exports = async function handler(req, res) {
  const discovery = Array.isArray(req.query?.discovery) ? req.query.discovery[0] : req.query?.discovery;

  if (req.method === 'GET' && discovery === 'agent-skills') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(agentSkillsIndex);
  }

  if (req.method === 'GET' && discovery === 'api-catalog') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.setHeader('Content-Type', 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"');
    res.setHeader('Link', '</.well-known/api-catalog>; rel="api-catalog"');
    return res.status(200).send(JSON.stringify(apiCatalog));
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  }

  const rawPage = Array.isArray(req.query?.page) ? req.query.page[0] : req.query?.page;
  const page = ALLOWED_PAGES.has(String(rawPage || '').toLowerCase())
    ? String(rawPage).toLowerCase()
    : 'home';

  console.log(JSON.stringify({
    event: 'signal_lab_site_view',
    page,
    referrerHost: referrerHost(req.headers.referer || req.headers.referrer),
    agentClass: agentClass(req.headers['user-agent']),
    at: new Date().toISOString(),
  }));

  res.setHeader('Cache-Control', 'no-store');
  return res.status(204).end();
};
