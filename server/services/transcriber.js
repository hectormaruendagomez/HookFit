import OpenAI from 'openai';
import fs from 'fs';

export async function transcribeAudio(audioPath) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('No OPENAI_API_KEY configured');
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'], // get segment timestamps
      // removed language: 'en' to allow auto-detection in case the video is in Spanish
    });

    let formattedTranscript = '';
    if (transcription.segments && transcription.segments.length > 0) {
      formattedTranscript = transcription.segments.map(seg => {
        const start = formatTime(seg.start);
        const end = formatTime(seg.end);
        return `[${start} - ${end}] ${seg.text.trim()}`;
      }).join('\n');
    } else {
      formattedTranscript = transcription.text;
    }

    return formattedTranscript;
  } catch (error) {
    console.error('Whisper transcription error:', error.message);
    throw error;
  }
}

function formatTime(seconds) {
  const pad = (num) => Math.floor(num).toString().padStart(2, '0');
  const m = pad(seconds / 60);
  const s = pad(seconds % 60);
  return `${m}:${s}`;
}
