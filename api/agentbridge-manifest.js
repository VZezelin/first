const fs = require('node:fs');
const path = require('node:path');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const manifestPath = path.join(process.cwd(), '.well-known', 'agentbridge.json');
  const body = fs.readFileSync(manifestPath, 'utf8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).send(body);
};
