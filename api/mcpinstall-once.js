module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  if (req.query.confirm !== 'alltools-20260910') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }
  const payload = {
    toolType: 'MCP Server',
    toolName: 'Signal Lab Apify Data APIs + MCP Tools',
    shortDescription: 'Developer-first Apify data APIs and hosted MCP tools for web scraping, RAG, ecommerce monitoring, search research, transcripts, jobs, and structured data extraction.',
    longDescription: 'Signal Lab is a collection of production-oriented Apify Actors exposed as pay-per-event data APIs and through Apify hosted MCP. Current workflows include Amazon price tracking, Google buyer-intent autocomplete, website-to-Markdown for RAG/LLM ingestion, YouTube transcripts, Reddit research, job posting extraction, and restaurant menu extraction. The public site documents usage, pricing links, API guides, MCP discovery metadata, and direct links to the live Apify Store products. The MCP transport is hosted by Apify and requires normal Apify OAuth or API-token authentication; no owner credentials are embedded or proxied.',
    author: 'Signal Lab',
    websiteUrl: 'https://first-livid-omega.vercel.app',
    githubUrl: 'https://github.com/VZezelin/first',
    category: 'Developer Tools',
    platforms: ['Web', 'Cursor', 'ClaudeCode', 'API', 'Other'],
    tags: 'MCP, Model Context Protocol, Apify, web scraping, data API, RAG, LLM, automation',
    pricingModel: 'Premium',
    keyFeatures: 'Hosted MCP via Apify; pay-per-event data APIs; website-to-Markdown for RAG; Amazon price tracking; buyer-intent keyword discovery; YouTube transcripts; Reddit research; jobs and restaurant data; bounded documented workflows.',
    email: 'vitaxastar@gmail.com',
    socialProfiles: 'https://github.com/VZezelin/first',
    screenshots: 'https://first-livid-omega.vercel.app',
    additionalNotes: 'MCP discovery manifest: https://first-livid-omega.vercel.app/.well-known/mcp.json . Official Apify-hosted MCP transport is documented on the site and authenticates through Apify. Please review the live product/docs links for current pricing rather than copying static prices.',
    agreeToTerms: false,
    agreeToContact: false
  };
  try {
    const upstream = await fetch('https://www.alltoolsdirectory.com/api/submit-tool', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'SignalLab-Acquisition/1.0' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    const text = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(upstream.status).json({ ok: upstream.ok, upstreamStatus: upstream.status, upstreamBody: text.slice(0, 4000), submitted: { toolName: payload.toolName, githubUrl: payload.githubUrl, websiteUrl: payload.websiteUrl } });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: 'UPSTREAM_FETCH_FAILED', detail: String(error && error.message || error) });
  }
};
