import { useState, useRef, useEffect } from 'react';
import { User, UserRound, LogOut, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ onReset, onLoginClick, user, onLogout, onProfileClick }) {
  const { lang, toggleLang, t } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-3 group"
        >
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src="/logo.png"
              alt="HookFit"
              className="relative w-10 h-10 rounded-xl shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-105 object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight leading-none text-gray-900">
              hook<span className="gradient-text">fit</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase leading-none mt-0.5">
              Growth Engine
            </span>
          </div>
        </button>

        <nav className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5">
            <div className="relative">
              <div className="w-2 h-2 bg-brand-400 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-brand-400 rounded-full animate-ping-slow" />
            </div>
            <span className="text-[11px] font-medium text-gray-500">{t.header.aiActive}</span>
          </div>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors text-xs font-bold text-gray-600 tracking-wide"
          >
            {lang === 'es' ? 'ES' : 'EN'}
          </button>

          {/* Login / User button */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-neon-400/10 border border-neon-400/20 rounded-full px-3.5 py-1.5 hover:bg-neon-400/20 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-neon-500" />
                <span className="text-[11px] font-semibold text-neon-600">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario'}
                </span>
                <ChevronDown className={`w-3 h-3 text-neon-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg shadow-black/8 py-2 animate-slide-down z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user.user_metadata?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); onProfileClick?.(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {t.header.profile}
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.header.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-colors text-sm font-semibold"
            >
              <UserRound className="w-3.5 h-3.5" />
              {t.header.login}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
