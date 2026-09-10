const ENDPOINT = 'https://www.awesomeskills.dev/api/v1/submit';
const SKILL_URL = 'https://github.com/VZezelin/first/tree/main/skills/signal-lab-apify-tools';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' }));
  }
  try {
    const upstream = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'user-agent': 'SignalLabSubmission/1.0',
        'origin': 'https://www.awesomeskills.dev',
        'referer': 'https://www.awesomeskills.dev/en/submit',
      },
      body: JSON.stringify({ url: SKILL_URL }),
      redirect: 'manual',
    });
    const text = await upstream.text();
    res.statusCode = 200;
    return res.end(JSON.stringify({
      ok: upstream.ok,
      upstreamStatus: upstream.status,
      location: upstream.headers.get('location'),
      body: text.slice(0, 4000),
    }));
  } catch (error) {
    res.statusCode = 502;
    return res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
  }
}
