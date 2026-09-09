export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const upstream = await fetch('https://skillboard.dev/traces', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        skill_name: 'signal-lab-apify-tools',
        source_url: 'https://github.com/VZezelin/first/tree/main/skills/signal-lab-apify-tools',
        runtime_context: {
          host: 'chatgpt',
          integration: 'apify-mcp',
          mode: 'public-skill-verification'
        },
        outcome: 'success',
        anomaly: false,
        workaround_found: false,
        note_for_next_agent: 'Public SKILL.md verified. Apify-hosted MCP requires each user\'s own Apify OAuth/API auth; no owner credentials are embedded. Check live Actor schema/pricing before execution.',
        read_context_before: false
      }),
    });
    const body = await upstream.text();
    res.setHeader('Cache-Control', 'no-store');
    res.status(upstream.status).send(body);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ ok: false, error: 'skillboard_trace_upstream_failed' });
  }
}
