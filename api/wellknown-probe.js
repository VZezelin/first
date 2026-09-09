module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const endpoint = 'https://wellknown.network/mcp';
  const accept = 'application/json, text/event-stream';
  const repo = 'https://github.com/VZezelin/first';
  const homepage = 'https://first-livid-omega.vercel.app';
  const mcpUrl = 'https://mcp.apify.com?tools=signal_lab/amazon-price-tracker,signal_lab/google-autocomplete-keywords,signal_lab/website-to-markdown-crawler,signal_lab/youtube-transcript-scraper,signal_lab/reddit-search-comments,signal_lab/job-vacancy-scraper,signal_lab/restaurant-menu-extractor';

  async function post(body, sessionId) {
    const headers = {
      'content-type': 'application/json',
      'accept': accept,
      'user-agent': 'SignalLabWellknownSubmit/1.0',
    };
    if (sessionId) headers['mcp-session-id'] = sessionId;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: response.status, sessionId: response.headers.get('mcp-session-id'), json, text };
  }

  try {
    const init = await post({
      jsonrpc: '2.0', id: 1, method: 'initialize',
      params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'signal-lab-discovery-submit', version: '1.0.0' } },
    });
    const sessionId = init.sessionId || undefined;
    if (init.status < 200 || init.status >= 300) return res.status(200).json({ ok: false, stage: 'initialize', status: init.status, text: init.text });
    await post({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }, sessionId);

    const search = await post({
      jsonrpc: '2.0', id: 2, method: 'tools/call',
      params: { name: 'search_agents', arguments: { query: 'Signal Lab Apify MCP VZezelin', protocols: ['mcp'], limit: 10 } },
    }, sessionId);
    const searchText = JSON.stringify(search.json || search.text);
    if (searchText.includes(repo) || searchText.includes(homepage)) {
      res.setHeader('cache-control', 'no-store');
      return res.status(200).json({ ok: true, action: 'already_indexed_exact_match', search: search.json || search.text });
    }

    const submit = await post({
      jsonrpc: '2.0', id: 3, method: 'tools/call',
      params: {
        name: 'submit_agent',
        arguments: {
          manifest: {
            name: 'Signal Lab Apify MCP Tools',
            kind: 'mcp_server',
            summary: 'Developer-first Apify data APIs and MCP tools for web data, research, monitoring, and AI agent workflows.',
            endpoints: [{ url: mcpUrl, type: 'mcp_streamable_http' }],
            protocols: ['mcp'],
            tags: ['apify', 'web-scraping', 'data-api', 'mcp', 'ai-agents'],
            repository: repo,
            homepage,
          },
        },
      },
    }, sessionId);

    res.setHeader('cache-control', 'no-store');
    return res.status(200).json({ ok: submit.status >= 200 && submit.status < 300, action: 'submit_agent', submit: submit.json || submit.text });
  } catch (error) {
    return res.status(200).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
