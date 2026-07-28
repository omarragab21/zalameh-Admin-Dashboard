import React from 'react';

export const SystemStatus: React.FC = () => {
  const statuses = [
    { name: 'واجهة برمجية', status: 'نشط', isOk: true, isWarning: false },
    { name: 'قاعدة البيانات', status: 'نشط', isOk: true, isWarning: false },
    { name: 'الإشعارات', status: 'تحذير', isOk: false, isWarning: true },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm mt-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        حالة النظام
      </h3>

      <div className="space-y-2.5">
        {statuses.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">{item.name}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                item.isOk
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                  : 'bg-amber-50 text-amber-600 border border-amber-200/60'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
