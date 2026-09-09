const fs = require('node:fs');
const path = require('node:path');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const body = fs.readFileSync(path.join(process.cwd(), 'agentic-payments.html'), 'utf8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(body);
};
