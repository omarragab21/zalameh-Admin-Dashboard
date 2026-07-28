import React from 'react';
import { LoginHeader } from '../components/LoginHeader';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#181c28] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-cairo">
      {/* Background Radial Glow Effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Container Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[28px] p-7 sm:p-10 shadow-2xl shadow-black/50 z-10 border border-white/10 relative backdrop-blur-sm">
        <LoginHeader />
        <LoginForm />
      </div>

      {/* Footer Text */}
      <footer className="mt-8 text-center text-slate-400/70 text-xs font-medium z-10 tracking-wide">
        © 2026 منصة زلمة. جميع الحقوق محفوظة
      </footer>
    </div>
  );
};
