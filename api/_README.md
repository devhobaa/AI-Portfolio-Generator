# API Endpoints

## /api/extract-data
- POST { prompt: string }
- Uses Google Gemini API to extract structured portfolio data.
- Returns: JSON with fields: name, profession, bio, skills, projects, github, linkedin, twitter, instagram, email, phone, additionalLinks.

## /api/generate-portfolio
- POST structured portfolio data
- Uses OpenRouter API (nvidia/nemotron-nano-9b-v2:free) to generate responsive portfolio HTML/CSS/JS.
- Returns: { html }
