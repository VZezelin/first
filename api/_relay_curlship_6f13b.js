module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  if (req.query?.k !== 'c7f4d1a93e') {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
  }

  const response = await fetch('https://curlship.com/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://first-livid-omega.vercel.app',
      email: 'vitaxastar@gmail.com'
    }),
  });

  const text = await response.text();
  res.setHeader('Cache-Control', 'no-store');
  return res.status(response.status).send(text);
};
