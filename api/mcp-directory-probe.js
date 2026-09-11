export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  const origin = 'https://mcp.directory';
  const r = await fetch(origin + '/submit', { headers: { 'user-agent': 'SignalLab/1.0' } });
  const text = await r.text();
  const scripts = [...text.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]).filter(s => s.startsWith('/_next/'));
  const hits = [];
  for (const src of scripts.slice(0, 25)) {
    try {
      const sr = await fetch(origin + src, { headers: { 'user-agent': 'SignalLab/1.0' } });
      const js = await sr.text();
      const needles = ['api/', 'submitted for review', 'githubUrl', 'github_url', 'repositoryUrl', 'repository_url', 'submit'];
      for (const needle of needles) {
        let idx = js.toLowerCase().indexOf(needle.toLowerCase());
        while (idx >= 0 && hits.length < 100) {
          hits.push({ src, needle, context: js.slice(Math.max(0, idx - 500), Math.min(js.length, idx + 1200)) });
          idx = js.toLowerCase().indexOf(needle.toLowerCase(), idx + needle.length);
        }
      }
    } catch {}
  }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, upstreamStatus: r.status, scripts, hits });
}
