// Vercel Serverless Function: /api/extract-data
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }
  try {
    // Call Google Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey;
    const geminiPayload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    };
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    });
    const geminiData = await geminiRes.json();
    // Extract structured data from Gemini response
    // Assume Gemini returns a JSON string in geminiData.candidates[0].content.parts[0].text
    let extracted;
    try {
      extracted = JSON.parse(geminiData.candidates[0].content.parts[0].text);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse Gemini response', details: geminiData });
    }
    return res.status(200).json(extracted);
  } catch (err) {
    return res.status(500).json({ error: 'Gemini API error', details: err.message });
  }
};