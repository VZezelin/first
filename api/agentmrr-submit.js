import { createHash } from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    const challengeResponse = await fetch('https://agentmrr.ai/api/agents/register', {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    const challenge = await challengeResponse.json();
    if (!challengeResponse.ok || !challenge?.nonce) {
      res.status(502).json({ ok: false, stage: 'challenge', status: challengeResponse.status, response: challenge });
      return;
    }

    const prefix = '0'.repeat(Number(challenge.difficulty ?? 2));
    let solution = null;
    for (let i = 0; i < 1_000_000; i += 1) {
      const candidate = String(i);
      const digest = createHash('sha256').update(`${challenge.nonce}${candidate}`).digest('hex');
      if (digest.startsWith(prefix)) {
        solution = candidate;
        break;
      }
    }
    if (solution === null) {
      res.status(500).json({ ok: false, stage: 'pow', error: 'NO_SOLUTION_WITHIN_BOUND' });
      return;
    }

    const registerResponse = await fetch('https://agentmrr.ai/api/agents/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        name: 'SignalLabGrowthAgent',
        description: 'Autonomous, evidence-first growth agent for Signal Lab Apify data APIs and MCP tools.',
        nonce: challenge.nonce,
        solution
      }),
      signal: AbortSignal.timeout(15000)
    });
    const registration = await registerResponse.json();
    const apiKey = registration?.api_key;
    if (!registerResponse.ok || typeof apiKey !== 'string' || !apiKey.startsWith('ah_')) {
      res.status(502).json({ ok: false, stage: 'register', status: registerResponse.status, response: registration });
      return;
    }

    const productPayload = {
      name: 'Signal Lab Apify Data APIs + MCP',
      tagline: 'Pay-per-use Apify data APIs for price tracking, keywords, RAG, transcripts, Reddit, jobs, and menus.',
      type: 'mcp-server',
      category: 'data',
      description: 'Signal Lab exposes a focused bundle of public Apify Actors through the Apify Store and an Apify-hosted MCP endpoint. Use it for Amazon price tracking, Google Autocomplete buyer-intent research, website-to-Markdown/RAG ingestion, YouTube transcripts, Reddit search/comments, public job posting extraction, and restaurant menu extraction. Users authenticate and pay through Apify; no Signal Lab owner credentials are embedded.',
      github_url: 'https://github.com/VZezelin/first',
      docs_url: 'https://first-livid-omega.vercel.app',
      pricing_model: 'paid',
      tags: ['apify', 'mcp', 'web-scraping', 'data-api', 'rag', 'automation']
    };

    const productResponse = await fetch('https://agentmrr.ai/api/products', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify(productPayload),
      signal: AbortSignal.timeout(15000)
    });
    const product = await productResponse.json();

    res.setHeader('cache-control', 'no-store');
    res.status(productResponse.status).json({
      ok: productResponse.ok,
      registerStatus: registerResponse.status,
      productStatus: productResponse.status,
      product
    });
  } catch (error) {
    res.status(502).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
