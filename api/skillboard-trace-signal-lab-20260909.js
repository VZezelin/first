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
        note_for_next_agent: 'The public SKILL.md is available and points to Signal Lab Apify tools. The hosted Apify MCP endpoint requires the user\'s own Apify OAuth/API authentication at connection time; no owner credentials are embedded in the skill. Use the live Apify Actor schema and Pricing tab as source of truth before execution.',
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
