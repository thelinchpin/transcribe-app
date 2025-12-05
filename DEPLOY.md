# Deploy to Render.com (FREE) - Step by Step

This guide will help you deploy your transcription app to Render.com's free tier.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] Render.com account (free)
- [ ] (Optional) Google account for ivrit.ai

**No API keys needed! Everything uses free demo pages!** 🎉

---

## Part 1: Push Your Code to GitHub

### Option A: Using GitHub Desktop (Easy)

1. Download GitHub Desktop: https://desktop.github.com/
2. Open GitHub Desktop
3. File → Add Local Repository → Choose your `transcribe-app` folder
4. Click "Create Repository"
5. Click "Publish Repository"
6. Uncheck "Keep this code private" (or keep it private, your choice)
7. Click "Publish Repository"

### Option B: Using Command Line

```bash
# Navigate to your app folder
cd transcribe-app

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/transcribe-app.git
git branch -M main
git push -u origin main
```

**Important**: Make sure `.env` is in `.gitignore` (it already is!)

---

## Part 2: Deploy on Render.com

### 2.1: Sign Up for Render

1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (easiest)

### 2.2: Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect Account" to link your GitHub
4. Find and select your `transcribe-app` repository
5. Click "Connect"

### 2.3: Configure Your Service

Fill in the following settings:

**Name**: 
```
transcribe-app
```
(or any name you prefer)

**Region**: 
```
Choose closest to you (e.g., Frankfurt for Europe)
```

**Branch**: 
```
main
```

**Runtime**: 
```
Docker
```
(Very important! Not Node)

**Instance Type**: 
```
Free
```

### 2.4: Add Environment Variables (OPTIONAL)

**Only if you want to use ivrit.ai:**

Click "Advanced" to expand, then under "Environment Variables", add:

**Variable 1:**
- Key: `GOOGLE_EMAIL`
- Value: `your_email@gmail.com`

**Variable 2:**
- Key: `GOOGLE_PASSWORD`
- Value: `your_password`

**If you don't use ivrit.ai**, skip this step entirely!

### 2.5: Deploy!

1. Scroll down and click "Create Web Service"
2. Wait 5-10 minutes for first deployment
3. Watch the logs - you'll see build progress
4. When you see "Your service is live 🎉", it's ready!

### 2.6: Get Your URL

Your app will be available at:
```
https://transcribe-app-XXXX.onrender.com
```

Copy this URL!

---

## Part 3: Use on Your Phone

### Android:

1. Open Chrome on your phone
2. Go to your Render URL
3. Tap the three dots (⋮) → "Add to Home screen"
4. Name it "Transcribe"
5. Tap "Add"
6. Now you have an icon on your home screen!

### iPhone:

1. Open Safari on your phone
2. Go to your Render URL
3. Tap the Share button
4. Tap "Add to Home Screen"
5. Name it "Transcribe"
6. Tap "Add"

---

## Understanding Free Tier Limitations

**What happens on free tier:**

- ✅ Unlimited requests per month
- ✅ 750 hours of runtime (way more than you need)
- ⚠️ Server "sleeps" after 15 minutes of no activity
- ⚠️ First request after sleep takes 30-60 seconds to wake up
- ⚠️ Transcription still takes 1-3 minutes after wake-up

**What this means in practice:**

1. Open app on phone → might take 30-60 sec to load (first time)
2. Upload file → transcription takes 1-3 minutes
3. If you use it again within 15 minutes → instant
4. If you wait > 15 minutes → another 30-60 sec wake-up

**This is perfectly fine for your use case** (2-3 times per day)!

---

## Upgrading (If Needed)

If the free tier is too slow, you can upgrade to Render's Starter plan:
- Cost: $7/month
- No sleep time (always-on)
- Faster performance
- But honestly, free tier should work fine for you!

---

## Troubleshooting

### "Build failed" error
- Check that `Docker` is selected (not Node)
- Check that `Dockerfile` is in your repository

### "Service unavailable" 
- Wait 30-60 seconds for server to wake up
- Refresh the page

### "ElevenLabs API error"
- Check your API key is correct in Render environment variables
- Check you haven't exceeded free tier limit (20 min/month)

### "ivrit.ai login failed"
- If you have 2FA on Google, create an app-specific password
- Or use a separate Google account without 2FA

### Can't find environment variables section
- Click "Advanced" to expand the section
- Add them BEFORE clicking "Create Web Service"

---

## Next Steps

Once deployed:

1. **Test it**: Upload a short audio file and verify all services work
2. **Bookmark**: Add to your phone's home screen for quick access
3. **Share**: If you want, share the URL with colleagues (they'll need their own API keys though)

---

## Updating Your App

When you make changes:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update"
   git push
   ```

2. Render will automatically redeploy (takes 5-10 min)

---

## Need Help?

Check the logs in Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Look for error messages

Common issues are usually:
- Missing/wrong API key
- Wrong runtime selected (should be Docker)
- Browser automation issues (AnyTranscribe/ivrit.ai might occasionally fail)

---

## Cost Summary

**Monthly costs:**
- Render: $0 (free tier)
- ElevenLabs English: $0 (free demo, unlimited!)
- ElevenLabs Hebrew: $0 (free demo, unlimited!)
- AnyTranscribe: $0 (always free)
- ivrit.ai: $0 (always free)

**Total: $0/month - UNLIMITED USAGE!** 🎉
