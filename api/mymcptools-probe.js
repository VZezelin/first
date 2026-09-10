module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const payload = {
    toolName: 'Signal Lab Apify Data APIs + MCP',
    description: 'Seven maintained Apify data tools exposed through a documented MCP workflow for ecommerce monitoring, buyer-intent search, website-to-Markdown/RAG, YouTube transcripts, Reddit research, job data, and restaurant menus.',
    github: 'https://github.com/VZezelin/first',
    website: 'https://first-livid-omega.vercel.app',
    category: 'api',
    installType: 'remote',
    email: 'vitaxastar@gmail.com',
    website_url: ''
  };

  try {
    const response = await fetch('https://mymcptools.com/api/submit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'user-agent': 'SignalLabSubmission/1.0'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
    const text = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ externalStatus: response.status, externalBody: text.slice(0, 5000) });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};