export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.query?.confirm !== 'signal-lab-aimcp-20260911') {
    return res.status(404).json({ ok: false, error: 'NOT_FOUND' });
  }
  try {
    const payload = {
      website_url: 'https://github.com/VZezelin/first',
      name: 'Signal Lab Apify Data APIs + MCP',
      author_name: 'Signal Lab',
      mcp_avatar_url: '',
      user_avatar_url: '',
      email: '',
      subscribe_newsletter: false,
      detail: 'Developer-first Apify data APIs and a remote Streamable HTTP MCP endpoint for web scraping, Amazon price monitoring, Google Autocomplete, website-to-Markdown/RAG, YouTube transcripts, Reddit research, public job extraction, and restaurant menu data. Authentication for paid execution is handled by users through Apify; no owner credentials are embedded.'
    };
    const upstream = await fetch('https://www.aimcp.info/api/mcps/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'SignalLabDiscovery/1.0' },
      body: JSON.stringify(payload)
    });
    const text = await upstream.text();
    return res.status(200).json({ ok: upstream.ok, upstreamStatus: upstream.status, text: text.slice(0, 4000) });
  } catch (error) {
    return res.status(500).json({ ok: false, error: String(error?.message || error) });
  }
}
