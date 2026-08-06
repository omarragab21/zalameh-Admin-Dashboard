import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatsOverview } from '../components/StatsOverview';
import { GrowthCharts } from '../components/GrowthCharts';
import { RecentActivities } from '../components/RecentActivities';
import { QuickActions } from '../components/QuickActions';
import { SystemStatus } from '../components/SystemStatus';

import { ProfilePage } from '../../profile/pages/ProfilePage';
import { SettingsPage } from '../../settings/pages/SettingsPage';
import { FinancePage } from '../../finance/pages/FinancePage';
import { CategoriesPage } from '../../categories/pages/CategoriesPage';
import { ContentManagementPage } from '../../content/pages/ContentManagementPage';
import { PartnersPage } from '../../partners/pages/PartnersPage';
import { PackagesPage } from '../../packages/pages/PackagesPage';
import { AdsPage } from '../../ads/pages/AdsPage';

const ACTIVE_TAB_KEY = 'zalameh_active_nav_tab';

export const DashboardPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize active tab from URL query param "?tab=..." or localStorage, defaulting to 'partners'
  const [activeItem, setActiveItem] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) return tabParam;
      const saved = localStorage.getItem(ACTIVE_TAB_KEY);
      if (saved) return saved;
    }
    return 'dashboard';
  });

  // Sync active tab with localStorage & URL search params on tab change
  const handleSelectItem = (id: string) => {
    setActiveItem(id);
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, id);
      if (typeof window !== 'undefined' && window.history.pushState) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', id);
        url.searchParams.delete('partner_id');
        url.searchParams.delete('brand_id');
        window.history.pushState({}, '', url.toString());
      }
    } catch {
      // Ignore storage errors
    }
  };

  // Sync back button / forward button browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveItem(tabParam);
      } else {
        const saved = localStorage.getItem(ACTIVE_TAB_KEY);
        setActiveItem(saved || 'partners');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navTitles: Record<string, string> = {
    dashboard: 'لوحة القيادة',
    categories: 'إدارة الفئات',
    partners: 'إدارة الشركاء',
    content: 'إدارة المحتوى',
    packages: 'إدارة الباقات',
    ads: 'إدارة الإعلانات',
    finance: 'الإدارة المالية',
    finance_overview: 'الإدارة المالية - النظرة العامة',
    finance_subscriptions: 'الإدارة المالية - الاشتراكات',
    finance_banners: 'الإدارة المالية - البانرات',
    finance_renewals: 'الإدارة المالية - التجديدات القادمة',
    finance_ledger: 'الإدارة المالية - السجل المالي',
    finance_reports: 'الإدارة المالية - التقارير',
    finance_alerts: 'الإدارة المالية - التنبيهات',
    roles: 'الأدوار والصلاحيات',
    users: 'المستخدمون',
    settings: 'إعدادات النظام',
    profile: 'الملف الشخصي',
  };

  const currentTitle = navTitles[activeItem] || 'لوحة القيادة';

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex font-cairo" dir="rtl">
      {/* Right Sidebar (RTL) */}
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeItem={activeItem}
        onSelectItem={handleSelectItem}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar Header */}
        <DashboardHeader
          pageTitle={currentTitle}
          onNavigateToProfile={() => handleSelectItem('profile')}
          onNavigateToSettings={() => handleSelectItem('settings')}
        />

        {/* Dashboard View Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeItem === 'dashboard' ? (
            <>
              {/* 1. Top Stats Cards (4 Cards) */}
              <StatsOverview />

              {/* 2. Charts Section (Line Chart + Bar Chart) */}
              <GrowthCharts />

              {/* 3. Bottom Grid: Activities & Quick Actions + System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                <div className="lg:col-span-2">
                  <RecentActivities />
                </div>
                <div className="flex flex-col gap-4">
                  <QuickActions />
                  <SystemStatus />
                </div>
              </div>
            </>
          ) : activeItem === 'categories' ? (
            <CategoriesPage />
          ) : activeItem === 'partners' ? (
            <PartnersPage />
          ) : activeItem === 'content' ? (
            <ContentManagementPage />
          ) : activeItem === 'packages' ? (
            <PackagesPage />
          ) : activeItem === 'ads' ? (
            <AdsPage />
          ) : activeItem.startsWith('finance') ? (
            <FinancePage activeSubItem={activeItem} onSubItemChange={handleSelectItem} />
          ) : activeItem === 'profile' ? (
            <ProfilePage />
          ) : activeItem === 'settings' ? (
            <SettingsPage />
          ) : (
            /* Selected Subpage Placeholder */
            <div className="bg-[#161b26] rounded-2xl p-8 border border-slate-800 shadow-sm text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                ⚙️
              </div>
              <h2 className="text-xl font-extrabold text-white mb-2">{currentTitle}</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                صفحة {currentTitle} قيد العمل والربط. يمكنك العودة لصفحة لوحة القيادة أو الانتقال إلى النظرة العامة للإدارة المالية.
              </p>
              <button
                onClick={() => handleSelectItem('finance_overview')}
                className="mt-6 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                الذهاب إلى النظرة العامة للمالية
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
