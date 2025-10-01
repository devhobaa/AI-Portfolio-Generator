import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Redirect root to landing page
app.get('/', (req, res) => {
  res.redirect('/landing.html');
});

// API Keys from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCxJ5-O-9jVQmWg3-8rx8GnqxTd8FtDqEk";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "sk-or-v1-your-actual-api-key-here";

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
});

// OpenRouter API configuration
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// Extract data from text using Gemini
app.post("/api/extract-data", async (req, res) => {
  try {
    const extractPrompt = `
استخرج البيانات التالية من النص المعطى وأعدها في صيغة JSON:

النص: ${req.body.prompt}

المطلوب استخراجه:
- name: الاسم الكامل
- profession: المهنة أو التخصص
- bio: نبذة شخصية
- skills: قائمة المهارات (array)
- projects: قائمة المشاريع مع الأسماء والأوصاف والروابط (array)
- github: رابط GitHub
- linkedin: رابط LinkedIn
- twitter: رابط Twitter
- instagram: رابط Instagram
- email: البريد الإلكتروني
- phone: رقم الهاتف
- additionalLinks: روابط إضافية (array of objects with name and url)

أعد فقط JSON بدون أي شرح أو تعليقات.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: extractPrompt
    });

    let extractedData = response.text || "{}";
    
    // Clean the response
    extractedData = extractedData.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    
    try {
      const data = JSON.parse(extractedData);
      res.json({ success: true, data });
    } catch (parseError) {
      res.json({ success: false, error: "Failed to parse extracted data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate portfolio from structured data using OpenRouter
app.post("/api/generate-portfolio", async (req, res) => {
  try {
    // Use a different variable name to avoid redeclaration
    const portfolioData = req.body;
    const designPrompt = portfolioData.designPrompt || 'Modern and elegant design';
    
    // Generate default images if not provided
    const getDefaultProfileImage = (profession) => {
      const professionImages = {
        'مطور': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'مصمم': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        'مهندس': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        'مدير': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        'developer': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'designer': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        'engineer': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        'manager': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
      };
      return professionImages[profession] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face';
    };

    const getDefaultProjectImage = (projectName) => {
      const projectImages = {
        'موقع': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        'تطبيق': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
        'نظام': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        'منصة': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop',
        'website': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        'app': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
        'system': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        'platform': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop'
      };
      return projectImages[Object.keys(projectImages).find(key => projectName.toLowerCase().includes(key))] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop';
    };

    const profileImage = portfolioData.profileImageUrl || getDefaultProfileImage(portfolioData.profession);
    const projectsWithImages = (portfolioData.projects || []).map(project => ({
      ...project,
      imageUrl: project.imageUrl || getDefaultProjectImage(project.name)
    }));

    const portfolioPrompt = `Create a clean, modern, and professional portfolio website. Use the following data:

Personal Information:
- Name: ${portfolioData.name || 'Not specified'}
- Profession: ${portfolioData.profession || 'Not specified'}
- Bio: ${portfolioData.bio || 'Not specified'}
- Skills: ${portfolioData.skills ? portfolioData.skills.join(', ') : 'Not specified'}
- Email: ${portfolioData.email || 'Not specified'}
- Phone: ${portfolioData.phone || 'Not specified'}
- GitHub: ${portfolioData.github || 'Not specified'}
- LinkedIn: ${portfolioData.linkedin || 'Not specified'}
- Twitter: ${portfolioData.twitter || 'Not specified'}
- Instagram: ${portfolioData.instagram || 'Not specified'}
- Profile Image: ${profileImage}
- Projects: ${JSON.stringify(projectsWithImages)}
- Additional Links: ${JSON.stringify(portfolioData.additionalLinks || [])}

Design Requirements:
${designPrompt}

DESIGN GUIDELINES - Create a CLEAN and ELEGANT website:

🎨 CLEAN DESIGN:
- Use simple, clean layouts with plenty of white space
- Implement subtle gradients and soft shadows
- Add gentle hover effects (scale 1.05, color transitions)
- Use clean typography with good contrast
- Keep animations minimal and smooth

🌈 COLOR SCHEME:
- Primary: Clean blue (#007bff) or teal (#00ffff)
- Secondary: Soft gray (#6c757d) or white
- Background: Light (#f8f9fa) or dark (#212529) based on preference
- Text: High contrast for readability
- Accents: Subtle color highlights

✨ SIMPLE ANIMATIONS:
- Fade-in effects on scroll
- Gentle hover transitions
- Smooth button interactions
- Simple loading states
- Clean transitions between sections

📱 RESPONSIVE DESIGN:
- Mobile-first approach
- Clean breakpoints
- Touch-friendly buttons
- Readable text on all devices

🎯 SECTIONS TO INCLUDE:
1. HERO: Clean header with name, title, and call-to-action
2. ABOUT: Simple bio section with clear typography
3. SKILLS: Clean skill bars or simple tags
4. PROJECTS: Grid layout with clean project cards
5. CONTACT: Simple contact form and social links

💫 CLEAN FEATURES:
- Good use of whitespace
- Clear hierarchy
- Readable fonts
- Simple navigation
- Clean buttons and forms
- Professional color scheme

🚀 TECHNICAL REQUIREMENTS:
- Use modern CSS Grid and Flexbox
- Include smooth scrolling
- Add basic responsive design
- Use semantic HTML5
- Include proper accessibility
- Keep code clean and organized

Create a portfolio that is professional, clean, and easy to read. Focus on content and usability over flashy effects. Make it look like a well-designed professional website.

Return ONLY the complete HTML code without any explanations or comments.`;

    // Use OpenRouter API with correct format
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Portfolio Generator",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "nvidia/nemotron-nano-9b-v2:free",
        "messages": [
          {
            "role": "user",
            "content": portfolioPrompt
          }
        ],
        "max_tokens": 8000,
        "temperature": 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let html = data.choices[0].message.content || "";
    
    // Clean the response
    html = html.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
    
    res.json({ success: true, html });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enhance portfolio code using Gemini
app.post("/api/enhance-portfolio", async (req, res) => {
  try {
    const { html, designPrompt } = req.body;
    
    if (!html) {
      return res.status(400).json({ success: false, error: "HTML code is required" });
    }

    const enhancementPrompt = `
تحسين وتحليل الكود التالي لموقع البورتوفوليو:

الكود الحالي:
${html}

متطلبات التصميم:
${designPrompt || 'تحسين عام للتصميم'}

المطلوب:
1. تحليل الكود الحالي وتحديد نقاط التحسين
2. تحسين التصميم البصري والألوان
3. إضافة تأثيرات hover وانيميشن لطيفة
4. تحسين التخطيط والمساحات البيضاء
5. تحسين الخطوط والتباين
6. إضافة تأثيرات بصرية جميلة ولكن غير معقدة
7. تحسين الاستجابة للأجهزة المختلفة
8. إضافة تفاعلات بسيطة وجميلة
9. تحسين الألوان والتدرجات
10. إضافة تأثيرات CSS متقدمة ولكن أنيقة

أعد الكود المحسن كاملاً مع:
- تحسينات بصرية جميلة
- تأثيرات hover لطيفة
- ألوان متدرجة أنيقة
- انيميشن بسيطة وسلسة
- تخطيط محسن
- خطوط جميلة
- مساحات بيضاء مناسبة
- تأثيرات بصرية أنيقة

أعد فقط الكود HTML المحسن بدون أي شرح أو تعليقات.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enhancementPrompt
    });

    let enhancedHtml = response.text || "";
    
    // Clean the response
    enhancedHtml = enhancedHtml.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
    
    res.json({ success: true, html: enhancedHtml });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    // إنشاء موقع بورتوفوليو احترافي
    const portfolioPrompt = `
أنت مولد مواقع بورتوفوليو احترافي. مهمتك إنشاء موقع بورتوفوليو كامل ومتجاوب باستخدام HTML و CSS و JavaScript.

المعلومات المطلوبة:
${req.body.prompt || "مطور ويب بخبرة 5 سنوات"}

المطلوب:
1. إنشاء موقع بورتوفوليو احترافي ومتجاوب
2. استخدام HTML5 و CSS3 و JavaScript
3. تصميم حديث وأنيق مع ألوان متناسقة
4. أقسام الموقع:
   - Hero Section: صورة شخصية، اسم، عنوان وظيفي، نبذة مختصرة
   - About Section: نبذة شخصية ومهنية
   - Skills Section: المهارات مع أيقونات
   - Projects Section: المشاريع مع صور وروابط
   - Contact Section: معلومات التواصل والوسائط الاجتماعية
5. استخدام CSS Grid و Flexbox للتصميم المتجاوب
6. إضافة تأثيرات hover وانيميشن خفيفة
7. استخدام خطوط Google Fonts
8. الألوان: تدرج أزرق/بنفسجي مع لمسات ذهبية
9. التأكد من أن الموقع يعمل على جميع الأجهزة

أعد فقط الكود HTML الكامل مع CSS و JavaScript مدمج، بدون أي شرح أو تعليقات.`;

    const portfolioResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: portfolioPrompt
    });

    let cleanHtml = portfolioResponse.text || "";
    
    // تنظيف النص من علامات الكود
    cleanHtml = cleanHtml.replace(/```[\w]*\n?/g, '');
    cleanHtml = cleanHtml.replace(/```/g, '');
    cleanHtml = cleanHtml.trim();
    
    // إرجاع النص المنظف
    res.json({
      choices: [{
        message: {
          content: cleanHtml
        }
      }]
    });
  } catch (error) {
    if (error.response) {
      // لو السيرفر رجع HTML أو Error
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


