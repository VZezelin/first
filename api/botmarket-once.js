module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const endpoint = 'https://botmarket.bot/v1/submit';
  const sourceUrl = 'https://first-livid-omega.vercel.app/plugin.json';

  try {
    const dry = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'mcp', url: sourceUrl, dry_run: true }),
    });
    const dryText = await dry.text();

    if (!dry.ok) {
      return res.status(200).json({ ok: false, stage: 'dry_run', upstreamStatus: dry.status, upstreamBody: dryText.slice(0, 4000) });
    }

    const submit = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'mcp', url: sourceUrl }),
    });
    const submitText = await submit.text();

    return res.status(200).json({
      ok: submit.ok,
      stage: 'submit',
      sourceUrl,
      dryRunStatus: dry.status,
      dryRunBody: dryText.slice(0, 4000),
      upstreamStatus: submit.status,
      upstreamBody: submitText.slice(0, 4000),
    });
  } catch (error) {
    return res.status(200).json({ ok: false, stage: 'exception', error: error instanceof Error ? error.message : String(error) });
  }
};
