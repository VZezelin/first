const TARGETS = Object.freeze({
  portfolio: 'https://apify.com/signal_lab',
  amazon: 'https://apify.com/signal_lab/amazon-price-tracker',
  google: 'https://apify.com/signal_lab/google-autocomplete-keywords',
  website: 'https://apify.com/signal_lab/website-to-markdown-crawler',
  youtube: 'https://apify.com/signal_lab/youtube-transcript-scraper',
  reddit: 'https://apify.com/signal_lab/reddit-search-comments',
  jobs: 'https://apify.com/signal_lab/job-vacancy-scraper',
  restaurant: 'https://apify.com/signal_lab/restaurant-menu-extractor',
});

export default function handler(req, res) {
  const raw = Array.isArray(req.query?.actor) ? req.query.actor[0] : req.query?.actor;
  const actor = String(raw || '').toLowerCase();
  const destination = TARGETS[actor];
  if (!destination) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ ok: false, error: 'UNKNOWN_ACTOR' });
  }

  // Deliberately log only the selected destination and timestamp — no IP, cookies, or user identifiers.
  console.log(JSON.stringify({ event: 'signal_lab_apify_outbound', actor, at: new Date().toISOString() }));
  res.setHeader('Cache-Control', 'no-store');
  return res.redirect(302, `${destination}?utm_source=signal-lab-site&utm_medium=referral&utm_campaign=first-revenue`);
}
