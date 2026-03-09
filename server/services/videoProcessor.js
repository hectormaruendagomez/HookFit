import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

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
