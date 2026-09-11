const TARGET = 'https://www.kiprio.com/mcp-registry/';
const CONFIRM = 'signal-lab-kiprio-once-20260911-7f3c9a';

function parseAttrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    const k = (m[1] || '').toLowerCase();
    if (!k) continue;
    out[k] = m[2] ?? m[3] ?? m[4] ?? true;
  }
  return out;
}

function formsFrom(html) {
  return [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/gi)].map((m, i) => {
    const block = m[0];
    const open = block.match(/<form\b[^>]*>/i)?.[0] || '<form>';
    const attrs = parseAttrs(open);
    const inputs = [...block.matchAll(/<input\b[^>]*>/gi)].map(x => parseAttrs(x[0]));
    const buttons = [...block.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/gi)].map(x => x[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    return { index: i, attrs, inputs, buttons, snippet: block.slice(0, 5000) };
  });
}

function submitScript(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  return scripts.find(s => /function\s+submitMcp\s*\(/.test(s)) || null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  const upstream = await fetch(TARGET, { headers: { 'user-agent': 'SignalLab-AcquisitionVerifier/1.0' }, redirect: 'follow' });
  const html = await upstream.text();
  const forms = formsFrom(html);
  const likely = forms.filter(f => JSON.stringify(f).toLowerCase().includes('github') || JSON.stringify(f).toLowerCase().includes('mcp'));
  const inlineSubmitScript = submitScript(html);

  if (req.query.mode !== 'submit') {
    return res.status(200).json({ ok: true, upstreamStatus: upstream.status, url: upstream.url, forms: likely.length ? likely : forms, inlineSubmitScript: inlineSubmitScript?.slice(0, 8000) || null });
  }

  if (req.query.confirm !== CONFIRM) return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  if (!inlineSubmitScript || !inlineSubmitScript.includes("fetch('https://kiprio.com/api/mcp-submit'")) {
    return res.status(409).json({ ok: false, error: 'EXPECTED_SUBMIT_CONTRACT_NOT_FOUND' });
  }
  const endpoint = 'https://kiprio.com/api/mcp-submit';
  const payload = { github_url: 'https://github.com/VZezelin/first', submitter: 'Signal Lab' };
  const submitted = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'SignalLab-AcquisitionVerifier/1.0', 'referer': upstream.url },
    body: JSON.stringify(payload),
    redirect: 'manual'
  });
  const text = await submitted.text();
  return res.status(200).json({ ok: true, submitted: true, endpoint, upstreamStatus: submitted.status, location: submitted.headers.get('location'), bodyPrefix: text.slice(0, 3000) });
}
