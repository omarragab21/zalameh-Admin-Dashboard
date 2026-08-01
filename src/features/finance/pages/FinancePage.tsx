import React from 'react';
import { FinanceOverviewTab } from '../components/FinanceOverviewTab';
import { FinanceSubscriptionsTab } from '../components/FinanceSubscriptionsTab';
import { FinanceRenewalsTab } from '../components/FinanceRenewalsTab';
import { FinanceInvoicesTab } from '../components/FinanceInvoicesTab';
import { FinancePaymentsTab } from '../components/FinancePaymentsTab';
import { FinanceReportsTab } from '../components/FinanceReportsTab';

interface FinancePageProps {
  activeSubItem?: string;
  onSubItemChange?: (id: string) => void;
}

export const FinancePage: React.FC<FinancePageProps> = ({
  activeSubItem = 'finance_overview',
}) => {
  const currentTab = activeSubItem.replace('finance_', '') || 'overview';

  return (
    <div className="space-y-6 w-full font-cairo" dir="rtl">
      {/* Subpage Content */}
      {(currentTab === 'overview' || activeSubItem === 'finance') && <FinanceOverviewTab />}
      {currentTab === 'subscriptions' && <FinanceSubscriptionsTab />}
      {currentTab === 'banners' && <FinanceOverviewTab />}
      {currentTab === 'renewals' && <FinanceRenewalsTab />}
      {currentTab === 'ledger' && <FinancePaymentsTab />}
      {currentTab === 'invoices' && <FinanceInvoicesTab />}
      {currentTab === 'reports' && <FinanceReportsTab />}
      {currentTab === 'alerts' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>🔔</span> تنبيهات الإدارة المالية
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
              5 تنبيهات جديدة
            </span>
          </div>
          <div className="space-y-3">
            {[
              { text: 'اشتراك مطعم بيت الزلطة ينتهي خلال 3 أيام', time: 'منذ ساعتين', priority: 'عالي' },
              { text: 'تم استلام الدفعة الخاصة بشركة الاتصالات الأردنية', time: 'منذ 5 ساعات', priority: 'عادي' },
              { text: 'فاتورة محل الأمل للإلكترونيات متأخرة عن السداد', time: 'منذ يوم واحد', priority: 'عالي' },
              { text: 'بانر بنك القاهرة عمان ينتهي قريباً', time: 'منذ يومين', priority: 'متوسط' },
              { text: 'تجديد اشتراك مخبز السعادة في الانتظار', time: 'منذ 3 أيام', priority: 'عادي' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">{item.text}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.time}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  item.priority === 'عالي' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
