module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  try {
    const response = await fetch('https://mymcptools.com/submit', {
      headers: { 'user-agent': 'SignalLabSubmissionProbe/1.0' },
      signal: AbortSignal.timeout(15000)
    });
    const text = await response.text();
    const snippets = [...text.matchAll(/.{0,250}(?:form|action=|fetch\(|api\/|submit).{0,500}/gis)]
      .slice(0, 30)
      .map((match) => match[0]);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ externalStatus: response.status, snippets });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};