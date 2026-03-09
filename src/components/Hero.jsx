import { Target, TrendingUp, Brain, BarChart3, Zap, Volume2, Sparkles, Clock, Scissors, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const featureIcons = [Target, TrendingUp, Scissors, Eye, BarChart3, Brain];
const featureColors = [
  'from-neon-400 to-brand-500',
  'from-neon-400 to-emerald-500',
  'from-neon-400 to-green-600',
  'from-neon-400 to-brand-500',
  'from-neon-400 to-teal-500',
  'from-neon-400 to-emerald-600',
];

export default function Hero() {
  const { t } = useLanguage();
  const features = t.hero.features;

  return (
    <section className="pt-16 md:pt-24 pb-8 px-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        {/* Animated badge */}
        <div className="inline-flex items-center gap-2.5 bg-gray-950 border border-neon-400/20 rounded-full px-5 py-2 mb-10 animate-slide-down glow-neon">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-neon-400" />
            <div className="absolute inset-0">
              <Sparkles className="w-4 h-4 text-neon-400 animate-ping-slow" />
            </div>
          </div>
          <span className="text-neon-400 text-sm font-semibold tracking-wide">{t.hero.badge}</span>
        </div>

        {/* Main heading with staggered animation */}
        <div className="animate-slide-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            <span className="block text-gray-900">{t.hero.title1}</span>
            <span className="block mt-2">
              <span className="gradient-text-neon">{t.hero.title2}</span>
            </span>
          </h1>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-4 leading-relaxed font-light">
            {t.hero.desc1}{' '}
            <span className="text-gray-800 font-medium">{t.hero.descHighlight}</span>
            {t.hero.desc2}
          </p>
          <p className="text-base text-gray-400 max-w-xl mx-auto mb-6 leading-relaxed">
            {t.hero.desc3pre} <span className="text-neon-600 font-semibold">{t.hero.creators}</span> {t.hero.and}{' '}
            <span className="text-neon-600 font-semibold">{t.hero.coaches}</span> {t.hero.desc3post}
          </p>
        </div>

        {/* Decorative line */}
        <div className="animate-fade-in flex items-center justify-center gap-4 mb-14" style={{ animationDelay: '0.3s' }}>
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
          <div className="w-1.5 h-1.5 bg-neon-400 rounded-full shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300" />
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-16 stagger-children">
          {features.map(({ label, desc }, i) => {
            const Icon = featureIcons[i];
            const color = featureColors[i];
            return (
              <div
                key={label}
                className="glass-card rounded-2xl p-4 md:p-5 text-left group cursor-default opacity-0 animate-slide-up"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-0.5">{label}</p>
                <p className="text-xs text-gray-400 font-medium">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
