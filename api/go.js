const TARGETS = Object.freeze({
  portfolio: { url: 'https://apify.com/signal_lab', kind: 'apify' },
  amazon: { url: 'https://apify.com/signal_lab/amazon-price-tracker', kind: 'apify' },
  google: { url: 'https://apify.com/signal_lab/google-autocomplete-keywords', kind: 'apify' },
  website: { url: 'https://apify.com/signal_lab/website-to-markdown-crawler', kind: 'apify' },
  youtube: { url: 'https://apify.com/signal_lab/youtube-transcript-scraper', kind: 'apify' },
  reddit: { url: 'https://apify.com/signal_lab/reddit-search-comments', kind: 'apify' },
  jobs: { url: 'https://apify.com/signal_lab/job-vacancy-scraper', kind: 'apify' },
  restaurant: { url: 'https://apify.com/signal_lab/restaurant-menu-extractor', kind: 'apify' },
  skill: { url: 'https://askill.sh/skills/703900', kind: 'agent_skill' },
});

function referrerHost(value) {
  try {
    return value ? new URL(value).hostname.toLowerCase() : null;
  } catch {
    return null;
  }
}

function agentClass(value) {
  const ua = String(value || '').toLowerCase();
  if (!ua) return 'unknown';
  if (/bot|crawler|spider|slurp|headless|curl|wget|python|httpclient|preview|vercel|github/.test(ua)) return 'bot_or_automation';
  if (/mozilla|chrome|safari|firefox|edg\//.test(ua)) return 'browser';
  return 'other';
}

export default function handler(req, res) {
  const raw = Array.isArray(req.query?.actor) ? req.query.actor[0] : req.query?.actor;
  const actor = String(raw || '').toLowerCase();
  const target = TARGETS[actor];
  if (!target) {
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ ok: false, error: 'UNKNOWN_TARGET' }));
  }

  const event = target.kind === 'agent_skill' ? 'signal_lab_skill_outbound' : 'signal_lab_apify_outbound';

  // Privacy-minimal funnel event: no IP, cookie, account, full user-agent, or user identifier is logged.
  console.log(JSON.stringify({
    event,
    target: actor,
    referrerHost: referrerHost(req.headers?.referer || req.headers?.referrer),
    agentClass: agentClass(req.headers?.['user-agent']),
    at: new Date().toISOString(),
  }));

  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  const destination = target.kind === 'apify'
    ? `${target.url}?utm_source=signal-lab-site&utm_medium=referral&utm_campaign=first-revenue`
    : target.url;
  res.setHeader('Location', destination);
  return res.end();
}
