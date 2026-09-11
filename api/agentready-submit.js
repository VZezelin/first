const MCP_URL = 'https://www.agentready.it.com/api/mcp';
const TARGET_URL = 'https://first-livid-omega.vercel.app';

async function rpc(body, sessionId) {
  const headers = {
    'content-type': 'application/json',
    'accept': 'application/json, text/event-stream',
    'user-agent': 'SignalLab-AgentReady-Submission/1.0',
  };
  if (sessionId) headers['mcp-session-id'] = sessionId;
  const response = await fetch(MCP_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    redirect: 'follow',
  });
  return {
    status: response.status,
    sessionId: response.headers.get('mcp-session-id') || sessionId || null,
    text: await response.text(),
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }
  if (req.query.confirm !== 'agentready-index-once') {
    return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  }

  try {
    const init = await rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'signal-lab-growth', version: '1.0.0' },
      },
    });

    if (init.status < 200 || init.status >= 300) {
      return res.status(502).json({ ok: false, stage: 'initialize', upstreamStatus: init.status, upstream: init.text.slice(0, 2000) });
    }

    const sessionId = init.sessionId;
    if (sessionId) {
      await rpc({ jsonrpc: '2.0', method: 'notifications/initialized' }, sessionId);
    }

    const call = await rpc({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'submit_site',
        arguments: { url: TARGET_URL },
      },
    }, sessionId);

    return res.status(call.status >= 200 && call.status < 300 ? 200 : 502).json({
      ok: call.status >= 200 && call.status < 300,
      target: TARGET_URL,
      initializeStatus: init.status,
      callStatus: call.status,
      upstream: call.text.slice(0, 4000),
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
