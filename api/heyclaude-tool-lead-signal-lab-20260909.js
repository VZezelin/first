export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const upstream = await fetch('https://heyclau.de/api/listing-leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        kind: 'tool',
        tierInterest: 'free',
        contactName: 'Signal Lab',
        contactEmail: 'vitaxastar@gmail.com',
        companyName: 'Signal Lab',
        listingTitle: 'Signal Lab Apify Tools',
        websiteUrl: 'https://first-livid-omega.vercel.app',
        message: 'Developer-first Apify data APIs and MCP/Agent Skills bundle. Public source: https://github.com/VZezelin/first. Includes a remote Apify-hosted MCP endpoint, Agent Skills, and pay-per-event tools for website-to-Markdown/RAG, YouTube transcripts, Amazon price tracking, and buyer-intent keyword discovery. Requesting only the free tool listing/review; no paid placement.'
      }),
    });
    const body = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    res.status(upstream.status).send(body);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ ok: false, error: 'heyclaude_upstream_failed' });
  }
}
