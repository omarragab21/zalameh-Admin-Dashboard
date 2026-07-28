import React from 'react';
import { AuthProvider, useAuth } from './core/auth/AuthContext';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state while checking token on app launch
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#181c28] flex flex-col items-center justify-center font-cairo">
        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-4" />
        <span className="text-slate-400 text-sm font-semibold">جاري التحقق من التوكن...</span>
      </div>
    );
  }

  // If token exists and is valid -> show Dashboard, otherwise show Login
  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
