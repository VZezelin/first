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
  return scripts.find(s => /submitMcp\s*\(/.test(s)) || null;
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
    return res.status(200).json({ ok: true, upstreamStatus: upstream.status, url: upstream.url, forms: likely.length ? likely : forms, inlineSubmitScript: inlineSubmitScript?.slice(0, 8000) || null, scriptSrcs: [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]).slice(-20) });
  }

  if (req.query.confirm !== CONFIRM) return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  if (!inlineSubmitScript) return res.status(409).json({ ok: false, error: 'SUBMIT_SCRIPT_NOT_FOUND' });
  const endpointMatch = inlineSubmitScript.match(/fetch\(\s*["']([^"']+)["']/);
  if (!endpointMatch) return res.status(409).json({ ok: false, error: 'FETCH_ENDPOINT_NOT_FOUND', script: inlineSubmitScript.slice(0, 8000) });
  const endpoint = new URL(endpointMatch[1], upstream.url).toString();
  if (new URL(endpoint).origin !== new URL(TARGET).origin) return res.status(409).json({ ok: false, error: 'CROSS_ORIGIN_ENDPOINT', endpoint });

  const bodyShape = inlineSubmitScript.includes('github_url') ? { github_url: 'https://github.com/VZezelin/first', submitter: 'Signal Lab' }
    : inlineSubmitScript.includes('githubUrl') ? { githubUrl: 'https://github.com/VZezelin/first', submitter: 'Signal Lab' }
    : inlineSubmitScript.includes('url:') ? { url: 'https://github.com/VZezelin/first', submitter: 'Signal Lab' }
    : null;
  if (!bodyShape) return res.status(409).json({ ok: false, error: 'BODY_SHAPE_UNCLEAR', script: inlineSubmitScript.slice(0, 8000) });

  const submitted = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'SignalLab-AcquisitionVerifier/1.0', 'referer': upstream.url },
    body: JSON.stringify(bodyShape),
    redirect: 'manual'
  });
  const text = await submitted.text();
  return res.status(200).json({ ok: true, submitted: true, endpoint, payloadKeys: Object.keys(bodyShape), upstreamStatus: submitted.status, location: submitted.headers.get('location'), bodyPrefix: text.slice(0, 3000) });
}
