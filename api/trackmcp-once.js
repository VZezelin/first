const AUDIT_ID = 'efe907ad-b77a-4bbb-89d2-442100d1ca40';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const out = {};
  try {
    const r = await fetch('https://mcpagentsmarket.com/submit', {
      headers: { 'user-agent': 'SignalLabSubmissionInspector/1.0', accept: 'text/html,*/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const html = await r.text();
    out.market = {
      status: r.status,
      finalUrl: r.url,
      apiMatches: [...new Set(html.match(/\/(?:api|submit)[A-Za-z0-9_?&=\-/.]*/g) || [])].slice(0, 100),
      forms: [...html.matchAll(/<form[\s\S]{0,5000}?<\/form>/gi)].map((m) => m[0]).slice(0, 5),
      scripts: [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]).slice(0, 50),
      htmlHead: html.slice(0, 20000),
    };
  } catch (error) {
    out.market = { error: String(error) };
  }

  try {
    const r = await fetch(`https://audit-engine.oathe.ai/api/audit/${AUDIT_ID}`, {
      headers: { accept: 'application/json', 'user-agent': 'SignalLabAuditVerifier/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    out.oathe = { status: r.status, body: (await r.text()).slice(0, 30000) };
  } catch (error) {
    out.oathe = { error: String(error) };
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, out });
};
