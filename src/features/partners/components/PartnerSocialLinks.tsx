import React, { useState } from 'react';
import type { SocialLinks } from '../types/partner.types';

interface PartnerSocialLinksProps {
  name: string;
  avatarUrl?: string;
  socialLinks?: SocialLinks;
  title?: string;
  onBack?: () => void;
  onSave?: (links: SocialLinks) => void;
}

const defaultSocialLinks: SocialLinks = {
  website: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  twitter: '',
  snapchat: '',
  youtube: '',
};

const socialFields: { key: keyof SocialLinks; label: string; placeholder: string; icon: React.ReactNode; colorClass: string }[] = [
  {
    key: 'website',
    label: 'الموقع الإلكتروني',
    placeholder: 'https://example.com',
    colorClass: 'bg-blue-100 text-blue-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'فيسبوك',
    placeholder: 'https://facebook.com/...',
    colorClass: 'bg-blue-100 text-blue-700',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'تيك توك',
    placeholder: 'https://tiktok.com/@...',
    colorClass: 'bg-slate-200 text-slate-800',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.8-.1 3.61.25 5.26.91.6.25 1.05.55 1.35.95.2.25.35.55.45.85.1.35.15.7.15 1.05v6.65c-.05 1.55-.45 3.05-1.2 4.4-.7 1.25-1.75 2.3-3 2.95-1.25.65-2.65 1-4.05 1-1.45 0-2.85-.35-4.15-1-1.25-.7-2.25-1.7-2.95-2.95-.65-1.35-1-2.85-1-4.4 0-1.55.35-3.05 1.05-4.4.7-1.25 1.75-2.25 3-2.95.85-.45 1.75-.75 2.7-.9l.5-.1v5.65c-.4.1-.75.25-1.05.45-.5.35-.85.85-1.05 1.4-.1.3-.15.6-.15.95 0 .7.25 1.35.7 1.85.45.5 1.05.8 1.75.85.65.05 1.25-.15 1.75-.55.5-.4.85-.95.95-1.6.05-.25.05-.55.05-.85V.02h3.25zM19.5 1.8c-.65-.25-1.35-.45-2.05-.55V7.1c.65.15 1.25.45 1.75.9.5.45.85 1 1.05 1.65.1.4.15.8.15 1.2v.85h3.25V5.4c0-.45-.05-.9-.15-1.35-.15-.55-.45-1.05-.85-1.45-.55-.55-1.25-.85-2.05-.85-.3 0-.55.05-.85.15-.25.05-.45.15-.65.25-.15.1-.35.2-.5.35-.15.1-.3.25-.45.4z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    label: 'إنستغرام',
    placeholder: 'https://instagram.com/...',
    colorClass: 'bg-pink-100 text-pink-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    key: 'snapchat',
    label: 'سناب شات',
    placeholder: 'https://snapchat.com/add/...',
    colorClass: 'bg-yellow-100 text-yellow-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.183 2.25c.712 0 1.76.19 2.547.97.63.626.972 1.56.972 2.71 0 .198-.012.436-.037.71-.005.057.02.11.07.142.166.106.54.32 1.073.507.405.146.71.166.86.05.127-.097.17-.26.155-.41-.008-.078-.006-.17-.002-.273.003-.088.006-.184.006-.286 0-.576.46-1.04 1.02-1.04.57 0 1.03.464 1.03 1.04 0 1.16-.68 2.09-1.78 2.43-.41.13-.86.14-1.31.04-.17-.04-.33-.11-.48-.19-.18-.1-.35-.22-.5-.35-.12-.1-.24-.21-.35-.33-.05-.05-.1-.1-.15-.15-.09-.09-.21-.14-.34-.14-.15 0-.29.06-.4.18-.1.11-.16.27-.14.43.05.46.18.9.38 1.3.5.98 1.28 1.8 2.24 2.36.16.1.31.2.45.32.36.3.6.7.7 1.15.1.45.04.9-.17 1.31-.29.56-.78.99-1.36 1.19-.23.08-.47.12-.72.12-.15 0-.3-.02-.45-.05-.19-.04-.38-.1-.56-.19-.15-.07-.3-.16-.45-.25-.23-.14-.47-.28-.72-.38-.36-.14-.73-.21-1.11-.21-.35 0-.7.05-1.03.16-.3.1-.58.25-.84.44-.2.14-.41.27-.63.37-.33.16-.69.24-1.05.24-.32 0-.64-.06-.94-.19-.41-.17-.77-.46-1.02-.82-.27-.4-.38-.88-.31-1.35.06-.42.27-.8.59-1.08.18-.16.38-.3.6-.42.93-.5 1.67-1.28 2.13-2.21.18-.37.3-.76.35-1.17.02-.16-.04-.32-.15-.43-.11-.11-.25-.18-.4-.18-.13 0-.25.05-.35.15-.05.05-.1.1-.15.15-.1.11-.22.22-.34.32-.15.13-.31.25-.48.35-.15.08-.31.15-.48.19-.45.1-.9.09-1.31-.04-1.1-.34-1.78-1.27-1.78-2.43 0-.576.46-1.04 1.03-1.04.56 0 1.02.464 1.02 1.04 0 .102.003.198.006.286.004.103.006.195-.002.273-.015.15.028.313.155.41.15.116.455.096.86-.05.533-.187.907-.401 1.073-.507.05-.032.075-.085.07-.142-.025-.274-.037-.512-.037-.71 0-1.15.342-2.084.972-2.71.787-.78 1.835-.97 2.547-.97z" />
      </svg>
    ),
  },
  {
    key: 'twitter',
    label: 'X (تويتر)',
    placeholder: 'https://x.com/...',
    colorClass: 'bg-slate-200 text-slate-800',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'يوتيوب',
    placeholder: 'https://youtube.com/@...',
    colorClass: 'bg-red-100 text-red-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export const PartnerSocialLinks: React.FC<PartnerSocialLinksProps> = ({
  name,
  avatarUrl,
  socialLinks,
  title = 'روابط التواصل الاجتماعي',
  onBack,
  onSave,
}) => {
  const [links, setLinks] = useState<SocialLinks>({
    ...defaultSocialLinks,
    ...socialLinks,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (key: keyof SocialLinks, value: string) => {
    setLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(links);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    setLinks({ ...defaultSocialLinks, ...socialLinks });
    onBack?.();
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2">
            <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>
              الرئيسية
            </span>
            <span>/</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>
              إدارة الشركاء
            </span>
            <span>/</span>
            <span className="text-[#d83f2a]">روابط التواصل الاجتماعي</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
              title="العودة"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
            )}
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500 font-medium">
                تابعة لـ: <span className="font-bold text-slate-700">{name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="text-right mb-6">
          <h3 className="text-lg font-extrabold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs text-slate-500 font-medium">
            أضف روابط صفحات المنصات التابعة على منصات التواصل
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-right">
            ✓ تم حفظ التغييرات بنجاح
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {socialFields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-bold text-slate-700 text-right mb-2">
                  {field.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    dir="ltr"
                    value={links[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-left font-medium"
                  />
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${field.colorClass}`}
                  >
                    {field.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-start gap-3 pt-8 mt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>حفظ التغييرات</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
