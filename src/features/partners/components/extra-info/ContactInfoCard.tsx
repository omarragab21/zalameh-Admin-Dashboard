import React from 'react';
import { SectionCard } from './SectionCard';
import { DEFAULT_WHATSAPP, DEFAULT_BRANCH_PHONE } from './constants';

interface ContactInfoCardProps {
  whatsapp: string;
  branchPhone: string;
  onChangeWhatsapp: (value: string) => void;
  onChangeBranchPhone: (value: string) => void;
}

const inputClass =
  'w-full text-right px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] focus:bg-white transition';

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  whatsapp,
  branchPhone,
  onChangeWhatsapp,
  onChangeBranchPhone,
}) => (
  <SectionCard
    title="معلومات التواصل"
    subtitle="أرقام التواصل المخصصة لهذا الفرع"
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    }
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم واتساب</label>
        <input
          type="text"
          value={whatsapp}
          onChange={(e) => onChangeWhatsapp(e.target.value)}
          placeholder={DEFAULT_WHATSAPP}
          dir="ltr"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم هاتف الفرع</label>
        <input
          type="text"
          value={branchPhone}
          onChange={(e) => onChangeBranchPhone(e.target.value)}
          placeholder={DEFAULT_BRANCH_PHONE}
          dir="ltr"
          className={inputClass}
        />
      </div>
    </div>
  </SectionCard>
);
