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
      response_format: 'text',
      language: 'en'
    });

    return transcription;
  } catch (error) {
    console.error('Whisper transcription error:', error.message);
    throw error;
  }
}
