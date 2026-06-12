import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const TOPIC_RE = /^wt-[0-9a-f]{16}$/;

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { topic, lng, lat } = req.body ?? {};
      if (!TOPIC_RE.test(topic ?? '') || typeof lng !== 'number' || typeof lat !== 'number'
          || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        return res.status(400).json({ error: 'bad request' });
      }
      await sql`INSERT INTO live_shares (topic, lng, lat, updated_at) VALUES (${topic}, ${lng}, ${lat}, now())
                ON CONFLICT (topic) DO UPDATE SET lng = ${lng}, lat = ${lat}, updated_at = now()`;
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'GET') {
      const topic = req.query.topic;
      if (!TOPIC_RE.test(topic ?? '')) return res.status(400).json({ error: 'bad request' });
      const rows = await sql`SELECT lng, lat, extract(epoch FROM updated_at) * 1000 AS t
                             FROM live_shares WHERE topic = ${topic}`;
      return res.status(200).json(rows[0] ?? null);
    }
    if (req.method === 'DELETE') {
      const topic = req.query.topic;
      if (TOPIC_RE.test(topic ?? '')) await sql`DELETE FROM live_shares WHERE topic = ${topic}`;
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    console.error('share api:', e);
    return res.status(500).json({ error: 'server error' });
  }
}
