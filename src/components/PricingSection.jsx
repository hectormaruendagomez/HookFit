import { Zap, Check, Crown, Sparkles, ArrowRight, Shield, Eye, BarChart3, Brain, Target, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const planMeta = [
  { id: 'free', price: '0', gradient: 'from-gray-400 to-gray-500', current: true },
  { id: 'pro', price: '29', period: '/mes', gradient: 'from-neon-400 to-brand-500', featured: true },
  { id: 'agency', price: '79', period: '/mes', gradient: 'from-purple-500 to-indigo-600' },
];

export default function PricingSection({ isPro, onUnlock }) {
  const { t } = useLanguage();
  const p = t.pricing;

  const plans = planMeta.map((meta, i) => ({
    ...meta,
    ...p.plans[i],
    period: meta.period || p.plans[i].period || '',
  }));

  return (
    <section className="py-12 px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-neon-400/10 border border-neon-400/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-neon-400" />
            <span className="text-sm font-semibold text-neon-600">{p.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
            {p.title} <span className="gradient-text-neon">{p.titleHighlight}</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            {p.subtitle}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-start">
          {plans.map((plan) => (
            <div key={plan.id}>
              {/* Badge above card */}
              {plan.badge && (
                <div className="flex justify-center mb-3">
                  <span className="bg-neon-400 text-gray-950 text-[11px] font-bold uppercase tracking-widest px-6 py-1.5 rounded-full shadow-[0_4px_20px_rgba(57,255,20,0.3)]">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div
                className={`rounded-2xl p-6 transition-all duration-300 ${
                  plan.featured
                    ? 'bg-white border-2 border-neon-400/40 shadow-[0_8px_40px_rgba(57,255,20,0.15)] scale-[1.02]'
                    : 'glass-card hover:border-gray-300'
                }`}
              >
                {/* Plan header */}
                <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  {plan.id === 'free' ? <Shield className="w-6 h-6 text-white" /> :
                   plan.id === 'pro' ? <Crown className="w-6 h-6 text-gray-950" /> :
                   <BarChart3 className="w-6 h-6 text-white" />}
                </div>
                <h3 className={`text-xl font-bold mb-1 ${plan.featured ? 'text-gray-900' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-black ${plan.featured ? 'text-neon-500' : 'text-gray-900'}`}>
                    €{plan.price}
                  </span>
                  <span className={`text-sm ${plan.featured ? 'text-gray-500' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.featured ? 'text-gray-500' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.featured ? 'bg-neon-400/15' : 'bg-brand-50'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.featured ? 'text-neon-500' : 'text-brand-500'}`} />
                    </div>
                    <span className={`text-sm ${plan.featured ? 'text-gray-600' : 'text-gray-600'}`}>
                      {feat}
                    </span>
                  </div>
                ))}
                {plan.locked && plan.locked.map((feat, i) => (
                  <div key={`locked-${i}`} className="flex items-center gap-2.5 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-400 line-through">{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  if (plan.id === 'pro' && !isPro) onUnlock();
                }}
                disabled={plan.current || (plan.id === 'agency')}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.featured
                    ? 'bg-neon-400 text-gray-950 hover:bg-neon-300'
                    : plan.current
                    ? 'bg-gray-100 text-gray-400 cursor-default border border-gray-200'
                    : plan.id === 'agency'
                    ? 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
                {plan.featured && !isPro && <ArrowRight className="w-4 h-4" />}
              </button>
              </div>
            </div>
          ))}
        </div>

        {/* Already Pro badge */}
        {isPro && (
          <div className="text-center animate-scale-in">
            <div className="inline-flex items-center gap-3 bg-gray-950 text-neon-400 px-6 py-3 rounded-2xl border border-neon-400/20 glow-neon">
              <Crown className="w-5 h-5" fill="currentColor" />
              <span className="font-bold text-sm">{p.proActiveBadge}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
