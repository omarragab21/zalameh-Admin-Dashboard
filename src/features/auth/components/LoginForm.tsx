import React, { useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('يرجى أدخال البريد الإلكتروني');
      return;
    }
    if (!password.trim()) {
      setError('يرجى أدخال كلمة المرور');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email, password });
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#d83f2a] text-xs font-bold text-right flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-[#d83f2a] font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-xs font-bold text-slate-700 text-right mb-2">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          dir="rtl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أدخل البريد الإلكتروني"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right placeholder-slate-400 font-medium"
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-xs font-bold text-slate-700 text-right mb-2">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          dir="rtl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right placeholder-slate-400 font-medium"
        />
      </div>

      {/* Forgot Password Link - Aligned to LEFT as requested */}
      <div className="text-left pt-1">
        <a
          href="#forgot-password"
          onClick={(e) => {
            e.preventDefault();
            alert('يرجى التواصل مع مدير النظام لإعادة تعيين كلمة المرور');
          }}
          className="text-xs font-bold text-[#d83f2a] hover:text-[#b83320] transition-colors inline-block"
        >
          نسيت كلمة المرور؟
        </a>
      </div>

      {/* Submit Button with rgba(216, 63, 42, 1) [#d83f2a] */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-4 rounded-2xl bg-[#d83f2a] hover:bg-[#c33522] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#d83f2a]/30 disabled:opacity-70 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري التحقق...</span>
          </>
        ) : (
          <span>دخول إلى لوحة التحكم</span>
        )}
      </button>
    </form>
  );
};
