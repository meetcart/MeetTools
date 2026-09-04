export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, niche } = req.body;
  const rawKey = process.env.GEMINI_API_KEY;

  if (!rawKey) {
    return res.status(500).json({ error: 'API key not configured in Vercel' });
  }

  const apiKey = rawKey.trim();
  const prompt = `Act as an expert Instagram creator. Generate 3 viral hooks, a crisp caption with line-breaks, and 15 targeted hashtags for a reel about "${topic}" in the niche "${niche}". Keep it high-retention, engaging, and clear.`;

  // Fallback endpoints to ensure model match
  const endpoints = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
  ];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({ text: data.candidates[0].content.parts[0].text });
      }
    } catch (e) {
      continue;
    }
  }

  return res.status(500).json({ error: 'Model connection failed. Please check token permissions.' });
}
