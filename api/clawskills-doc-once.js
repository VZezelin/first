module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const response = await fetch('https://findmcp.app/submit', {
      headers: { 'user-agent': 'SignalLabVerifier/1.0' },
      redirect: 'follow',
    });
    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ upstreamStatus: response.status, contentType: response.headers.get('content-type'), text });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ upstreamStatus: null, error: String(error) });
  }
};
