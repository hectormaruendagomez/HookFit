import { useState, useEffect, useRef } from 'react';
import {
  Home,
  Eye,
  Lock,
  Zap,
  UserRound,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ activeSection, onNavigate, isPro, user }) {
  const [expanded, setExpanded] = useState(false);
  const [hookAnimating, setHookAnimating] = useState(false);
  const prevIsPro = useRef(isPro);
  const { t } = useLanguage();

  useEffect(() => {
    if (isPro && !prevIsPro.current) {
      setHookAnimating(true);
      const timer = setTimeout(() => setHookAnimating(false), 1400);
      return () => clearTimeout(timer);
    }
    prevIsPro.current = isPro;
  }, [isPro]);

  useEffect(() => {
    if (isPro) {
      setHookAnimating(true);
      const timer = setTimeout(() => setHookAnimating(false), 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  const navItems = [
    { id: 'home', icon: Home, label: t.sidebar.home },
    { id: 'spy', icon: Eye, label: t.sidebar.spy, locked: true },
    { id: 'profile', icon: UserRound, label: t.sidebar.profile, requiresAuth: true },
  ];

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ width: expanded ? 200 : 72 }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-white/80 backdrop-blur-xl border-r border-gray-200/80 flex flex-col py-4 transition-all duration-300 overflow-hidden"
    >
      {/* Logo — always centered in 72px */}
      <div className="flex justify-center" style={{ width: 72 }}>
        <img
          src="/logo.png"
          alt="HookFit"
          className="w-11 h-11 rounded-xl shadow-lg object-cover flex-shrink-0"
        />
      </div>

      {/* Separator */}
      <div className="mx-auto mt-6 mb-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-all duration-300"
        style={{ width: expanded ? '80%' : 32 }}
      />

      {/* Nav items */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map(({ id, icon: Icon, label, locked, requiresAuth }) => {
          const isActive = activeSection === id;
          const isLocked = locked && !isPro;
          if (requiresAuth && !user) return null;

          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`relative flex items-center h-12 mx-2 rounded-xl transition-all duration-200 group/item ${
                isActive
                  ? 'bg-neon-400/10 border border-neon-400/20'
                  : 'hover:bg-gray-100 border border-transparent'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-neon-400 rounded-r-full shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
              )}

              {/* Icon — always centered in the 68px (72 - 4px margin) collapsed area */}
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 68 - 8 }}>
                <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-400/15'
                    : 'bg-gray-100 group-hover/item:bg-neon-400/10'
                }`}>
                  <Icon className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-neon-400' : 'text-gray-400 group-hover/item:text-neon-400'
                  }`} />
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                      <Lock className="w-2.5 h-2.5 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Label — slides in */}
              <span
                className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                  isActive ? 'text-neon-600' : 'text-gray-600'
                }`}
                style={{
                  opacity: expanded ? 1 : 0,
                  transform: expanded ? 'translateX(0)' : 'translateX(-8px)',
                }}
              >
                {label}
                {isLocked && (
                  <span className="ml-1.5 text-[10px] text-gray-400 font-bold uppercase">Pro</span>
                )}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom — Pro badge */}
      <div className="mt-auto mx-2">
        <div className="mx-auto mb-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-all duration-300"
          style={{ width: expanded ? '90%' : 32 }}
        />

        <div className={`flex items-center h-10 rounded-xl transition-all duration-200 ${
          isPro ? 'bg-neon-400/10 border border-neon-400/20' : 'bg-gray-50 border border-gray-100'
        }`}>
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 68 - 8 }}>
            <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${
              isPro ? 'bg-neon-400/20' : 'bg-gray-100'
            } ${hookAnimating ? 'hook-ripple' : ''}`}>
              {isPro ? (
                <Zap
                  className={`w-4 h-4 text-neon-400 ${hookAnimating ? 'animate-hook-drop hook-line' : ''}`}
                  fill="currentColor"
                />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
          <span
            className={`text-xs font-bold whitespace-nowrap transition-all duration-300 ${
              isPro ? 'text-neon-600' : 'text-gray-400'
            }`}
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? 'translateX(0)' : 'translateX(-8px)',
            }}
          >
            {isPro ? t.sidebar.proActive : t.sidebar.planFree}
          </span>
        </div>
      </div>
    </aside>
  );
}
