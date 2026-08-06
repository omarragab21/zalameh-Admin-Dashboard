import React from 'react';
import type { PaymentMethod } from '../../types/partner.types';
import { SectionCard } from './SectionCard';
import { PAYMENT_OPTIONS } from './constants';

interface PaymentMethodsCardProps {
  paymentMethods: PaymentMethod[];
  onToggle: (methodId: PaymentMethod) => void;
}

export const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({
  paymentMethods,
  onToggle,
}) => (
  <SectionCard
    title="طرق الدفع"
    subtitle="حدد طرق الدفع المقبولة"
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    }
  >
    <div className="flex flex-wrap items-center gap-2.5">
      {PAYMENT_OPTIONS.map((opt) => {
        const isSelected = paymentMethods.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onToggle(opt.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? 'border border-[#d83f2a] bg-rose-50/70 text-[#d83f2a] shadow-sm'
                : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span>{opt.label}</span>
            {isSelected && (
              <svg className="w-3.5 h-3.5 text-[#d83f2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  </SectionCard>
);
