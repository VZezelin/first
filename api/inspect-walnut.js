module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const body = new URLSearchParams({ url: 'https://github.com/VZezelin/first' });
    const response = await fetch('https://walnut.world/api/index/submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'SignalLab/1.0 (public source indexing)'
      },
      body,
      redirect: 'manual'
    });
    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ upstreamStatus: response.status, location: response.headers.get('location'), contentType: response.headers.get('content-type'), text: text.slice(0, 5000) });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
