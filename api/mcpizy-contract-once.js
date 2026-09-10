module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  try {
    const upstream = await fetch('https://mcpizy.com/_next/static/chunks/00htos950n1m5.js', {
      headers: { 'user-agent': 'SignalLab/1.0 (+https://github.com/VZezelin/first)' },
      redirect: 'follow',
    });
    const text = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      upstreamStatus: upstream.status,
      finalUrl: upstream.url,
      body: text.slice(0, 200000),
    });
  } catch (error) {
    return res.status(502).json({ ok: false, error: String(error) });
  }
};
