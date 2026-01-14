import { onRequest } from 'firebase-functions/v2/https';
// For production (Blaze), switch to Secret Manager:
// import { defineSecret } from 'firebase-functions/params';
// const geminiApiKey = defineSecret('GEMINI_API_KEY');

function parseScore(text: string) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const obj = JSON.parse(jsonMatch[0]);
      if (typeof obj.score === 'number') return obj.score;
    }
  } catch {}

  const numMatch = text.match(/-?\d+(\.\d+)?/);
  if (numMatch) return Number(numMatch[0]);
  return null;
}

export const score = onRequest(
  {
    // For production (Blaze), enable secrets:
    // secrets: [geminiApiKey],
    cors: true,
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'method not allowed' });
      return;
    }

    const { templateBase64, compareBase64 } = req.body || {};
    if (!templateBase64 || !compareBase64) {
      res.status(400).json({ error: 'templateBase64 and compareBase64 are required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
      return;
    }
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: 'Compare these two images and return ONLY JSON like {"score": 0-100}.' },
                { inline_data: { mime_type: 'image/jpeg', data: templateBase64 } },
                { inline_data: { mime_type: 'image/jpeg', data: compareBase64 } }
              ],
            },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      res.status(502).json({ error: 'gemini api error', detail: errText });
      return;
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const scoreValue = parseScore(text);

    if (scoreValue == null || Number.isNaN(scoreValue)) {
      res.status(502).json({ error: 'failed to parse score', raw: text });
      return;
    }

    res.json({ score: scoreValue });
  }
);
