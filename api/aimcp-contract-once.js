export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const target = 'https://www.aimcp.info/en/submit';
    const htmlResp = await fetch(target, { headers: { 'user-agent': 'SignalLabDiscovery/1.0' } });
    const html = await htmlResp.text();
    const srcs = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]).slice(0, 30);
    const out = [];
    for (const src of srcs) {
      const url = new URL(src, target).toString();
      try {
        const r = await fetch(url, { headers: { 'user-agent': 'SignalLabDiscovery/1.0' } });
        const t = await r.text();
        const hits = [...t.matchAll(/.{0,220}(?:\/api\/[^"'`\\s]+|fetch\(|submit.{0,80}).{0,320}/gi)].map(m => m[0]).slice(0, 12);
        if (hits.length) out.push({ url, hits });
      } catch {}
    }
    return res.status(200).json({ ok: true, pageStatus: htmlResp.status, srcs, out });
  } catch (error) {
    return res.status(500).json({ ok: false, error: String(error?.message || error) });
  }
}
