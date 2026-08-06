import React from 'react';

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  headerSpacing?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  subtitle,
  headerSpacing = 'mb-5',
  children,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
    <div className={`flex items-center gap-3 ${headerSpacing}`}>
      <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#d83f2a] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);
