import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

export async function extractAudio(videoPath) {
  const audioPath = videoPath.replace(/\.[^.]+$/, '.mp3');

  try {
    // Try using ffmpeg to extract audio
    await execAsync(
      `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -ar 16000 -ac 1 -y "${audioPath}"`,
      { timeout: 60000 }
    );
    return audioPath;
  } catch (error) {
    console.warn('FFmpeg extraction failed:', error.message);
    console.warn('Make sure FFmpeg is installed: https://ffmpeg.org/download.html');

    // Fallback: just use the video file directly (Whisper can handle some video formats)
    return videoPath;
  }
}

export async function getVideoDuration(videoPath) {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`,
      { timeout: 15000 }
    );
    return parseFloat(stdout.trim());
  } catch {
    return null;
  }
}

export async function extractFrames(videoPath) {
  const framesDir = path.join(path.dirname(videoPath), 'frames_' + Date.now());
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }

  const outputPattern = path.join(framesDir, 'frame_%03d.jpg');

  try {
    // Extract 1 frame every 5 seconds, max 6 frames
    await execAsync(
      `ffmpeg -i "${videoPath}" -vf "fps=1/5" -vframes 6 -q:v 2 "${outputPattern}"`,
      { timeout: 60000 }
    );

    const files = fs.readdirSync(framesDir);
    return files.filter(f => f.endsWith('.jpg')).map(f => path.join(framesDir, f));
  } catch (error) {
    console.warn('FFmpeg frame extraction failed:', error.message);
    return [];
  }
}
