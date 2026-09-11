module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const response = await fetch('https://shareyourstartup.com/submit.html', {
    headers: {
      'user-agent': 'SignalLabSubmissionProbe/1.0',
      'accept': 'text/html,application/xhtml+xml'
    },
    redirect: 'follow'
  });

  const text = await response.text();
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json({
    status: response.status,
    finalUrl: response.url,
    contentType: response.headers.get('content-type'),
    text
  });
};
