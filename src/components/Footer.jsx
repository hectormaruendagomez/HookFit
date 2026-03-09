import { Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-20 border-t border-gray-200">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="HookFit"
              className="w-8 h-8 rounded-lg shadow-md shadow-brand-500/15 object-cover"
            />
            <div>
              <span className="text-sm font-bold text-gray-800">
                hook<span className="gradient-text">fit</span>
              </span>
              <p className="text-[10px] text-gray-400 font-medium">Growth Engine for Creators</p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-xs text-center max-w-md leading-relaxed">
            {t.footer.tagline1}
            <br className="hidden sm:block" />
            {t.footer.tagline2} <span className="text-gray-600 font-medium">{t.footer.tagline3}</span>.
          </p>

          {/* Copyright */}
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <span>&copy; {new Date().getFullYear()}</span>
            <span>•</span>
            <span>HookFit</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {t.footer.builtWith} <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
