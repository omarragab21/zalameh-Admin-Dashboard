import React, { useState } from 'react';

interface LedgerTransaction {
  id: string;
  trxCode: string;
  category: 'اشتراك' | 'بانر';
  categoryBg: string;
  client: string;
  amount: string;
  amountColor: string;
  paymentMethod: 'CliQ' | 'نقد' | 'المحفظة';
  methodBg: string;
  invoiceCode: string;
  date: string;
  status: 'ناجح' | 'معلق' | 'فشل';
  statusBg: string;
  iconType: 'card' | 'banner';
}

export const FinancePaymentsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [transactions] = useState<LedgerTransaction[]>([
    {
      id: '1',
      trxCode: 'TRX-001',
      category: 'اشتراك',
      categoryBg: 'bg-sky-50 text-sky-600 border border-sky-200',
      client: 'متجر زلمة للشوكولاتة',
      amount: '+650 د.أ',
      amountColor: 'text-emerald-600',
      paymentMethod: 'CliQ',
      methodBg: 'bg-sky-100 text-sky-700',
      invoiceCode: 'INV-2025-S001',
      date: '2025-01-15',
      status: 'ناجح',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      iconType: 'card',
    },
    {
      id: '2',
      trxCode: 'TRX-002',
      category: 'بانر',
      categoryBg: 'bg-purple-50 text-purple-600 border border-purple-200',
      client: 'شركة الاتصالات الأردنية',
      amount: '+6,000 د.أ',
      amountColor: 'text-emerald-600',
      paymentMethod: 'نقد',
      methodBg: 'bg-emerald-100 text-emerald-700',
      invoiceCode: 'INV-2025-001',
      date: '2025-06-01',
      status: 'ناجح',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      iconType: 'banner',
    },
    {
      id: '3',
      trxCode: 'TRX-003',
      category: 'اشتراك',
      categoryBg: 'bg-sky-50 text-sky-600 border border-sky-200',
      client: 'عصام الديرباني للتكييف',
      amount: '+450 د.أ',
      amountColor: 'text-emerald-600',
      paymentMethod: 'المحفظة',
      methodBg: 'bg-purple-100 text-purple-700',
      invoiceCode: 'INV-2025-S002',
      date: '2025-06-01',
      status: 'ناجح',
      statusBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      iconType: 'card',
    },
    {
      id: '4',
      trxCode: 'TRX-004',
      category: 'بانر',
      categoryBg: 'bg-purple-50 text-purple-600 border border-purple-200',
      client: 'بنك القاهرة عمان',
      amount: '3,500 د.أ',
      amountColor: 'text-amber-600',
      paymentMethod: 'CliQ',
      methodBg: 'bg-sky-100 text-sky-700',
      invoiceCode: 'INV-2025-002',
      date: '2025-06-10',
      status: 'معلق',
      statusBg: 'bg-amber-50 text-amber-600 border border-amber-200',
      iconType: 'banner',
    },
    {
      id: '5',
      trxCode: 'TRX-005',
      category: 'اشتراك',
      categoryBg: 'bg-sky-50 text-sky-600 border border-sky-200',
      client: 'محل الأمل للإلكترونيات',
      amount: '150 د.أ',
      amountColor: 'text-rose-600',
      paymentMethod: 'نقد',
      methodBg: 'bg-emerald-100 text-emerald-700',
      invoiceCode: 'INV-2025-S005',
      date: '2025-06-14',
      status: 'فشل',
      statusBg: 'bg-rose-50 text-rose-600 border border-rose-200',
      iconType: 'card',
    },
  ]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.client.includes(search) ||
      t.invoiceCode.toLowerCase().includes(search.toLowerCase()) ||
      t.trxCode.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleGenerateInvoicePDF = (item: LedgerTransaction) => {
    const invoiceHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <title>فاتورة ${item.invoiceCode}</title>
        <style>
          body { font-family: 'Cairo', system-ui, sans-serif; padding: 40px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #d83f2a; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #d83f2a; }
          .code { font-size: 14px; color: #64748b; margin-top: 5px; }
          .details { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .details td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .label { font-weight: bold; color: #64748b; width: 40%; }
          .value { font-weight: bold; color: #0f172a; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">نظام زلمة المالي - فاتورة رسمية</div>
          <div class="code">رقم الفاتورة: ${item.invoiceCode} | رمز العملية: ${item.trxCode}</div>
        </div>
        <table class="details">
          <tr><td class="label">اسم العميل:</td><td class="value">${item.client}</td></tr>
          <tr><td class="label">النوع:</td><td class="value">${item.category}</td></tr>
          <tr><td class="label">المبلغ:</td><td class="value">${item.amount}</td></tr>
          <tr><td class="label">طريقة الدفع:</td><td class="value">${item.paymentMethod}</td></tr>
          <tr><td class="label">التاريخ:</td><td class="value">${item.date}</td></tr>
          <tr><td class="label">الحالة:</td><td class="value">${item.status}</td></tr>
        </table>
        <div class="footer">شكراً لتعاملكم مع تطبيق ونظام زلمة</div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.invoiceCode}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-cairo text-slate-800" dir="rtl">
      {/* 1. Header Title Banner */}
      <div className="py-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
          السجل المالي
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          جميع المعاملات المالية والفواتير
        </p>
      </div>

      {/* 2. Summary KPI Container (Bordered with System Primary Color #d83f2a and White Background) */}
      <div className="bg-white border-2 border-[#d83f2a]/30 rounded-3xl p-5 shadow-sm hover:border-[#d83f2a]/60 transition">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-200/80 gap-4">
          {/* Total Receipts */}
          <div className="flex items-center justify-between px-3 py-1">
            <div>
              <span className="text-xs font-bold text-slate-500 block">إجمالي المقبوضات</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">31,380 د.أ</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shadow-xs shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>

          {/* Pending */}
          <div className="flex items-center justify-between px-3 py-1">
            <div>
              <span className="text-xs font-bold text-slate-500 block">المعلقة</span>
              <span className="text-2xl font-black text-amber-500 mt-1 block">3,950 د.أ</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-xs shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Overdue / Failed */}
          <div className="flex items-center justify-between px-3 py-1">
            <div>
              <span className="text-xs font-bold text-slate-500 block">المتأخرة</span>
              <span className="text-2xl font-black text-rose-500 mt-1 block">150 د.أ</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-xs shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search and Filters Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث عن العميل أو رقم الفاتورة..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition-all text-right font-medium shadow-xs"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#d83f2a] cursor-pointer shadow-xs whitespace-nowrap"
          >
            <option value="all">الكل (النوع)</option>
            <option value="اشتراك">اشتراك</option>
            <option value="بانر">بانر</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#d83f2a] cursor-pointer shadow-xs whitespace-nowrap"
          >
            <option value="all">الكل (الحالة)</option>
            <option value="ناجح">ناجح</option>
            <option value="معلق">معلق</option>
            <option value="فشل">فشل</option>
          </select>
        </div>
      </div>

      {/* 4. Transactions Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs whitespace-nowrap">
            <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="py-4 px-4 whitespace-nowrap">العملية</th>
                <th className="py-4 px-4 whitespace-nowrap">النوع</th>
                <th className="py-4 px-4 whitespace-nowrap">العميل</th>
                <th className="py-4 px-4 whitespace-nowrap">المبلغ</th>
                <th className="py-4 px-4 whitespace-nowrap">طريقة الدفع</th>
                <th className="py-4 px-4 whitespace-nowrap">رقم الفاتورة</th>
                <th className="py-4 px-4 whitespace-nowrap">التاريخ</th>
                <th className="py-4 px-4 whitespace-nowrap">الحالة</th>
                <th className="py-4 px-4 text-center whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/60 transition">
                  {/* Transaction Code & Icon */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                        {trx.iconType === 'card' ? (
                          <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <span className="font-mono font-bold text-slate-900">{trx.trxCode}</span>
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] ${trx.categoryBg}`}>
                      {trx.category}
                    </span>
                  </td>

                  {/* Client Name */}
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                    {trx.client}
                  </td>

                  {/* Amount */}
                  <td className={`py-3.5 px-4 font-black text-sm whitespace-nowrap ${trx.amountColor}`}>
                    {trx.amount}
                  </td>

                  {/* Payment Method Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-lg font-bold text-[11px] ${trx.methodBg}`}>
                      {trx.paymentMethod}
                    </span>
                  </td>

                  {/* Invoice Code */}
                  <td className="py-3.5 px-4 text-slate-600 font-mono font-semibold text-[11px] whitespace-nowrap">
                    {trx.invoiceCode}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {trx.date}
                  </td>

                  {/* Status Badge with SVG Icon */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full font-bold text-xs gap-1.5 ${trx.statusBg}`}>
                      {trx.status === 'ناجح' ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>ناجح</span>
                        </>
                      ) : trx.status === 'معلق' ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>معلق</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>فشل</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Actions: Printer SVG Icon (Generates & Downloads PDF Invoice) */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleGenerateInvoicePDF(trx)}
                        className="px-3 py-1.5 rounded-lg text-sky-600 bg-sky-50 hover:bg-sky-100 transition cursor-pointer flex items-center gap-1.5 font-bold text-xs border border-sky-100"
                        title="طباعة وتحميل PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>طباعة</span>
                      </button>
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
