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

  // Check if it's the new AQ Auth key or classic AIza key
  const isAuthKey = apiKey.startsWith('AQ');
  const url = isAuthKey
    ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const headers = { 'Content-Type': 'application/json' };
  if (isAuthKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(500).json({ error: 'No response from AI model' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to AI service' });
  }
}
