import OpenAI from 'openai';
import fs from 'fs';

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function analyzeVideo({ transcript, fileSizeMB, fileName, duration, url, frames = [] }) {
  const openai = getOpenAIClient();
  if (!openai) {
    console.warn('No OPENAI_API_KEY set — returning mock analysis');
    return generateFallbackAnalysis(transcript);
  }

  const prompt = `You are HookFit AI — an expert short-form fitness content strategist.
Analyze this fitness video and return ONLY valid JSON, no markdown, no extra text.

File: ${fileName}
Duration: ${duration}
Size: ${fileSizeMB || 'unknown'} MB
${url ? `URL: ${url}` : ''}

Transcript (with precise timestamps):
${transcript}

Note: Use the exact timestamps provided in the transcript for your retention_risks analysis. Do not invent timestamps.
Also, analyze the attached video frames (if any) to evaluate the visual hook, body language, text overlays, and framing.

Return this exact JSON schema:
{
  "hook_score": <number 0-10>,
  "hook_feedback": "<string>",
  "hook_improvement": "<string>",
  "retention_risks": [{"timestamp": "<string>", "issue": "<string>", "suggestion": "<string>"}],
  "clarity_score": <number 0-10>,
  "core_message_detected": "<string>",
  "clarity_feedback": "<string>",
  "clarity_improvement": "<string>",
  "energy_assessment": "<'Low' | 'Balanced' | 'High'>",
  "energy_details": {
    "speech_tempo": "<string>",
    "vocal_variation": "<string>",
    "authority_perception": "<'Weak' | 'Neutral' | 'Strong'>",
    "improvement": "<string>"
  },
  "strategic_type": "<'Reach' | 'Authority' | 'Conversion' | 'Community'>",
  "strategic_type_confidence": <number 0-100>,
  "strategic_alignment_feedback": "<string>",
  "strategic_optimization": ["<string>", "<string>"],
  "overall_score": <number 0-10>,
  "top_priority": "<string>"
}`;

  const userContent = [
    { type: 'text', text: prompt }
  ];

  // Attach images if available
  if (frames && frames.length > 0) {
    for (const frame of frames) {
      if (fs.existsSync(frame)) {
        const base64Image = fs.readFileSync(frame).toString('base64');
        userContent.push({
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
            detail: 'low'
          }
        });
      }
    }
  }

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Updated to gpt-4o-mini
      messages: [{ role: 'user', content: userContent }],
      temperature: 0.4,
    });

    const text = result.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (error) {
    console.error('OpenAI analysis failed:', error.message);
    return generateFallbackAnalysis(transcript);
  }
}

function generateFallbackAnalysis(transcript) {
  return {
    hook_score: 5,
    hook_feedback: "Analysis could not be completed. Consider opening with a bold claim or question.",
    hook_improvement: "Try leading with a specific, measurable claim that creates curiosity.",
    retention_risks: [{ timestamp: "00:05", issue: "Potential pacing issue", suggestion: "Ensure a quick transition from hook to content" }],
    clarity_score: 5,
    core_message_detected: transcript?.substring(0, 100) || "Could not detect core message",
    clarity_feedback: "Unable to perform deep clarity analysis.",
    clarity_improvement: "Structure as: Hook → Problem → Solution → CTA",
    energy_assessment: "Balanced",
    energy_details: {
      speech_tempo: "Unable to assess",
      vocal_variation: "Unable to assess",
      authority_perception: "Neutral",
      improvement: "Try varying your vocal tone and pace"
    },
    strategic_type: "Authority",
    strategic_type_confidence: 50,
    strategic_alignment_feedback: "Without full analysis, defaulting to Authority classification.",
    strategic_optimization: ["Ensure your hook matches your content type", "Add a clear CTA"],
    overall_score: 5.0,
    top_priority: "Set up your OpenAI API key for full AI-powered analysis."
  };
}
