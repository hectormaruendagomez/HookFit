import { useState, useEffect } from 'react';
import { User, Mail, Calendar, BarChart3, ArrowRight, Clock, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage({ user, onViewAnalysis }) {
  const { t } = useLanguage();
  const p = t.profile;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (videosError) {
        console.log('Error videos:', videosError);
        setLoading(false);
        return;
      }

      // Para cada video, buscar su análisis
      const videosWithAnalysis = await Promise.all(
        videosData.map(async (video) => {
          const { data: analysisData } = await supabase
            .from('video_analysis')
            .select('*')
            .eq('video_id', video.id)
            .single();

          return { ...video, video_analysis: analysisData ? [analysisData] : [] };
        })
      );

      setHistory(videosWithAnalysis);
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-neon-500 bg-neon-400/10 border-neon-400/20';
    if (score >= 4) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-red-500 bg-red-50 border-red-200';
  };

  return (
    <section className="py-12 px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-400 to-brand-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <User className="w-7 h-7 text-gray-950" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                {user?.user_metadata?.name || p.defaultName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{p.memberSince} {formatDate(user?.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-black text-gray-900">{history.length}</div>
              <div className="text-xs text-gray-500 font-medium mt-1">{p.totalAnalyses}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-black text-gray-900">
                {history.length > 0
                  ? (
                      history.reduce((sum, v) => {
                        const score = v.video_analysis?.[0]?.hook_score ?? 0;
                        return sum + score;
                      }, 0) / history.length
                    ).toFixed(1)
                  : '—'}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">{p.avgHookScore}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-black text-gray-900">
                {history.length > 0
                  ? history.reduce((best, v) => {
                      const score = v.video_analysis?.[0]?.hook_score ?? 0;
                      return Math.max(best, score);
                    }, 0)
                  : '—'}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">{p.bestScore}</div>
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neon-400/10 border border-neon-400/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-neon-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{p.historyTitle}</h2>
              <p className="text-sm text-gray-500">{p.historyDesc}</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-neon-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">{p.loading}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{p.emptyTitle}</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">{p.emptyDesc}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((video) => {
                const analysis = video.video_analysis?.[0];
                const hookScore = analysis?.hook_score ?? null;

                return (
                  <div
                    key={video.id}
                    className="glass-card rounded-xl p-5 flex items-center gap-4 group cursor-pointer"
                    onClick={() => {
                      if (analysis) onViewAnalysis(analysis);
                    }}
                  >
                    {/* Score badge */}
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                      hookScore !== null ? getScoreColor(hookScore) : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}>
                      {hookScore !== null ? (
                        <span className="text-lg font-black">{hookScore}</span>
                      ) : (
                        <BarChart3 className="w-5 h-5" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{video.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">{formatDate(video.created_at)}</span>
                        {hookScore !== null && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Hook: {hookScore}/10
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    {analysis && (
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-neon-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
