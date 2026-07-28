import React, { useState } from 'react';
import { FinanceTabs } from '../components/FinanceTabs';
import { FinanceOverviewTab } from '../components/FinanceOverviewTab';
import { FinanceInvoicesTab } from '../components/FinanceInvoicesTab';
import { FinancePaymentsTab } from '../components/FinancePaymentsTab';
import { FinanceReportsTab } from '../components/FinanceReportsTab';

export const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments' | 'reports'>('overview');

  return (
    <div className="space-y-6 w-full font-cairo">
      {/* Top Sub-tabs Bar (نظرة عامة, الفواتير, المدفوعات, التقارير) */}
      <FinanceTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Tab Content */}
      {activeTab === 'overview' && <FinanceOverviewTab />}
      {activeTab === 'invoices' && <FinanceInvoicesTab />}
      {activeTab === 'payments' && <FinancePaymentsTab />}
      {activeTab === 'reports' && <FinanceReportsTab />}
    </div>
  );
};
