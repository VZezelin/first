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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  const upstream = await fetch(TARGET, { headers: { 'user-agent': 'SignalLab-AcquisitionVerifier/1.0' }, redirect: 'follow' });
  const html = await upstream.text();
  const forms = formsFrom(html);
  const likely = forms.filter(f => JSON.stringify(f).toLowerCase().includes('github') || JSON.stringify(f).toLowerCase().includes('mcp'));

  if (req.query.mode !== 'submit') {
    return res.status(200).json({ ok: true, upstreamStatus: upstream.status, url: upstream.url, forms: likely.length ? likely : forms, scriptSrcs: [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]).slice(-20) });
  }

  if (req.query.confirm !== CONFIRM) return res.status(400).json({ ok: false, error: 'CONFIRM_REQUIRED' });
  const form = (likely.length ? likely : forms)[0];
  if (!form) return res.status(409).json({ ok: false, error: 'NO_FORM_FOUND' });
  const method = String(form.attrs.method || 'GET').toUpperCase();
  const actionRaw = String(form.attrs.action || '');
  if (method !== 'POST' || !actionRaw) return res.status(409).json({ ok: false, error: 'NO_SAFE_POST_CONTRACT', form });
  const action = new URL(actionRaw, upstream.url).toString();
  if (new URL(action).origin !== new URL(TARGET).origin) return res.status(409).json({ ok: false, error: 'CROSS_ORIGIN_FORM', action });

  const body = new URLSearchParams();
  for (const input of form.inputs) {
    const name = typeof input.name === 'string' ? input.name : '';
    if (!name) continue;
    const type = String(input.type || 'text').toLowerCase();
    if (type === 'hidden' && typeof input.value === 'string') body.set(name, input.value);
  }
  const names = form.inputs.map(i => typeof i.name === 'string' ? i.name : '').filter(Boolean);
  const repoName = names.find(n => /github|repo/i.test(n)) || names.find(n => /url/i.test(n));
  const contactName = names.find(n => /contact|name/i.test(n));
  if (!repoName) return res.status(409).json({ ok: false, error: 'REPO_FIELD_NOT_FOUND', names, form });
  body.set(repoName, 'https://github.com/VZezelin/first');
  if (contactName) body.set(contactName, 'Signal Lab');

  const submitted = await fetch(action, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'SignalLab-AcquisitionVerifier/1.0', 'referer': upstream.url },
    body: body.toString(),
    redirect: 'manual'
  });
  const text = await submitted.text();
  return res.status(200).json({ ok: true, submitted: true, action, fields: [...body.keys()], upstreamStatus: submitted.status, location: submitted.headers.get('location'), bodyPrefix: text.slice(0, 3000) });
}
