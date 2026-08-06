import React from 'react';
import { SectionCard } from './SectionCard';
import { ToggleSwitch } from './ToggleSwitch';

interface DeliveryServiceCardProps {
  deliveryEnabled: boolean;
  onToggle: () => void;
}

export const DeliveryServiceCard: React.FC<DeliveryServiceCardProps> = ({
  deliveryEnabled,
  onToggle,
}) => (
  <SectionCard
    headerSpacing="mb-4"
    title="خدمة التوصيل"
    subtitle="هل تتوفر خدمة التوصيل؟"
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6-1a1 1 0 011-1h1m0 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    }
  >
    <div className="bg-slate-50/60 rounded-2xl p-4 sm:p-5 border border-slate-100 flex items-center justify-between gap-4">
      <div>
        <h4 className="text-sm font-extrabold text-slate-900 mb-0.5">خدمة التوصيل</h4>
        <p className="text-xs font-semibold text-slate-400">
          {deliveryEnabled
            ? 'متاحة — يمكن للعملاء طلب التوصيل'
            : 'غير متاحة — لا يمكن للعملاء طلب التوصيل'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`font-bold text-xs ${
            deliveryEnabled ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          {deliveryEnabled ? 'متاحة' : 'غير متاحة'}
        </span>
        <ToggleSwitch checked={deliveryEnabled} onToggle={onToggle} />
      </div>
    </div>
  </SectionCard>
);
