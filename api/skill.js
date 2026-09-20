const fs = require('node:fs');
const path = require('node:path');

const SKILLS = {
  'signal-lab-apify-tools': 'skills/signal-lab-apify-tools/SKILL.md',
  'youtube-transcript-api': 'skills/youtube-transcript-api/SKILL.md',
};

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }

  const rawName = Array.isArray(req.query?.name) ? req.query.name[0] : req.query?.name;
  const skillPath = SKILLS[String(rawName || '')];
  if (!skillPath) return res.status(404).end();

  const body = fs.readFileSync(path.join(process.cwd(), skillPath), 'utf8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'));

  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).send(body);
};
