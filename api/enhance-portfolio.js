// Vercel Serverless Function: /api/enhance-portfolio
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { html, designPrompt } = req.body;
  if (!html || !designPrompt) {
    return res.status(400).json({ error: 'Missing html or designPrompt' });
  }
  try {
    // هنا يمكن إضافة منطق تحسين الكود باستخدام الذكاء الاصطناعي أو أي خدمة خارجية
    // حالياً سنعيد نفس الكود مع success=true
    return res.status(200).json({ success: true, html });
  } catch (err) {
    return res.status(500).json({ error: 'Enhance API error', details: err.message });
  }
};
