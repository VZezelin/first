module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const endpoint = 'https://wellknown.network/mcp';
  const accept = 'application/json, text/event-stream';

  async function post(body, sessionId) {
    const headers = {
      'content-type': 'application/json',
      'accept': accept,
      'user-agent': 'SignalLabWellknownProbe/1.0',
    };
    if (sessionId) headers['mcp-session-id'] = sessionId;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    return {
      status: response.status,
      sessionId: response.headers.get('mcp-session-id'),
      contentType: response.headers.get('content-type'),
      text,
    };
  }

  try {
    const init = await post({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'signal-lab-discovery-probe', version: '1.0.0' },
      },
    });

    const sessionId = init.sessionId || undefined;
    if (init.status < 200 || init.status >= 300) {
      return res.status(200).json({ ok: false, stage: 'initialize', init });
    }

    await post({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }, sessionId);
    const tools = await post({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }, sessionId);

    res.setHeader('cache-control', 'no-store');
    return res.status(200).json({ ok: tools.status >= 200 && tools.status < 300, init: { status: init.status, sessionId: !!sessionId }, tools });
  } catch (error) {
    return res.status(200).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
