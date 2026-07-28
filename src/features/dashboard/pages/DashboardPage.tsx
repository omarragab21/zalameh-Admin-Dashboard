import React, { useState } from 'react';
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

export const DashboardPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const navTitles: Record<string, string> = {
    dashboard: 'لوحة القيادة',
    categories: 'إدارة الفئات',
    partners: 'إدارة الشركاء',
    content: 'إدارة المحتوى',
    packages: 'إدارة الباقات',
    ads: 'إدارة الإعلانات',
    finance: 'الإدارة المالية',
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
        onSelectItem={(id) => setActiveItem(id)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar Header */}
        <DashboardHeader
          pageTitle={currentTitle}
          onNavigateToProfile={() => setActiveItem('profile')}
          onNavigateToSettings={() => setActiveItem('settings')}
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
          ) : activeItem === 'finance' ? (
            <FinancePage />
          ) : activeItem === 'profile' ? (
            <ProfilePage />
          ) : activeItem === 'settings' ? (
            <SettingsPage />
          ) : (
            /* Selected Subpage Placeholder */
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#d83f2a] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                ⚙️
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">{currentTitle}</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                صفحة {currentTitle} قيد العمل والربط. يمكنك العودة لصفحة لوحة القيادة لعرض الإحصائيات الشاملة.
              </p>
              <button
                onClick={() => setActiveItem('dashboard')}
                className="mt-6 px-5 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
              >
                العودة إلى لوحة القيادة
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
