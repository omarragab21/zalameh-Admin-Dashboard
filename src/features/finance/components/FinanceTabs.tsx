import React from 'react';

interface FinanceTabsProps {
  activeTab: 'overview' | 'invoices' | 'payments' | 'reports';
  onTabChange: (tab: 'overview' | 'invoices' | 'payments' | 'reports') => void;
}

export const FinanceTabs: React.FC<FinanceTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', name: 'نظرة عامة' },
    { id: 'invoices', name: 'الفواتير' },
    { id: 'payments', name: 'المدفوعات' },
    { id: 'reports', name: 'التقارير' },
  ] as const;

  return (
    <div className="flex justify-start mb-6 font-cairo">
      {/* Container with flat border, no elevation/shadow, aligned to RIGHT side in RTL */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 overflow-x-auto max-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#d83f2a] text-white shadow-sm shadow-[#d83f2a]/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
