import React from 'react';

export const FinancePaymentsTab: React.FC = () => {
  const payments = [
    {
      ref: 'TXN-98231',
      partner: 'مطعم الأصالة',
      amount: '65 د.أ',
      method: 'تحويل بنكي',
      methodIcon: '🏦',
      date: '28 كانون الثاني 2024',
      status: 'مؤكدة',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      actionIcon: null,
    },
    {
      ref: 'TXN-98230',
      partner: 'صيدلية الشفاء',
      amount: '120 د.أ',
      method: 'دفع إلكتروني',
      methodIcon: '🌐',
      date: '27 كانون الثاني 2024',
      status: 'مؤكدة',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      actionIcon: null,
    },
    {
      ref: 'TXN-98229',
      partner: 'بوتيك الأناقة',
      amount: '25 د.أ',
      method: 'بطاقة ائتمان',
      methodIcon: '💳',
      date: '26 كانون الثاني 2024',
      status: 'مؤكدة',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      actionIcon: null,
    },
    {
      ref: 'TXN-98228',
      partner: 'مطبخ النكهات',
      amount: '120 د.أ',
      method: 'تحويل بنكي',
      methodIcon: '🏦',
      date: '25 كانون الثاني 2024',
      status: 'مؤكدة',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      actionIcon: null,
    },
    {
      ref: 'TXN-98227',
      partner: 'كافيه نون',
      amount: '25 د.أ',
      method: 'نقداً',
      methodIcon: '💵',
      date: '24 كانون الثاني 2024',
      status: 'معلقة',
      statusBg: 'bg-amber-50 text-amber-600 border-amber-200/60',
      actionIcon: (
        <button
          type="button"
          onClick={() => alert('تأكيد الدفع المعلق')}
          className="p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
          title="تأكيد الدفع"
        >
          ✓
        </button>
      ),
    },
    {
      ref: 'TXN-98226',
      partner: 'سوبرماركت الخير',
      amount: '120 د.أ',
      method: 'دفع إلكتروني',
      methodIcon: '🌐',
      date: '23 كانون الثاني 2024',
      status: 'فاشلة',
      statusBg: 'bg-rose-50 text-rose-600 border-rose-200/60',
      actionIcon: (
        <button
          type="button"
          onClick={() => alert('إعادة المحاولة')}
          className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
          title="إعادة المحاولة"
        >
          ↻
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5 font-cairo" dir="rtl">
      {/* Payments Data Table - Flat border, no elevation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">المرجع</th>
                <th className="py-3.5 px-4">الشريك</th>
                <th className="py-3.5 px-4">المبلغ</th>
                <th className="py-3.5 px-4">طريقة الدفع</th>
                <th className="py-3.5 px-4">التاريخ</th>
                <th className="py-3.5 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.map((pay, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{pay.ref}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{pay.partner}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">{pay.amount}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <span>{pay.methodIcon}</span>
                      <span>{pay.method}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{pay.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${pay.statusBg}`}>
                        {pay.status}
                      </span>
                      {pay.actionIcon}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
