module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const response = await fetch('https://clawskills.tech/skill.md', {
    headers: { 'user-agent': 'SignalLabVerifier/1.0' },
    redirect: 'follow',
  });
  const text = await response.text();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ upstreamStatus: response.status, contentType: response.headers.get('content-type'), text });
};
