import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hookfit-production.up.railway.app';
const API_BASE = `${API_URL}/api`;

export async function analyzeVideoFile(file) {
  const formData = new FormData();
  formData.append('video', file);

  const response = await axios.post(`${API_BASE}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // 2 min timeout for large files
  });

  return response.data;
}

export async function analyzeVideoUrl(url) {
  const response = await axios.post(`${API_BASE}/analyze-url`, { url }, {
    timeout: 60000,
  });

  return response.data;
}

export async function getDemoAnalysis() {
  const response = await axios.get(`${API_BASE}/demo`, {
    timeout: 10000,
  });

  return response.data;
}

export async function checkHealth() {
  const response = await axios.get(`${API_BASE}/health`, {
    timeout: 5000,
  });

  return response.data;
}
