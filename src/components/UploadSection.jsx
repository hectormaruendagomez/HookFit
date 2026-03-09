import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Link, Film, ArrowRight, Sparkles, X, CloudUpload, Play, ExternalLink } from 'lucide-react';
import { analyzeVideoFile, analyzeVideoUrl, getDemoAnalysis } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function UploadSection({ onAnalysisStart, onAnalysisComplete, onError }) {
  const [mode, setMode] = useState('upload');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const { t } = useLanguage();
  const u = t.upload;

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    onAnalysisStart();
    try {
      let result;
      if (mode === 'upload' && file) {
        result = await analyzeVideoFile(file);
      } else if (mode === 'url' && url.trim()) {
        result = await analyzeVideoUrl(url.trim());
      } else {
        throw new Error('Please upload a video or paste a URL');
      }
      onAnalysisComplete(result.analysis);
    } catch (err) {
      onError(err.response?.data?.error || err.message || 'Analysis failed');
    }
  };

  const handleDemo = async () => {
    onAnalysisStart();
    try {
      const result = await getDemoAnalysis();
      onAnalysisComplete(result.analysis);
    } catch (err) {
      onError('Demo failed — is the server running?');
    }
  };

  const canAnalyze = (mode === 'upload' && file) || (mode === 'url' && url.trim());

  return (
    <section className="pb-24 px-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="max-w-2xl mx-auto">
        {/* Section label */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-gray-200" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{u.sectionLabel}</span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-gray-200" />
        </div>

        {/* Mode Toggle — sleeker */}
        <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-8 border border-gray-200">
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === 'upload'
                ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <CloudUpload className="w-4.5 h-4.5" />
            {u.tabUpload}
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === 'url'
                ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            {u.tabUrl}
          </button>
        </div>

        {/* Upload Zone — premium design */}
        {mode === 'upload' && (
          <div
            {...getRootProps()}
            className={`relative rounded-3xl transition-all duration-500 cursor-pointer group overflow-hidden ${
              isDragActive
                ? 'ring-2 ring-brand-400 ring-offset-2 ring-offset-white'
                : file
                ? ''
                : 'hover:border-gray-300'
            }`}
          >
            <input {...getInputProps()} />

            {/* Background with animated border */}
            <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
              isDragActive
                ? 'bg-emerald-50'
                : file
                ? 'bg-emerald-50/50'
                : 'bg-gray-50'
            }`} />

            {/* Dashed border — animated on drag */}
            <div className={`absolute inset-0 rounded-3xl border-2 border-dashed transition-all duration-500 ${
              isDragActive
                ? 'border-brand-400'
                : file
                ? 'border-brand-300'
                : 'border-gray-300 group-hover:border-gray-400'
            }`} />

            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-brand-400/40 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-brand-400/40 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-brand-400/40 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-brand-400/40 rounded-br-lg" />

            <div className="relative p-12 md:p-16 text-center">
              {file ? (
                <div className="space-y-4">
                  {/* Animated film icon */}
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-brand-500/15 rounded-2xl blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-brand-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/20">
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-lg">{file.name}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB — {u.readyToAnalyze}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="inline-flex items-center gap-1.5 text-gray-400 hover:text-red-500 text-sm transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-300"
                  >
                    <X className="w-3.5 h-3.5" />
                    {u.remove}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Upload icon with glow */}
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-gray-200/30 rounded-2xl blur-xl group-hover:bg-brand-500/10 transition-colors duration-500" />
                    <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-gray-200 group-hover:border-brand-300 transition-all duration-500 shadow-sm">
                      <Upload className="w-8 h-8 text-gray-300 group-hover:text-brand-500 transition-colors duration-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-lg group-hover:text-brand-600 transition-colors">
                      {isDragActive ? u.dropHere : u.dragDrop}
                    </p>
                    <p className="text-gray-400 text-sm mt-1.5">
                      {u.fileTypes}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-8 bg-gray-200" />
                    <span className="text-gray-400 text-xs font-medium">{u.orBrowse}</span>
                    <div className="h-px w-8 bg-gray-200" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* URL Input — premium */}
        {mode === 'url' && (
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="space-y-6">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-blue-100 rounded-2xl blur-xl" />
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                  <Link className="w-7 h-7 text-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {u.urlLabel}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@user/video/..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all text-sm font-medium"
                  />
                  {url && (
                    <button
                      onClick={() => setUrl('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {/* Platform icons */}
              <div className="flex items-center justify-center gap-6 pt-2">
                {['TikTok', 'Instagram', 'YouTube'].map((platform) => (
                  <span key={platform} className="text-[11px] text-gray-400 font-medium px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons — premium */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className={`w-full relative group overflow-hidden flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-base transition-all duration-500 ${
              canAnalyze
                ? 'bg-gradient-to-r from-brand-500 via-emerald-500 to-brand-400 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-1'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            {/* Shimmer effect on hover */}
            {canAnalyze && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
            <Sparkles className="w-5 h-5 relative" />
            <span className="relative">{u.analyzeBtn}</span>
            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="px-4 text-xs text-gray-400 font-medium">{u.or}</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            onClick={handleDemo}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-semibold group"
          >
            <Play className="w-4 h-4 group-hover:text-brand-500 transition-colors" />
            {u.demoBtn}
            <span className="text-gray-300 text-xs">{u.demoNote}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
