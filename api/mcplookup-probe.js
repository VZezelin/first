module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const response = await fetch('https://mcplookup.com/submit', {
      method: 'GET',
      headers: { 'user-agent': 'SignalLabSubmissionProbe/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    return res.status(200).json({ ok: true, upstreamStatus: response.status, html: text.slice(0, 120000) });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
