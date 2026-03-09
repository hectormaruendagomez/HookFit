import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

export default function AuthPage({ onBack, onLogin }) {
  const { t } = useLanguage();
  const a = t.auth;
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });
      if (error) alert(error.message);
      else onLogin();
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name } }
      });
      if (error) alert(error.message);
      else alert('¡Revisa tu email para confirmar el registro!');
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) alert(error.message);
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-16 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {a.back}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="HookFit" className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              hook<span className="gradient-text">fit</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          {isLogin ? a.loginTitle : a.registerTitle}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {isLogin ? a.loginDesc : a.registerDesc}
        </p>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {isLogin ? a.googleLogin : a.googleRegister}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">{a.orEmail}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name — only for register */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{a.nameLabel}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={a.namePlaceholder}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-neon-400 focus:ring-2 focus:ring-neon-400/20 transition-all"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{a.emailLabel}</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={a.emailPlaceholder}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-neon-400 focus:ring-2 focus:ring-neon-400/20 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{a.passwordLabel}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-12 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-neon-400 focus:ring-2 focus:ring-neon-400/20 transition-all"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forgot password — only login */}
          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-xs text-neon-600 hover:text-neon-500 font-semibold transition-colors">
                {a.forgotPassword}
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-neon-400 text-gray-950 font-bold py-3.5 rounded-xl hover:bg-neon-300 transition-all duration-200 text-sm mt-2"
          >
            {isLogin ? a.loginBtn : a.registerBtn}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle login/register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? a.noAccount : a.hasAccount}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-600 font-semibold hover:text-neon-500 transition-colors"
          >
            {isLogin ? a.registerLink : a.loginLink}
          </button>
        </p>
      </div>
    </section>
  );
}
