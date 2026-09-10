const SKILL_URL = 'https://github.com/VZezelin/first/tree/main/skills/signal-lab-apify-tools';
const SUMMARY_URL = 'https://audit-engine.oathe.ai/api/skill/VZezelin/first/tree/main/skills/signal-lab-apify-tools/summary';
const SUBMIT_URL = 'https://audit-engine.oathe.ai/api/submit';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  res.setHeader('Cache-Control', 'no-store');

  const auditId = typeof req.query?.audit_id === 'string' ? req.query.audit_id.trim() : '';
  if (auditId) {
    const status = await fetch(`https://audit-engine.oathe.ai/api/audit/${encodeURIComponent(auditId)}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    });
    const text = await status.text();
    return res.status(status.status).json({ ok: status.ok, action: 'status', upstreamStatus: status.status, body: text });
  }

  const existing = await fetch(SUMMARY_URL, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  const existingText = await existing.text();
  if (existing.ok) {
    return res.status(200).json({ ok: true, action: 'existing_summary', upstreamStatus: existing.status, body: existingText });
  }
  if (existing.status !== 404) {
    return res.status(502).json({ ok: false, action: 'summary_check', upstreamStatus: existing.status, body: existingText });
  }

  const submit = await fetch(SUBMIT_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'idempotency-key': 'signal-lab-apify-tools-20260911',
    },
    body: JSON.stringify({ skill_url: SKILL_URL }),
    signal: AbortSignal.timeout(20000),
  });
  const submitText = await submit.text();
  return res.status(submit.status).json({ ok: submit.ok, action: 'submitted', upstreamStatus: submit.status, body: submitText });
};
