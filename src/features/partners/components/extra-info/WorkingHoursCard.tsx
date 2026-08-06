import React from 'react';
import type { DayWorkingHours } from '../../types/partner.types';
import { SectionCard } from './SectionCard';
import { ToggleSwitch } from './ToggleSwitch';
import { TIME_OPTIONS } from './constants';

interface WorkingHoursCardProps {
  workingHours: DayWorkingHours[];
  onToggleDay: (index: number) => void;
  onChangeTime: (index: number, field: 'openTime' | 'closeTime', value: string) => void;
  onApplyToAll: (index: number) => void;
}

const timeSelectClass = (isOpen: boolean) =>
  `px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition cursor-pointer text-center ${
    isOpen
      ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 focus:bg-white focus:border-[#d83f2a] focus:outline-none'
      : 'bg-slate-100/60 border-slate-200/60 text-slate-300 cursor-not-allowed'
  }`;

export const WorkingHoursCard: React.FC<WorkingHoursCardProps> = ({
  workingHours,
  onToggleDay,
  onChangeTime,
  onApplyToAll,
}) => (
  <SectionCard
    headerSpacing="mb-6"
    title="ساعات العمل"
    subtitle="حدد أوقات الفتح والإغلاق لكل يوم"
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    }
  >
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 pb-2">
            <th className="pb-3 px-3 font-bold">اليوم</th>
            <th className="pb-3 px-3 font-bold">الحالة</th>
            <th className="pb-3 px-3 font-bold text-center">الفتح</th>
            <th className="pb-3 px-3 font-bold text-center">الإغلاق</th>
            <th className="pb-3 px-3 font-bold text-left"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/70 text-xs font-semibold">
          {workingHours.map((row, idx) => (
            <tr key={row.day} className="hover:bg-slate-50/50 transition">
              <td className="py-3.5 px-3 font-extrabold text-slate-800 text-sm">{row.day}</td>

              <td className="py-3.5 px-3">
                <div className="flex items-center gap-2">
                  <ToggleSwitch checked={row.isOpen} onToggle={() => onToggleDay(idx)} />
                  <span
                    className={`font-bold text-xs ${
                      row.isOpen ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {row.isOpen ? 'مفتوح' : 'مغلق'}
                  </span>
                </div>
              </td>

              <td className="py-3.5 px-3 text-center">
                <select
                  value={row.openTime}
                  disabled={!row.isOpen}
                  onChange={(e) => onChangeTime(idx, 'openTime', e.target.value)}
                  className={timeSelectClass(row.isOpen)}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </td>

              <td className="py-3.5 px-3 text-center">
                <select
                  value={row.closeTime}
                  disabled={!row.isOpen}
                  onChange={(e) => onChangeTime(idx, 'closeTime', e.target.value)}
                  className={timeSelectClass(row.isOpen)}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </td>

              <td className="py-3.5 px-3 text-left">
                <button
                  type="button"
                  onClick={() => onApplyToAll(idx)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  title="تطبيق هذه المواعيد على جميع الأيام"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>تطبيق للكل</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </SectionCard>
);
