import { useState } from 'react';
import {
  Eye,
  Globe,
  TrendingUp,
  Users,
  Clock,
  Flame,
  Target,
  Lock,
  Play,
  ExternalLink,
  BarChart3,
  Sparkles,
  ChevronRight,
  Crown,
  Search,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Mock data (platform-specific, not translated)
const mockViralVideos = [
  {
    creator: '@fitcoach_mike',
    platform: 'TikTok',
    views: '2.4M',
    hook: 'Starts with a controversial claim in first 1.5s',
    structure: 'Hook → Pain point → Demo → CTA',
    retention: '78%',
    category: 'Transformation',
    timeAgo: '4h ago',
  },
  {
    creator: '@yoga_sarah',
    platform: 'Instagram',
    views: '890K',
    hook: 'Text overlay with bold promise + immediate demo',
    structure: 'Visual hook → Tutorial → Results → Save CTA',
    retention: '82%',
    category: 'Tutorial',
    timeAgo: '8h ago',
  },
  {
    creator: '@gymrat_pro',
    platform: 'TikTok',
    views: '1.8M',
    hook: 'POV format with relatable scenario',
    structure: 'POV setup → Comedic twist → Educational value',
    retention: '71%',
    category: 'Edutainment',
    timeAgo: '12h ago',
  },
  {
    creator: '@nutrition_lab',
    platform: 'YouTube Shorts',
    views: '3.1M',
    hook: '"Most people don\'t know this..." with zoom-in',
    structure: 'Curiosity gap → Reveal → Evidence → Follow CTA',
    retention: '85%',
    category: 'Myth-busting',
    timeAgo: '18h ago',
  },
];

const insightIcons = [Flame, Clock, Target];
const insightColors = [
  { color: 'text-orange-500', bg: 'bg-orange-50' },
  { color: 'text-blue-500', bg: 'bg-blue-50' },
  { color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function SpyIntel({ isPro, onUpgrade }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { t } = useLanguage();
  const s = t.spy;

  if (!isPro) {
    return (
      <section className="py-12 px-6 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          {/* Locked state */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Blurred preview */}
            <div className="blur-sm opacity-40 pointer-events-none">
              <div className="glass-card rounded-3xl p-10">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-xl p-4 h-32" />
                  ))}
                </div>
              </div>
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gray-950 rounded-2xl flex items-center justify-center mb-6 glow-neon neon-pulse">
                <Eye className="w-10 h-10 text-neon-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{s.lockedTitle}</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md">
                {s.lockedDesc}
              </p>
              <button
                onClick={onUpgrade}
                className="inline-flex items-center gap-2.5 bg-neon-400 text-gray-950 font-bold px-8 py-4 rounded-2xl shadow-lg glow-neon hover:glow-neon-strong transition-all hover:-translate-y-0.5"
              >
                <Lock className="w-5 h-5" />
                {s.lockedBtn}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gray-950 rounded-xl flex items-center justify-center glow-neon">
                <Eye className="w-5 h-5 text-neon-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {s.headerTitle} <span className="gradient-text-neon">{s.headerHighlight}</span>
                </h2>
                <p className="text-xs text-gray-400 font-medium">{s.headerSub}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-neon-400/10 border border-neon-400/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-neon-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(57,255,20,0.6)]" />
            <span className="text-xs font-bold text-neon-600">{s.liveBadge}</span>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {s.insights.map(({ title, value, desc }, i) => {
            const Icon = insightIcons[i];
            const { color, bg } = insightColors[i];
            return (
              <div key={title} className="glass-card rounded-2xl p-5 hover:border-gray-300 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{title}</p>
                    <p className="text-sm font-bold text-gray-900">{value}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>

        {/* Viral Videos Grid */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">{s.viralTitle}</h3>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{mockViralVideos.length} {s.viralCount}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockViralVideos.map((video, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                  selectedVideo === i ? 'border-neon-400/30 bg-neon-400/[0.02] glow-neon' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedVideo(selectedVideo === i ? null : i)}
              >
                {/* Video header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{video.creator}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{video.platform} • {video.timeAgo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-neon-500" />
                    <span className="text-sm font-black text-gray-900">{video.views}</span>
                  </div>
                </div>

                {/* Category badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] bg-neon-400/10 text-neon-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {video.category}
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold">
                    {s.retentionLabel}: {video.retention}
                  </span>
                </div>

                {/* Expanded details */}
                {selectedVideo === i && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-gray-100 animate-slide-up">
                    <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                        <Target className="w-3 h-3 inline mr-1" />
                        {s.hookLabel}
                      </p>
                      <p className="text-sm text-gray-700">{video.hook}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                        <BarChart3 className="w-3 h-3 inline mr-1" />
                        {s.structureLabel}
                      </p>
                      <p className="text-sm text-gray-700">{video.structure}</p>
                    </div>
                  </div>
                )}

                {/* Expand indicator */}
                <div className="flex items-center justify-center mt-3">
                  <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${
                    selectedVideo === i ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* For Creators callout */}
        <div className="mt-10 glass-card rounded-2xl p-6 border-neon-400/10 bg-gradient-to-r from-gray-950 to-gray-900 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-neon-400/15 rounded-2xl flex items-center justify-center flex-shrink-0 glow-neon">
              <Zap className="w-8 h-8 text-neon-400" fill="currentColor" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold mb-1">{s.creatorsTitle}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {s.creatorsDesc}
              </p>
            </div>
            <button className="flex-shrink-0 inline-flex items-center gap-2 bg-neon-400 text-gray-950 font-bold px-6 py-3 rounded-xl hover:bg-neon-300 transition-colors text-sm">
              <Sparkles className="w-4 h-4" />
              {s.creatorsBtn}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
