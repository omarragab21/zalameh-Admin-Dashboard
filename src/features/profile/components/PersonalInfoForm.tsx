import React, { useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';

export const PersonalInfoForm: React.FC = () => {
  const { user } = useAuth();
  const fullName = user?.name || 'محمد الشمري';
  const nameParts = fullName.split(' ');
  const defaultFirstName = nameParts[0] || 'محمد';
  const defaultLastName = nameParts.slice(1).join(' ') || 'الشمري';

  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [email, setEmail] = useState(user?.email || 'admin@zalameh.com');
  const [phone, setPhone] = useState('+962 79 123 4567');
  const [country, setCountry] = useState('الأردن');
  const [jobTitle, setJobTitle] = useState('مدير النظام');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm w-full">
      <h3 className="text-lg font-extrabold text-slate-900 mb-6">
        المعلومات الشخصية
      </h3>

      {savedSuccess && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-right">
          ✓ تم حفظ التغييرات بنجاح
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 text-right mb-2">
              الاسم الأول
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right font-medium"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 text-right mb-2">
              الاسم الأخير
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right font-medium"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 text-right mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right font-medium"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 text-right mb-2">
              رقم الهاتف
            </label>
            <input
              type="text"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-left font-medium"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-bold text-slate-700 text-right mb-2">
              الدولة
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right font-medium"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 text-right mb-2">
              المسمى الوظيفي
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right font-medium"
            />
          </div>
        </div>

        {/* Submit Button Aligned to LEFT side in RTL (justify-end / flex-row-reverse) */}
        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
          >
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
};
