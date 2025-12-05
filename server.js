import express from 'express';
import multer from 'multer';
import puppeteer from 'puppeteer';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// ======================
// ELEVENLABS SERVICE (Demo Page - FREE!)
// ======================
async function transcribeWithElevenLabs(filePath, language) {
  let browser;
  try {
    console.log('Starting ElevenLabs demo page with Puppeteer...');
    
    // Determine which demo page to use
    const url = language === 'he' 
      ? 'https://elevenlabs.io/speech-to-text/hebrew'
      : 'https://elevenlabs.io/speech-to-text/english';
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Navigate to ElevenLabs demo page
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('ElevenLabs demo page loaded');

    // Wait for file upload input
    await page.waitForSelector('input[type="file"]', { timeout: 15000 });

    // Find and upload file
    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      throw new Error('Could not find file upload input on ElevenLabs demo');
    }

    await fileInput.uploadFile(filePath);
    console.log('File uploaded to ElevenLabs demo');

    // Wait for transcription to appear
    // ElevenLabs demo shows results in a textarea or div with transcription
    await page.waitForFunction(
      () => {
        // Look for common result containers
        const textarea = document.querySelector('textarea[readonly]');
        const resultDiv = document.querySelector('[class*="transcript"], [class*="result"]');
        const text = textarea?.value || resultDiv?.textContent || '';
        return text.trim().length > 10;
      },
      { timeout: 180000 } // 3 minutes max
    );

    // Extract transcription text
    const transcription = await page.evaluate(() => {
      // Try multiple possible selectors
      const textarea = document.querySelector('textarea[readonly]');
      if (textarea && textarea.value.trim()) {
        return textarea.value.trim();
      }

      const resultDiv = document.querySelector('[class*="transcript"], [class*="result"]');
      if (resultDiv && resultDiv.textContent.trim()) {
        return resultDiv.textContent.trim();
      }

      // Fallback: look for any large text block
      const allText = document.body.innerText;
      return allText;
    });

    await browser.close();

    return {
      service: 'ElevenLabs (Demo)',
      text: transcription,
      success: true
    };

  } catch (error) {
    console.error('ElevenLabs demo error:', error);
    if (browser) await browser.close();
    
    return {
      service: 'ElevenLabs (Demo)',
      text: '',
      success: false,
      error: error.message
    };
  }
}

// ======================
// ANYTRANSCRIBE SERVICE
// ======================
async function transcribeWithAnyTranscribe(filePath, language = 'en') {
  let browser;
  try {
    console.log('Starting AnyTranscribe with Puppeteer...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Navigate to AnyTranscribe
    await page.goto('https://anytranscribe.com/core-tools/audio-video-to-text-converter/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('Page loaded');

    // Set language if not auto
    if (language !== 'auto') {
      try {
        await page.select('select[name="language"]', language);
      } catch (e) {
        console.log('Could not set language, using auto-detect');
      }
    }

    // Find and upload file
    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      throw new Error('Could not find file upload input');
    }

    await fileInput.uploadFile(filePath);
    console.log('File uploaded');

    // Click transcribe button
    await page.waitForSelector('button:has-text("Transcribe")', { timeout: 10000 });
    await page.click('button:has-text("Transcribe")');
    console.log('Transcribe button clicked');

    // Wait for transcription to complete (look for result div)
    await page.waitForFunction(
      () => {
        const resultDiv = document.querySelector('.transcription-result');
        return resultDiv && resultDiv.textContent.trim().length > 0;
      },
      { timeout: 180000 } // 3 minutes max
    );

    // Extract transcription text
    const transcription = await page.evaluate(() => {
      const resultDiv = document.querySelector('.transcription-result');
      return resultDiv ? resultDiv.textContent.trim() : '';
    });

    await browser.close();

    return {
      service: 'AnyTranscribe',
      text: transcription,
      success: true
    };

  } catch (error) {
    console.error('AnyTranscribe error:', error);
    if (browser) await browser.close();
    
    return {
      service: 'AnyTranscribe',
      text: '',
      success: false,
      error: error.message
    };
  }
}

// ======================
// IVRIT.AI SERVICE
// ======================
async function transcribeWithIvritAI(filePath) {
  let browser;
  try {
    console.log('Starting ivrit.ai with Puppeteer...');
    
    const googleEmail = process.env.GOOGLE_EMAIL;
    const googlePassword = process.env.GOOGLE_PASSWORD;

    if (!googleEmail || !googlePassword) {
      throw new Error('Google credentials not configured');
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Navigate to ivrit.ai transcription service
    await page.goto('https://transcribe.ivrit.ai/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('Page loaded');

    // Check if we need to login
    const loginButton = await page.$('button:has-text("התחברות עם Google")');
    
    if (loginButton) {
      console.log('Need to login with Google...');
      
      // Click Google login button
      await loginButton.click();
      
      // Wait for Google login popup
      await page.waitForNavigation({ timeout: 30000 });
      
      // Enter email
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      await page.type('input[type="email"]', googleEmail);
      await page.click('#identifierNext');
      
      // Enter password
      await page.waitForSelector('input[type="password"]', { timeout: 10000 });
      await page.type('input[type="password"]', googlePassword);
      await page.click('#passwordNext');
      
      // Wait for redirect back to ivrit.ai
      await page.waitForNavigation({ timeout: 30000 });
      console.log('Login successful');
    }

    // Upload file
    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      throw new Error('Could not find file upload input');
    }

    await fileInput.uploadFile(filePath);
    console.log('File uploaded to ivrit.ai');

    // Wait for transcription to complete
    await page.waitForFunction(
      () => {
        const result = document.querySelector('.transcription-output');
        return result && result.textContent.trim().length > 0;
      },
      { timeout: 300000 } // 5 minutes max
    );

    // Extract transcription
    const transcription = await page.evaluate(() => {
      const result = document.querySelector('.transcription-output');
      return result ? result.textContent.trim() : '';
    });

    await browser.close();

    return {
      service: 'ivrit.ai',
      text: transcription,
      success: true
    };

  } catch (error) {
    console.error('ivrit.ai error:', error);
    if (browser) await browser.close();
    
    return {
      service: 'ivrit.ai',
      text: '',
      success: false,
      error: error.message
    };
  }
}

// ======================
// API ENDPOINTS
// ======================

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const { services, language } = req.body;
    const filePath = req.file.path;

    console.log('Transcription request:', { services, language, filename: req.file.originalname });

    const selectedServices = JSON.parse(services || '["elevenlabs"]');
    const results = [];

    // Run transcriptions in parallel
    const promises = [];

    if (selectedServices.includes('elevenlabs-en')) {
      promises.push(transcribeWithElevenLabs(filePath, 'en'));
    }

    if (selectedServices.includes('elevenlabs-he')) {
      promises.push(transcribeWithElevenLabs(filePath, 'he'));
    }

    if (selectedServices.includes('anytranscribe')) {
      promises.push(transcribeWithAnyTranscribe(filePath, language));
    }

    if (selectedServices.includes('ivritai')) {
      promises.push(transcribeWithIvritAI(filePath));
    }

    const transcriptions = await Promise.allSettled(promises);

    transcriptions.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          service: 'Unknown',
          success: false,
          error: result.reason.message
        });
      }
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ results });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Transcription server running on port ${PORT}`);
  console.log(`📝 Upload endpoint: http://localhost:${PORT}/transcribe`);
});
