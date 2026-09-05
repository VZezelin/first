const ALLOWED_PAGES = new Set(['home','youtube','website','jobs']);
const agentSkillsIndex = require('../agent-skills-index.json');

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
