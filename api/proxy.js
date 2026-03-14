export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) return res.status(400).json({ error: 'Missing url param' });

  const response = await fetch(decodeURIComponent(url));
  const contentType = response.headers.get('content-type') || 'application/json';
  const body = await response.text();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', contentType);
  res.status(response.status).send(body);
}