module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const submissionId = 'web_signal_lab_20260911_mcpizy';
  const payload = {
    ph_session: '',
    name: 'Signal Lab Apify Data APIs + MCP',
    repo: 'https://github.com/VZezelin/first',
    email: 'vitaxastar@gmail.com',
    description: 'Developer-first Apify data APIs and an Apify-hosted MCP endpoint for web scraping, Amazon price tracking, Google Autocomplete, website-to-Markdown/RAG, YouTube transcripts, Reddit research, public job extraction, and restaurant menu data. Authentication and paid execution are handled by each user through Apify; no owner credentials are embedded.',
    category: 'Developer tools',
    tier: 'standard',
    ref_channel: '',
    submission_id: submissionId,
    ph_did: '',
  };
  try {
    const upstream = await fetch('https://mcpizy.com/api/submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'SignalLab/1.0 (+https://github.com/VZezelin/first)',
      },
      body: JSON.stringify(payload),
      redirect: 'manual',
    });
    const text = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      upstreamStatus: upstream.status,
      location: upstream.headers.get('location'),
      submissionId,
      response: text.slice(0, 12000),
    });
  } catch (error) {
    return res.status(502).json({ ok: false, error: String(error) });
  }
};
