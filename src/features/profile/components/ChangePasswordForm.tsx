import React, { useState } from 'react';

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword) {
      setIsError(true);
      setMessage('يرجى أدخال كلمة المرور الحالية');
      return;
    }
    if (!newPassword) {
      setIsError(true);
      setMessage('يرجى أدخال كلمة المرور الجديدة');
      return;
    }
    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage('كلمتا المرور غير متطابقتين');
      return;
    }

    setIsError(false);
    setMessage('تم تحديث كلمة المرور بنجاح');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm w-full">
      <h3 className="text-lg font-extrabold text-slate-900 mb-6">
        تغيير كلمة المرور
      </h3>

      {message && (
        <div
          className={`mb-6 p-3.5 rounded-xl text-xs font-bold text-right w-full ${
            isError
              ? 'bg-red-50 border border-red-200 text-[#d83f2a]'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 text-right mb-2">
            كلمة المرور الحالية
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right font-medium"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 text-right mb-2">
            كلمة المرور الجديدة
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right font-medium"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 text-right mb-2">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-right font-medium"
          />
        </div>

        {/* Submit Button Aligned to LEFT side in RTL (justify-end) */}
        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-bold text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
          >
            تحديث كلمة المرور
          </button>
        </div>
      </form>
    </div>
  );
};
