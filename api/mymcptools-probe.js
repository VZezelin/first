module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  try {
    const pageUrl = 'https://mymcptools.com/submit';
    const response = await fetch(pageUrl, {
      headers: { 'user-agent': 'SignalLabSubmissionProbe/1.0' },
      signal: AbortSignal.timeout(15000)
    });
    const html = await response.text();
    const srcs = [...html.matchAll(/<script[^>]+src=["']([^"']+\.js[^"']*)["']/gi)].map(m => m[1]);
    const findings = [];
    for (const src of srcs.slice(0, 30)) {
      try {
        const url = new URL(src, pageUrl).toString();
        const jsResp = await fetch(url, { signal: AbortSignal.timeout(10000) });
        const js = await jsResp.text();
        const matches = [...js.matchAll(/.{0,350}(?:\/api\/[A-Za-z0-9_?=&./-]+|fetch\(|submit.{0,80}|github.{0,80}|installType|category).{0,650}/gis)]
          .slice(0, 12)
          .map(m => m[0]);
        if (matches.length) findings.push({ url, status: jsResp.status, matches });
      } catch (error) {
        findings.push({ src, error: error instanceof Error ? error.message : String(error) });
      }
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ externalStatus: response.status, scriptCount: srcs.length, findings });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};