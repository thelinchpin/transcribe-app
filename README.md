# Multi-Service Transcription App

A web application that transcribes audio files using multiple services (ElevenLabs, AnyTranscribe, and ivrit.ai) in parallel.

## Features

- 🎙️ Upload audio/video files from your phone or computer
- 🔄 Get transcriptions from multiple services simultaneously
- 📱 Mobile-friendly Progressive Web App (PWA)
- 🌍 Support for 100+ languages
- 📋 Easy copy-to-clipboard functionality
- 🎯 Compare transcription quality across services

## Services Supported

1. **ElevenLabs English** - Free demo page (unlimited!)
   - Uses: https://elevenlabs.io/speech-to-text/english
   - No API key needed
   
2. **ElevenLabs Hebrew** - Free demo page (unlimited!)
   - Uses: https://elevenlabs.io/speech-to-text/hebrew
   - No API key needed
   
3. **AnyTranscribe** - Free transcription service
   - 100+ languages
   - No API key needed (uses browser automation)
   
4. **ivrit.ai** - Hebrew transcription specialist
   - Best quality for Hebrew
   - Requires Google account authentication

## Prerequisites

- Node.js 18 or higher
- Google account (for ivrit.ai only - optional)

**That's it! No API keys needed!** 🎉

## Local Setup

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   - `ELEVENLABS_API_KEY`: Get from https://elevenlabs.io/app/settings/api-keys
   - `GOOGLE_EMAIL`: Your Google email (optional, for ivrit.ai)
   - `GOOGLE_PASSWORD`: Your Google password (optional, for ivrit.ai)

4. **Run the server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Deployment to Render.com (FREE)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: transcribe-app
   - **Environment**: Docker
   - **Plan**: Free
   - **Environment Variables** (OPTIONAL - only if using ivrit.ai):
     - `GOOGLE_EMAIL`: (your Google email)
     - `GOOGLE_PASSWORD`: (your Google password)

5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. Your app will be live at: `https://transcribe-app-XXXX.onrender.com`

### Step 3: Use on Your Phone

1. Open the Render URL in your phone's browser
2. Bookmark it or add to home screen for quick access
3. Upload audio files directly from your phone!

## Usage

1. **Upload File**: Click the upload area or drag & drop an audio/video file
2. **Select Services**: Choose which transcription services to use
3. **Select Language**: Choose the audio language (or auto-detect)
4. **Transcribe**: Click the button and wait 1-3 minutes
5. **Copy Results**: Compare and copy the best transcription

## Important Notes

### Free Tier Limitations

**Render.com Free Tier:**
- Spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month (plenty for personal use)

**ElevenLabs Free Tier:**
- ~20 minutes of transcription per month
- Resets monthly

**AnyTranscribe & ivrit.ai:**
- Free but slower (uses browser automation)
- May occasionally fail if sites update their UI

### Google Account Security

For ivrit.ai, you need to provide Google credentials. Recommendations:
1. Use an app-specific password if you have 2FA enabled
2. Or create a separate Google account just for this app
3. Store credentials securely as environment variables (never commit to git)

## Troubleshooting

### "ElevenLabs API key not configured"
- **This error shouldn't appear anymore!** We use the free demo pages now.
- If you see this, the code wasn't updated properly.

### "Puppeteer/Chrome errors"
- On Render, this is handled by the Docker container
- Locally, you may need to install Chrome dependencies

### "Google login failed"
- If you have 2FA, create an app-specific password
- Make sure credentials are correct in `.env`

### App is slow to respond
- First request wakes up the server (30-60 sec on free tier)
- Transcription takes 1-3 minutes depending on file length
- Multiple services run in parallel

## Cost Breakdown

**Option 1: Render Free Tier**
- Cost: $0/month
- Perfect for 2-3 transcriptions per day
- Server sleeps after 15 min inactivity

**Option 2: Railway Free Trial**
- Cost: $5 credit/month (lasts ~1 month with light usage)
- No sleep time
- Better performance

**Option 3: Paid Hosting (if needed)**
- Render Starter: $7/month
- Railway: ~$5-10/month usage-based
- Always-on, faster performance

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Architecture

```
Frontend (index.html)
    ↓
Express Server (server.js)
    ↓
├─→ ElevenLabs API (direct API call)
├─→ AnyTranscribe (Puppeteer automation)
└─→ ivrit.ai (Puppeteer with Google auth)
```

## Security Notes

- Never commit `.env` file to git
- Use environment variables for all credentials
- Render/Railway encrypt environment variables
- Audio files are deleted immediately after transcription

## Support

For issues:
1. Check the browser console for errors
2. Check server logs on Render dashboard
3. Verify API keys and credentials

## License

MIT License - feel free to modify and use!
