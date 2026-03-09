import { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, BarChart3, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const stepIcons = [Sparkles, Volume2, Brain, Target, TrendingUp, BarChart3];

export default function LoadingAnalysis() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { t } = useLanguage();
  const l = t.loading;
  const steps = l.steps;

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 3, 95));
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <section className="py-16 md:py-24 px-6 animate-fade-in">
      <div className="max-w-lg mx-auto">
        {/* Main visual */}
        <div className="relative w-40 h-40 mx-auto mb-12">
          {/* Outer rings */}
          <div className="absolute inset-0 rounded-full border border-brand-500/10 animate-spin" style={{ animationDuration: '12s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-brand-400 rounded-full" />
          </div>
          <div className="absolute inset-4 rounded-full border border-brand-500/15 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          </div>
          <div className="absolute inset-8 rounded-full border border-brand-500/20 animate-spin" style={{ animationDuration: '6s' }}>
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full" />
          </div>

          {/* Pulse rings */}
          <div className="absolute inset-12 rounded-full border-2 border-brand-500/20 animate-ping-slow" />
          <div className="absolute inset-14 rounded-full border-2 border-brand-400/25 animate-ping-slow" style={{ animationDelay: '0.7s' }} />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-brand-400 via-brand-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-500/40">
                <Brain className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight text-gray-900">
            {l.title} <span className="gradient-text">{l.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 text-sm">
            {l.subtitle}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">{l.progress}</span>
            <span className="text-xs text-brand-600 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 via-emerald-400 to-brand-400 rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-2.5">
          {steps.map(({ label, detail }, i) => {
            const isCompleted = i < activeStep;
            const isActive = i === activeStep;
            const isPending = i > activeStep;
            const Icon = stepIcons[i];

            return (
              <div
                key={i}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-500 ${
                  isActive
                    ? 'glass-card border-brand-300 bg-emerald-50/50'
                    : isCompleted
                    ? 'bg-gray-50'
                    : 'bg-transparent opacity-40'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-brand-50'
                    : isActive
                    ? 'bg-gradient-to-br from-brand-100 to-emerald-100'
                    : 'bg-gray-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-500" />
                  ) : (
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-500' : 'text-gray-400'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-gray-800' : isCompleted ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {label}
                  </p>
                  <p className={`text-xs mt-0.5 transition-colors ${
                    isActive ? 'text-gray-500' : 'text-gray-300'
                  }`}>
                    {detail}
                  </p>
                </div>
                {isActive && (
                  <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin flex-shrink-0" />
                )}
                {isCompleted && (
                  <span className="text-[10px] text-brand-500/60 font-semibold uppercase tracking-wider">{l.done}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
