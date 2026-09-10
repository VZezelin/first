module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const out = {};
  try {
    const r = await fetch('https://www.trackmcp.com/submit-mcp', {
      headers: { 'user-agent': 'SignalLabSubmissionInspector/1.0' },
      redirect: 'follow',
    });
    const html = await r.text();
    const apiMatches = [...new Set(html.match(/\/(?:api|submit)[A-Za-z0-9_?&=\-/.]*/g) || [])].slice(0, 100);
    const formMatches = [...html.matchAll(/<form[\s\S]{0,2500}?<\/form>/gi)].map((m) => m[0]).slice(0, 5);
    out.trackmcp = {
      status: r.status,
      finalUrl: r.url,
      apiMatches,
      forms: formMatches,
      htmlHead: html.slice(0, 12000),
    };
  } catch (error) {
    out.trackmcp = { error: String(error) };
  }

  try {
    const r = await fetch('https://audit-engine.oathe.ai/api/skill/VZezelin/first/summary', {
      headers: { 'user-agent': 'SignalLabAuditVerifier/1.0' },
      redirect: 'follow',
    });
    out.oathe = { status: r.status, body: (await r.text()).slice(0, 20000) };
  } catch (error) {
    out.oathe = { error: String(error) };
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, out });
};
