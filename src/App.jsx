import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import AnalysisReport from './components/AnalysisReport';
import LoadingAnalysis from './components/LoadingAnalysis';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import PricingSection from './components/PricingSection';
import SpyIntel from './components/SpyIntel';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import PaymentPage from './components/PaymentPage';
import { useLanguage } from './context/LanguageContext';
import { supabase } from './lib/supabase';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);

    // Comprobar si hay sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.is_pro) setIsPro(true);
          });
      }
    });

    // Escuchar cambios de sesión (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAnalysisComplete = async (data) => {
    setAnalysis(data);
    setLoading(false);
    setError(null);

    if (user) {
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title: 'Análisis ' + new Date().toLocaleDateString(),
          platform: 'unknown',
        })
        .select()
        .single();

      if (!videoError && videoData) {
        await supabase.from('video_analysis').insert({
          video_id: videoData.id,
          hook_score: data.hook_score,
          drop_off_data: data.retention_risks,
          editing_tips: data.strategic_optimization,
          clarity_score: data.clarity_score,
          overall_score: data.overall_score,
          strategic_type: data.strategic_type,
          energy_assessment: data.energy_assessment,
          top_priority: data.top_priority,
          full_analysis: data,
        });
      }
    }
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
  };

  const handleError = (err) => {
    setError(err);
    setLoading(false);
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setLoading(false);
    setActiveSection('home');
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    setAnalysis(null);
    setLoading(false);
    setError(null);
  };

  const handleUnlockPro = () => {
    setActiveSection('payment');
  };

  const handlePaymentComplete = () => {
    setIsPro(true);
    setActiveSection('home');
  };

  const handleLogin = () => {
    setActiveSection('home');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsPro(false);
    setActiveSection('home');
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isPro={isPro}
        user={user}
      />

      {/* Main content — offset for sidebar */}
      <div className="ml-[72px]">
        {/* Layered background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none ml-[72px]">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[150px]" />
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[130px]" />
          <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] bg-teal-100/30 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.6)_70%)]" />
        </div>

        <div className={`relative z-10 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <Header
            onReset={handleReset}
            onLoginClick={() => setActiveSection('auth')}
            user={user}
            onLogout={handleLogout}
            onProfileClick={() => setActiveSection('profile')}
          />

          {/* HOME section */}
          {activeSection === 'home' && (
            <>
              {!analysis && !loading && (
                <>
                  <Hero />

                  {/* Upload section — Pro users only */}
                  {isPro && (
                    <div id="upload-section">
                      <UploadSection
                        onAnalysisStart={() => {
                          setLoading(true);
                          setError(null);
                          setAnalysis(null);
                        }}
                        onAnalysisComplete={handleAnalysisComplete}
                        onError={handleError}
                      />
                      {error && (
                        <div className="max-w-2xl mx-auto px-6 pb-8 animate-slide-up">
                          <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-red-700 font-semibold text-sm">{t.error.title}</p>
                                <p className="text-red-600 text-sm mt-0.5">{error}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* How it works — 3 steps */}
                  <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                          {t.steps.title1}<br />
                          <span className="gradient-text-neon">{t.steps.title2}</span>
                        </h2>
                        <p className="text-gray-500 max-w-lg mx-auto">
                          {t.steps.subtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {t.steps.items.map(({ title, desc }, i) => (
                          { step: String(i + 1), title, desc }
                        )).map(({ step, title, desc }) => (
                          <div key={step} className="relative text-center group">
                            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-neon-400/10 border border-neon-400/20 flex items-center justify-center group-hover:bg-neon-400/20 transition-colors">
                              <span className="text-2xl font-black text-neon-500">{step}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Pricing Section */}
                  <div id="pricing-section">
                    <PricingSection isPro={isPro} onUnlock={handleUnlockPro} />
                  </div>

                  {/* Final CTA */}
                  <section className="py-20 px-6">
                    <div className="max-w-2xl mx-auto text-center">
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
                        {t.cta.title1}<br />
                        <span className="gradient-text-neon">{t.cta.title2}</span>
                      </h2>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        {t.cta.subtitle}
                      </p>
                      <button
                        onClick={() => {
                          if (isPro) {
                            document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="inline-flex items-center gap-2.5 bg-neon-400 text-gray-950 font-bold px-8 py-4 rounded-2xl shadow-lg glow-neon hover:glow-neon-strong transition-all hover:-translate-y-0.5 text-sm"
                      >
                        {isPro ? t.cta.btnPro : t.cta.btnFree}
                      </button>
                    </div>
                  </section>
                </>
              )}

              {loading && <LoadingAnalysis />}

              {analysis && (
                <AnalysisReport analysis={analysis} onReset={handleReset} />
              )}
            </>
          )}

          {/* SPY INTEL section */}
          {activeSection === 'spy' && (
            <SpyIntel isPro={isPro} onUpgrade={() => setActiveSection('home')} />
          )}

          {/* AUTH section */}
          {activeSection === 'auth' && (
            <AuthPage
              onBack={() => setActiveSection('home')}
              onLogin={handleLogin}
            />
          )}

          {/* PAYMENT section */}
          {activeSection === 'payment' && (
            <PaymentPage
              onBack={() => setActiveSection('home')}
              onPaymentComplete={handlePaymentComplete}
            />
          )}

          {/* PROFILE section */}
          {activeSection === 'profile' && user && (
            <ProfilePage
              user={user}
              onViewAnalysis={(analysisData) => {
                setAnalysis(analysisData);
                setActiveSection('home');
              }}
            />
          )}

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
