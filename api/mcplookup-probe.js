module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const response = await fetch('https://mcplookup.com/_next/static/immutable/chunks/261ro-65iq4wy.js', {
      method: 'GET',
      headers: { 'user-agent': 'SignalLabSubmissionProbe/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    const needles = ['submit','api/','website_url','documentation_url','fetch('];
    const excerpts = [];
    for (const needle of needles) {
      let at = 0;
      while ((at = text.indexOf(needle, at)) !== -1 && excerpts.length < 50) {
        excerpts.push(text.slice(Math.max(0, at - 500), Math.min(text.length, at + 1200)));
        at += needle.length;
      }
    }
    return res.status(200).json({ ok: true, upstreamStatus: response.status, size: text.length, excerpts });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
