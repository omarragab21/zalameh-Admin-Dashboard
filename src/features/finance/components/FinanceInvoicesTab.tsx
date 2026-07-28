import React, { useState } from 'react';

export const FinanceInvoicesTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const invoices = [
    {
      id: 'INV-2024-001',
      partner: 'مطعم الأصالة',
      partnerInitial: 'AA',
      avatarBg: 'bg-red-500',
      package: 'Pro',
      amount: '65 د.أ',
      issueDate: '1 كانون الثاني 2024',
      dueDate: '31 كانون الثاني 2024',
      isOverdue: false,
      status: 'مدفوعة',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
    },
    {
      id: 'INV-2024-002',
      partner: 'صيدلية الشفاء',
      partnerInitial: 'SA',
      avatarBg: 'bg-blue-500',
      package: 'Premium',
      amount: '120 د.أ',
      issueDate: '5 كانون الثاني 2024',
      dueDate: '5 شباط 2024',
      isOverdue: false,
      status: 'مدفوعة',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
    },
    {
      id: 'INV-2024-003',
      partner: 'كافيه نون',
      partnerInitial: 'KN',
      avatarBg: 'bg-emerald-500',
      package: 'Basic',
      amount: '25 د.أ',
      issueDate: '10 كانون الثاني 2024',
      dueDate: '10 شباط 2024',
      isOverdue: false,
      status: 'معلقة',
      statusBg: 'bg-amber-50 text-amber-600 border-amber-200/60',
    },
    {
      id: 'INV-2024-004',
      partner: 'مركز اللياقة',
      partnerInitial: 'ML',
      avatarBg: 'bg-purple-500',
      package: 'Pro',
      amount: '65 د.أ',
      issueDate: '1 كانون الأول 2023',
      dueDate: '31 كانون الأول 2023',
      isOverdue: true,
      status: 'متأخرة',
      statusBg: 'bg-rose-50 text-rose-600 border-rose-200/60',
    },
    {
      id: 'INV-2024-005',
      partner: 'سوبرماركت الخير',
      partnerInitial: 'SK',
      avatarBg: 'bg-amber-500',
      package: 'Premium',
      amount: '120 د.أ',
      issueDate: '15 كانون الثاني 2024',
      dueDate: '15 شباط 2024',
      isOverdue: false,
      status: 'معلقة',
      statusBg: 'bg-amber-50 text-amber-600 border-amber-200/60',
    },
    {
      id: 'INV-2024-006',
      partner: 'عيادة البشري',
      partnerInitial: 'EB',
      avatarBg: 'bg-pink-500',
      package: 'Pro',
      amount: '65 د.أ',
      issueDate: '20 كانون الثاني 2024',
      dueDate: '20 شباط 2024',
      isOverdue: false,
      status: 'ملغاة',
      statusBg: 'bg-slate-100 text-slate-500 border-slate-200/60',
    },
    {
      id: 'INV-2024-007',
      partner: 'بوتيك الأناقة',
      partnerInitial: 'BA',
      avatarBg: 'bg-indigo-500',
      package: 'Basic',
      amount: '25 د.أ',
      issueDate: '22 كانون الثاني 2024',
      dueDate: '22 شباط 2024',
      isOverdue: false,
      status: 'مدفوعة',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
    },
    {
      id: 'INV-2024-008',
      partner: 'مطبخ النكهات',
      partnerInitial: 'MN',
      avatarBg: 'bg-teal-500',
      package: 'Premium',
      amount: '120 د.أ',
      issueDate: '25 كانون الثاني 2024',
      dueDate: '25 شباط 2024',
      isOverdue: false,
      status: 'مدفوعة',
      statusBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
    },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.partner.includes(search) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 font-cairo" dir="rtl">
      {/* Search & Actions Bar - Flat border, no elevation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Export Button */}
        <button
          type="button"
          onClick={() => alert('تم تصدير الفواتير بنجاح')}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer w-full sm:w-auto justify-center"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>تصدير</span>
        </button>

        {/* Search & Filter Inputs */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#d83f2a] cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="مدفوعة">مدفوعة</option>
            <option value="معلقة">معلقة</option>
            <option value="متأخرة">متأخرة</option>
            <option value="ملغاة">ملغاة</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو رقم الفاتورة..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3.5 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition-all text-right font-medium"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Invoices Data Table - Flat border, no elevation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">رقم الفاتورة</th>
                <th className="py-3.5 px-4">الشريك</th>
                <th className="py-3.5 px-4">الباقة</th>
                <th className="py-3.5 px-4">المبلغ</th>
                <th className="py-3.5 px-4">تاريخ الإصدار</th>
                <th className="py-3.5 px-4">تاريخ الاستحقاق</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full ${inv.avatarBg} text-white flex items-center justify-center font-bold text-[10px] shrink-0`}>
                        {inv.partnerInitial}
                      </div>
                      <span className="font-bold text-slate-900">{inv.partner}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                      {inv.package}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">{inv.amount}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.issueDate}</td>
                  <td className={`py-3.5 px-4 ${inv.isOverdue ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                    {inv.dueDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${inv.statusBg}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => alert(`عرض تفاصيل الفاتورة ${inv.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="عرض الفاتورة"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
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
