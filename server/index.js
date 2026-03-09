import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { analyzeVideo } from './services/analyzer.js';
import { transcribeAudio } from './services/transcriber.js';
import { extractAudio } from './services/videoProcessor.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.mov', '.webm', '.avi'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (mp4, mov, webm, avi) are allowed'));
    }
  }
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'HookFit API' });
});

// Analyze video endpoint
app.post('/api/analyze', upload.single('video'), async (req, res) => {
  try {
    const videoUrl = req.body?.url;
    const videoFile = req.file;

    if (!videoFile && !videoUrl) {
      return res.status(400).json({ error: 'Please upload a video file or provide a URL' });
    }

    let filePath = videoFile?.path;
    let transcript = '';

    // If URL provided (placeholder — real URL downloading would need yt-dlp etc.)
    if (videoUrl && !videoFile) {
      return res.status(200).json({
        success: true,
        message: 'URL analysis',
        analysis: generateMockAnalysis(videoUrl)
      });
    }

    // Extract audio and transcribe
    try {
      const audioPath = await extractAudio(filePath);
      transcript = await transcribeAudio(audioPath);
      // Clean up audio file
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    } catch (err) {
      console.warn('Transcription failed, using fallback:', err.message);
      transcript = '[Transcription unavailable — analysis based on metadata only]';
    }

    // Get video duration / metadata
    const stats = fs.statSync(filePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    // Run AI analysis
    const analysis = await analyzeVideo({
      transcript,
      fileSizeMB,
      fileName: videoFile.originalname,
      duration: req.body?.duration || 'unknown'
    });

    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, analysis });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Analyze from URL (simple endpoint)
app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // For MVP, generate analysis based on URL
    // In production, you'd download the video, extract audio, transcribe, etc.
    const analysis = await analyzeVideo({
      transcript: '[Video from URL - transcript extraction pending]',
      url,
      fileName: url,
      duration: 'unknown'
    });

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('URL analysis error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Demo endpoint with mock data
app.get('/api/demo', (req, res) => {
  res.json({
    success: true,
    analysis: generateMockAnalysis('demo')
  });
});

function generateMockAnalysis(source) {
  return {
    hook_score: 7,
    hook_feedback: "Strong opening with a direct callout ('Stop doing this exercise wrong'). Creates curiosity but could add more urgency. The visual hook is decent but a more dramatic opening frame would boost retention.",
    hook_improvement: "Try: 'This one mistake is killing your chest gains — and 90% of guys do it every set.'",
    retention_risks: [
      {
        timestamp: "00:04",
        issue: "Slow transition after hook",
        suggestion: "Cut 1 second of dead space between hook and first tip. Jump straight into the demonstration."
      },
      {
        timestamp: "00:12",
        issue: "Pacing slowdown — repetitive explanation",
        suggestion: "Trim the repeated phrase. One clear sentence is stronger than two similar ones."
      },
      {
        timestamp: "00:22",
        issue: "Energy drop in mid-section",
        suggestion: "Add a visual cut or change camera angle here to re-engage viewers."
      },
      {
        timestamp: "00:35",
        issue: "No visual change for 6+ seconds",
        suggestion: "Insert B-roll or a text overlay to maintain visual interest."
      }
    ],
    clarity_score: 6,
    core_message_detected: "Proper bench press form requires elbow angle adjustment for better chest activation.",
    clarity_feedback: "The core message is identifiable but buried. Lead with the takeaway, then demonstrate. Currently the advice comes too late in the video, risking viewer drop-off before the payoff.",
    clarity_improvement: "Restructure: State the fix in the first 5 seconds → Show wrong vs right → End with result/benefit.",
    energy_assessment: "Balanced",
    energy_details: {
      speech_tempo: "Moderate — good baseline but could increase slightly in the hook",
      vocal_variation: "Limited — stays in a narrow tonal range. Adding emphasis on key words would strengthen delivery.",
      authority_perception: "Neutral",
      improvement: "Open with a more commanding tone. Drop your voice slightly on key statements for authority. Speed up during transitions."
    },
    strategic_type: "Authority",
    strategic_type_confidence: 85,
    strategic_alignment_feedback: "This video is structured as Authority Content — you're teaching a specific technique to build credibility. The structure partially aligns: the teaching element is strong, but the hook leans more toward Reach (attention-grabbing) without fully committing to either strategy.",
    strategic_optimization: [
      "For Authority: Add a credentials mention or visual proof (e.g., client results) in the first 3 seconds.",
      "For Authority: End with a specific, measurable claim ('Try this for 2 weeks — you'll feel the difference on your first set').",
      "If shifting to Reach: Make the hook more controversial or surprising to maximize shares."
    ],
    overall_score: 6.5,
    top_priority: "Tighten the first 5 seconds — your hook has potential but loses momentum immediately after. A stronger transition into the content would significantly improve retention.",
    source
  };
}

app.listen(PORT, () => {
  console.log(`\n⚡ HookFit API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Demo:   http://localhost:${PORT}/api/demo\n`);
});
