export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  const r = await fetch('https://mcp.directory/submit', { headers: { 'user-agent': 'SignalLab/1.0' } });
  const text = await r.text();
  const forms = [...text.matchAll(/<form[^>]*>[\s\S]*?<\/form>/gi)].map(m => m[0].slice(0, 20000));
  const scripts = [...text.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
  const apiHints = [...new Set((text.match(/\/api\/[A-Za-z0-9_\-/]+/g) || []))].slice(0, 50);
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, upstreamStatus: r.status, forms, scripts, apiHints });
}
