module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  let referrerHost = 'direct';
  try {
    const raw = req.headers.referer || req.headers.referrer || '';
    if (raw) referrerHost = new URL(raw).hostname || 'direct';
  } catch (_) {}

  console.log(JSON.stringify({
    event: 'signal_lab_site_view',
    referrerHost,
    at: new Date().toISOString(),
  }));

  res.setHeader('Cache-Control', 'no-store');
  return res.status(204).end();
};
