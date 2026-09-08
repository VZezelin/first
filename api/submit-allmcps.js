export default async function handler(req, res) {
  if (req.method !== 'GET' || req.query.confirm !== 'signal-lab-allmcps-20260908') {
    return res.status(404).json({ ok: false });
  }

  const payload = {
    name: 'Signal Lab Apify Tools',
    url: 'https://github.com/VZezelin/first',
    description: 'Developer-first Apify data APIs and an official MCP Registry tool bundle for website-to-Markdown/RAG, YouTube transcripts, Amazon price tracking, Google buyer-intent keywords, Reddit research, job postings, and restaurant menus.',
    category: 'Search & Data Extraction',
    email: 'vitaxastar@gmail.com'
  };

  try {
    const response = await fetch('https://allmcps.com/api/v1/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
    const text = await response.text();
    res.setHeader('cache-control', 'no-store');
    return res.status(response.status).json({ ok: response.ok, status: response.status, body: text.slice(0, 4000) });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
