import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Brain,
  Zap,
  BarChart3,
  AlertTriangle,
  Clock,
  Lightbulb,
  ChevronRight,
  Award,
  Volume2,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Shield,
  Eye,
  Flame,
  Crown,
  Download,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AnalysisReport({ analysis, onReset }) {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const r = t.report;

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!analysis) return null;
  const a = analysis;

  return (
    <section className={`py-8 md:py-12 px-6 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10 animate-slide-down">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 text-gray-500 hover:text-gray-800 transition-all group bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">{r.newAnalysis}</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500 font-medium">{r.analysisComplete}</span>
          </div>
        </div>

        {/* ========== HERO SCORE CARD ========== */}
        <div className="relative overflow-hidden rounded-3xl mb-8 animate-scale-in">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50/30" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-100/30 rounded-full blur-[80px] translate-y-1/3" />

          <div className="relative glass-card rounded-3xl p-8 md:p-10 border-emerald-200 glow-green">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Score Ring */}
              <div className="relative flex-shrink-0">
                <ScoreRing score={a.overall_score || 0} size={160} />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    {r.overall}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left space-y-5">
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">{r.topPriority}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg font-light">
                    {a.top_priority}
                  </p>
                </div>

                {/* Quick badges */}
                <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                  <ScoreBadge label="Hook" score={a.hook_score} icon={Target} />
                  <ScoreBadge label="Clarity" score={a.clarity_score} icon={Brain} />
                  <TypeBadge type={a.strategic_type} />
                  <EnergyBadge level={a.energy_assessment} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== ANALYSIS GRID ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger-children">

          {/* Hook Analysis */}
          <Card delay={0} className="opacity-0 animate-slide-up">
            <CardHeader
              icon={Target}
              title={r.hookAnalysis}
              score={a.hook_score}
              gradient="from-green-400 to-emerald-500"
            />
            <div className="space-y-4">
              <p className="text-gray-500 text-sm leading-relaxed">
                {a.hook_feedback}
              </p>
              {a.hook_improvement && (
                <ImprovementBox text={a.hook_improvement} label={r.improvedHook} />
              )}
            </div>
          </Card>

          {/* Message Clarity */}
          <Card delay={1} className="opacity-0 animate-slide-up">
            <CardHeader
              icon={Brain}
              title={r.messageClarity}
              score={a.clarity_score}
              gradient="from-blue-400 to-indigo-500"
            />
            <div className="space-y-4">
              {a.core_message_detected && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2 pl-3">{r.coreMessage}</p>
                  <p className="text-gray-600 text-sm italic leading-relaxed pl-3">"{a.core_message_detected}"</p>
                </div>
              )}
              <p className="text-gray-500 text-sm leading-relaxed">
                {a.clarity_feedback}
              </p>
              {a.clarity_improvement && (
                <ImprovementBox text={a.clarity_improvement} label={r.restructureTip} />
              )}
            </div>
          </Card>

          {/* Retention Risks — Full Width */}
          <div className="lg:col-span-2 opacity-0 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <Card>
              <CardHeader
                icon={TrendingUp}
                title={r.retentionTimeline}
                gradient="from-amber-400 to-orange-500"
              />
              {a.retention_risks && a.retention_risks.length > 0 ? (
                <div className="space-y-3">
                  {/* Visual timeline bar */}
                  <div className="relative h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
                    <div className="absolute inset-0 flex">
                      {a.retention_risks.map((_, i) => {
                        const pos = ((i + 1) / (a.retention_risks.length + 1)) * 100;
                        return (
                          <div
                            key={i}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${pos}%` }}
                          >
                            <div className="w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/30 -translate-x-1/2" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-full bg-gradient-to-r from-brand-500/40 via-amber-500/40 to-red-500/40 rounded-full" />
                  </div>

                  {a.retention_risks.map((risk, i) => (
                    <RetentionRisk key={i} risk={risk} index={i} total={a.retention_risks.length} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto bg-brand-50 rounded-xl flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-brand-500" />
                  </div>
                  <p className="text-gray-400 text-sm">{r.noRetentionRisks}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Energy & Delivery */}
          <Card delay={3} className="opacity-0 animate-slide-up">
            <CardHeader
              icon={Volume2}
              title={r.energyDelivery}
              gradient="from-purple-400 to-pink-500"
            />
            <div className="space-y-5">
              <EnergyMeter level={a.energy_assessment} />

              {a.energy_details && (
                <div className="space-y-3">
                  <DetailRow icon={Flame} label={r.speechTempo} value={a.energy_details.speech_tempo} />
                  <DetailRow icon={Eye} label={r.vocalVariation} value={a.energy_details.vocal_variation} />
                  <DetailRow icon={Crown} label={r.authority} value={a.energy_details.authority_perception} />
                  {a.energy_details.improvement && (
                    <ImprovementBox text={a.energy_details.improvement} label={r.deliveryTip} />
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Strategic Classification */}
          <Card delay={4} className="opacity-0 animate-slide-up">
            <CardHeader
              icon={BarChart3}
              title={r.strategicClass}
              gradient="from-teal-400 to-cyan-500"
            />
            <div className="space-y-5">
              <StrategyTypeCard type={a.strategic_type} confidence={a.strategic_type_confidence} r={r} />

              <p className="text-gray-500 text-sm leading-relaxed">
                {a.strategic_alignment_feedback}
              </p>

              {a.strategic_optimization && a.strategic_optimization.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">{r.optimizationTips}</p>
                  {a.strategic_optimization.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-200 group hover:border-teal-300 transition-colors">
                      <div className="w-5 h-5 bg-teal-50 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ChevronRight className="w-3 h-3 text-teal-500" />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ========== BOTTOM CTA ========== */}
        <div className="mt-14 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card rounded-3xl p-8 md:p-10 border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2 text-gray-900">{r.readyToImprove}</h3>
            <p className="text-gray-400 text-sm mb-6">{r.readyDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-brand-500 via-emerald-500 to-brand-400 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-brand-500/20 transition-all hover:-translate-y-0.5 group"
              >
                <Zap className="w-5 h-5" />
                {r.analyzeAnother}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function Card({ children, delay = 0, className = '' }) {
  return (
    <div className={`glass-card rounded-2xl md:rounded-3xl p-6 md:p-7 ${className}`} style={{ animationDelay: `${delay * 0.08}s` }}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title, score, gradient = 'from-brand-500 to-emerald-500' }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <h3 className="text-base md:text-lg font-bold tracking-tight text-gray-800">{title}</h3>
      </div>
      {score !== undefined && score !== null && (
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-black tracking-tight ${getScoreColor(score)}`}>{score}</span>
          <span className="text-sm text-gray-300 font-semibold">/10</span>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score, size = 160 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const normalizedScore = Math.min(10, Math.max(0, score));
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(normalizedScore), 300);
    return () => clearTimeout(timer);
  }, [normalizedScore]);

  const percentage = animatedScore / 10;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(226, 232, 240, 0.8)"
          strokeWidth="10"
        />
        {/* Score arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="url(#scoreGradientRing)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-[1.5s] ease-out"
          style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))' }}
        />
        {/* Decorative inner ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius - 16}
          fill="none"
          stroke="rgba(34, 197, 94, 0.1)"
          strokeWidth="1"
        />
        <defs>
          <linearGradient id="scoreGradientRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-black tracking-tight ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-gray-400 font-semibold mt-0.5">/ 10</span>
      </div>
    </div>
  );
}

function ScoreBadge({ label, score, icon: Icon }) {
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border backdrop-blur-sm ${getScoreBadgeClasses(score)}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
      <span className="font-black">{score}</span>
    </div>
  );
}

function TypeBadge({ type }) {
  const colors = {
    Reach: 'bg-blue-50 border-blue-200 text-blue-600',
    Authority: 'bg-purple-50 border-purple-200 text-purple-600',
    Conversion: 'bg-orange-50 border-orange-200 text-orange-600',
    Community: 'bg-pink-50 border-pink-200 text-pink-600',
  };
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border backdrop-blur-sm ${colors[type] || colors.Authority}`}>
      <Award className="w-3.5 h-3.5" />
      {type || 'Unknown'}
    </div>
  );
}

function EnergyBadge({ level }) {
  const colors = {
    Low: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    Balanced: 'bg-brand-50 border-brand-200 text-brand-600',
    High: 'bg-red-50 border-red-200 text-red-600',
  };
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border backdrop-blur-sm ${colors[level] || colors.Balanced}`}>
      <Zap className="w-3.5 h-3.5" />
      {level || 'N/A'}
    </div>
  );
}

function EnergyMeter({ level }) {
  const levels = ['Low', 'Balanced', 'High'];
  const activeIndex = levels.indexOf(level);
  const colors = ['from-yellow-400 to-amber-500', 'from-green-400 to-emerald-500', 'from-orange-400 to-red-500'];
  const bgColors = ['bg-yellow-500', 'bg-brand-500', 'bg-red-500'];

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-3 w-full">
        {levels.map((l, i) => (
          <div key={l} className="flex-1">
            <div className="h-2.5 rounded-full overflow-hidden bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  i <= activeIndex ? bgColors[i] : 'bg-transparent'
                }`}
                style={{
                  width: i <= activeIndex ? '100%' : '0%',
                  boxShadow: i <= activeIndex ? `0 0 12px ${i === 0 ? 'rgba(245,158,11,0.3)' : i === 1 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` : 'none'
                }}
              />
            </div>
            <p className={`text-xs mt-2 text-center font-semibold transition-colors ${
              i === activeIndex ? 'text-gray-800' : 'text-gray-300'
            }`}>
              {l}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetentionRisk({ risk, index, total }) {
  const severity = index < total / 3 ? 'low' : index < (total * 2) / 3 ? 'med' : 'high';
  const severityColors = {
    low: 'border-yellow-200 hover:border-yellow-300',
    med: 'border-amber-200 hover:border-amber-300',
    high: 'border-red-200 hover:border-red-300',
  };

  return (
    <div className={`flex items-start gap-4 bg-gray-50 rounded-xl p-4 border transition-all duration-300 group ${severityColors[severity]}`}>
      <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
        <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors border border-amber-200">
          <Clock className="w-5 h-5 text-amber-500" />
        </div>
        <span className="text-[11px] font-mono text-amber-600 font-bold">{risk.timestamp}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-gray-800">{risk.issue}</p>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{risk.suggestion}</p>
      </div>
    </div>
  );
}

function StrategyTypeCard({ type, confidence, r }) {
  const config = {
    Reach: { color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500', icon: TrendingUp, desc: r?.strategyReach || '' },
    Authority: { color: 'from-purple-500 to-purple-600', bg: 'bg-purple-500', icon: Award, desc: r?.strategyAuthority || '' },
    Conversion: { color: 'from-orange-500 to-orange-600', bg: 'bg-orange-500', icon: Target, desc: r?.strategyConversion || '' },
    Community: { color: 'from-pink-500 to-pink-600', bg: 'bg-pink-500', icon: MessageSquare, desc: r?.strategyCommunity || '' },
  };

  const c = config[type] || config.Authority;
  const Icon = c.icon;

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
      <div className="flex items-center gap-4 mb-3">
        <div className={`w-14 h-14 bg-gradient-to-br ${c.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-xl tracking-tight text-gray-800">{type || 'Unknown'}</p>
          <p className="text-gray-400 text-xs mt-0.5">{c.desc}</p>
        </div>
      </div>
      {confidence && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400 font-medium">{r?.confidence || 'Confidence'}</span>
            <span className="text-xs text-gray-600 font-bold">{confidence}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${c.bg} rounded-full transition-all duration-1000`}
              style={{
                width: `${confidence}%`,
                boxShadow: `0 0 12px ${type === 'Reach' ? 'rgba(59,130,246,0.4)' : type === 'Conversion' ? 'rgba(249,115,22,0.4)' : type === 'Community' ? 'rgba(236,72,153,0.4)' : 'rgba(168,85,247,0.4)'}`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex items-start gap-3">
      {Icon && (
        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-purple-500" />
        </div>
      )}
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold mb-1">{label}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

function ImprovementBox({ text, label = 'Suggestion' }) {
  return (
    <div className="relative bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 overflow-hidden">
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-brand-400/40 via-emerald-300/30 to-transparent" />
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-3.5 h-3.5 text-brand-500" />
        </div>
        <p className="text-[10px] text-brand-600 uppercase tracking-[0.2em] font-bold">{label}</p>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 8) return 'text-brand-600';
  if (score >= 6) return 'text-yellow-500';
  if (score >= 4) return 'text-orange-500';
  return 'text-red-500';
}

function getScoreBadgeClasses(score) {
  if (score >= 8) return 'bg-brand-50 border-brand-200 text-brand-600';
  if (score >= 6) return 'bg-yellow-50 border-yellow-200 text-yellow-600';
  if (score >= 4) return 'bg-orange-50 border-orange-200 text-orange-600';
  return 'bg-red-50 border-red-200 text-red-600';
}
