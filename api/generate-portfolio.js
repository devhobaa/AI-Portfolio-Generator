// Vercel Serverless Function: /api/generate-portfolio
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const data = req.body;
  if (!data) {
    return res.status(400).json({ error: 'Missing portfolio data' });
  }
  try {
    // Call OpenRouter API
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
  const prompt = `Generate a complete modern portfolio website in HTML, CSS, and JS using the following data: ${JSON.stringify(data)}. The design must be fully responsive and look great on all device sizes (mobile, tablet, desktop). For the contact section, do NOT use a form; instead, provide direct contact links (buttons or icons) to the user's social media and contact info from the data. Use a clean, professional, and visually appealing layout.`;
    const payload = {
      model: 'nvidia/nemotron-nano-9b-v2:free',
      messages: [{ role: 'user', content: prompt }]
    };
    const openRouterRes = await fetch(openRouterUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const openRouterData = await openRouterRes.json();
    // Assume HTML is in openRouterData.choices[0].message.content
    const html = openRouterData.choices?.[0]?.message?.content || '';
    return res.status(200).json({ html });
  } catch (err) {
    return res.status(500).json({ error: 'OpenRouter API error', details: err.message });
  }
};