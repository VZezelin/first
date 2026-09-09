module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const url = 'https://first-livid-omega.vercel.app';
  const headers = { 'content-type': 'application/json', 'user-agent': 'SignalLab-Acquisition/1.0' };

  try {
    const dry = await fetch('https://mydentify.com/api/imports/dry-run', {
      method: 'POST',
      headers,
      body: JSON.stringify({ url }),
    });
    const dryText = await dry.text();
    let dryBody;
    try { dryBody = JSON.parse(dryText); } catch { dryBody = { raw: dryText }; }

    if (!dry.ok) {
      return res.status(200).json({ ok: false, stage: 'dry-run', status: dry.status, response: dryBody });
    }

    if (dryBody && dryBody.duplicate) {
      return res.status(200).json({ ok: true, stage: 'duplicate', dryRun: dryBody, importSkipped: true });
    }

    const create = await fetch('https://mydentify.com/api/imports', {
      method: 'POST',
      headers: { ...headers, 'Idempotency-Key': 'signal-lab-first-20260910' },
      body: JSON.stringify({
        url,
        mode: 'listing',
        source: 'agent',
        submittedByAgent: 'Signal Lab',
      }),
    });
    const createText = await create.text();
    let createBody;
    try { createBody = JSON.parse(createText); } catch { createBody = { raw: createText }; }

    return res.status(200).json({
      ok: create.ok,
      stage: 'import',
      dryRun: dryBody,
      importStatus: create.status,
      import: createBody,
    });
  } catch (error) {
    return res.status(200).json({ ok: false, stage: 'exception', error: String(error && error.message ? error.message : error) });
  }
};
