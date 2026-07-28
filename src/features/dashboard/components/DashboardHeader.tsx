import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';

interface HeaderProps {
  pageTitle?: string;
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  pageTitle = 'لوحة القيادة',
  onNavigateToProfile,
  onNavigateToSettings,
}) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || 'محمد أحمد';
  const userEmail = user?.email || 'admin@zalameh.io';
  const initial = userName.charAt(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-cairo">
      {/* Right side (RTL): Title & Breadcrumbs */}
      <div>
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>الرئيسية</span>
          <span>/</span>
          <span className="text-[#d83f2a] font-bold">{pageTitle}</span>
        </div>
      </div>

      {/* Left side (RTL): Search, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="بحث..."
            className="w-56 lg:w-64 bg-slate-100/70 border border-slate-200/90 rounded-xl py-1.5 px-3.5 pr-9 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] focus:bg-white transition-all text-right font-medium"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Notification Bell Icon */}
        <button
          type="button"
          className="relative p-2 rounded-xl bg-slate-100/70 hover:bg-slate-200/70 border border-slate-200/80 text-slate-600 transition cursor-pointer"
          title="الإشعارات"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="w-2 h-2 rounded-full bg-[#d83f2a] absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* User Profile Badge & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 border border-slate-200/80 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#d83f2a] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {initial}
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 hidden sm:inline-block">
              {userName}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown Menu (Screenshot 4) */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Summary Header */}
              <div className="px-4 pb-3 flex items-center gap-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-[#d83f2a] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  {initial}
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-sm font-extrabold text-slate-900 truncate">{userName}</div>
                  <div className="text-xs font-medium text-slate-400 truncate">{userEmail}</div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="pt-2 pb-1">
                {/* Option 1: Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onNavigateToProfile) onNavigateToProfile();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-right"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>الملف الشخصي</span>
                </button>

                {/* Option 2: Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onNavigateToSettings) onNavigateToSettings();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-right"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>الإعدادات</span>
                </button>
              </div>

              {/* Divider & Logout */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-xs sm:text-sm font-bold text-[#d83f2a] hover:bg-red-50/60 transition cursor-pointer text-right"
                >
                  <svg className="w-4 h-4 text-[#d83f2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
