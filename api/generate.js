export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, niche } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Please enter a topic' });
  }

  const cleanTopic = topic.trim();
  const tagTopic = cleanTopic.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const selectedNiche = (niche || 'Viral Content').trim();

  // Smart Content Engine
  const hooks = [
    `1. "Stop scrolling if you want to master ${cleanTopic}..."`,
    `2. "The biggest mistake everyone makes with ${cleanTopic} in 2026!"`,
    `3. "Nobody is talking about this secret hack for ${cleanTopic}."`
  ];

  const responseText = `🔥 3 VIRAL HOOKS:
${hooks.join('\n')}

📝 CAPTION:
Most people struggle with ${cleanTopic} because they overcomplicate the basics. 

Here is the exact framework to stay ahead in ${selectedNiche}:
• Master the fundamentals before chasing shortcuts
• Focus on retention in the first 3 seconds
• Provide practical value without the fluff

Save this reel so you don't forget it later! 📌

🏷️ HASHTAGS:
#${tagTopic} #viralreels #${tagTopic}tips #growthhacks #creatoreconomy #reelsindia #trendingreels #instatips #foryoupage #contentcreation #viralvideo #explorepage #reelsviral`;

  return res.status(200).json({ text: responseText });
}
