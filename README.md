# AI Portfolio Generator

An intelligent portfolio generator that uses AI to create professional portfolio websites from user input. The application extracts personal and professional information and generates clean, modern, responsive portfolio websites.

## Features

- 🤖 **AI-Powered Data Extraction**: Uses Google Gemini AI to extract structured data from user input
- 🎨 **Modern Design Generation**: Creates clean, professional portfolio designs using OpenRouter API
- 📱 **Responsive Design**: Mobile-first approach with clean breakpoints
- 🎯 **Multiple Sections**: Hero, About, Skills, Projects, and Contact sections
- ✨ **Clean Animations**: Subtle hover effects and smooth transitions
- 🌈 **Professional Color Schemes**: Clean blue/teal gradients with high contrast
- 🔧 **Enhancement Tools**: AI-powered code enhancement and optimization

## Tech Stack

- **Backend**: Node.js with Express
- **AI Services**: Google Gemini AI, OpenRouter API
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Modern CSS Grid and Flexbox
- **Fonts**: Google Fonts integration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/devhobaa/AI-Portfolio-Generator.git
cd AI-Portfolio-Generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Add your API keys to `.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

5. Start the server:
```bash
npm start
```

## Usage

1. Navigate to `http://localhost:3000`
2. Enter your personal and professional information
3. Choose your design preferences
4. Let AI generate your professional portfolio
5. Download or deploy your generated portfolio

## API Endpoints

- `POST /api/extract-data` - Extract structured data from text input
- `POST /api/generate-portfolio` - Generate complete portfolio HTML
- `POST /api/enhance-portfolio` - Enhance existing portfolio code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.
