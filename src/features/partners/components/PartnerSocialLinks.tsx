import React, { useState } from 'react';
import type { SocialLinks } from '../types/partner.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import {
  faTiktok,
  faInstagram,
  faFacebook,
  faXTwitter,
  faYoutube,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

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
  whatsapp: '',
};

const socialFields: { key: keyof SocialLinks; label: string; placeholder: string; icon: React.ReactNode; colorClass: string }[] = [
  {
    key: 'website',
    label: 'الموقع الإلكتروني',
    placeholder: 'https://example.com',
    colorClass: 'bg-emerald-600 text-white shadow-xs',
    icon: <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />,
  },
  {
    key: 'facebook',
    label: 'فيسبوك',
    placeholder: 'https://facebook.com/...',
    colorClass: 'bg-[#1877F2] text-white shadow-xs',
    icon: <FontAwesomeIcon icon={faFacebook} className="w-5 h-5 text-lg" />,
  },
  {
    key: 'instagram',
    label: 'إنستغرام',
    placeholder: 'https://instagram.com/...',
    colorClass: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-xs',
    icon: <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 text-lg" />,
  },
  {
    key: 'tiktok',
    label: 'تيك توك',
    placeholder: 'https://tiktok.com/@...',
    colorClass: 'bg-slate-900 text-white shadow-xs',
    icon: <FontAwesomeIcon icon={faTiktok} className="w-5 h-5 text-lg" />,
  },
  {
    key: 'snapchat',
    label: 'سناب شات',
    placeholder: 'https://snapchat.com/add/...',
    colorClass: 'bg-[#FFFC00] text-white shadow-xs',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.042 2.875c-3.056 0-5.583 2.453-5.583 5.583 0 .509.07 1.018.204 1.51-.52.276-.882.809-1.011 1.465-.128.643.011 1.289.387 1.806.212.296.489.532.805.689-.133.401-.318.781-.553 1.129-.437.654-1.008 1.186-1.696 1.577-.465.266-.72.763-.637 1.289.083.527.479.933.997 1.025 1.123.199 2.271.187 3.398-.032.536-.104 1.079-.158 1.621-.158.542 0 1.085.054 1.621.158 1.127.219 2.275.231 3.398.032.518-.092.914-.498.997-1.025.083-.526-.172-1.023-.637-1.289-.688-.391-1.259-.923-1.696-1.577-.235-.348-.42-.728-.553-1.129.316-.157.593-.393.805-.689.376-.517.505-1.163.387-1.806-.129-.656-.491-1.189-1.011-1.465.134-.492.204-1.001.204-1.51 0-3.13-2.527-5.583-5.583-5.583z" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    label: 'واتساب',
    placeholder: '+96279XXXXXXXX',
    colorClass: 'bg-[#25D366] text-white shadow-xs',
    icon: <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 text-lg" />,
  },
  {
    key: 'twitter',
    label: 'X (تويتر)',
    placeholder: 'https://x.com/...',
    colorClass: 'bg-slate-900 text-white shadow-xs',
    icon: <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5 text-lg" />,
  },
  {
    key: 'youtube',
    label: 'يوتيوب',
    placeholder: 'https://youtube.com/@...',
    colorClass: 'bg-[#FF0000] text-white shadow-xs',
    icon: <FontAwesomeIcon icon={faYoutube} className="w-5 h-5 text-lg" />,
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
                {/* Icon on the RIGHT, Input on the LEFT in RTL */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${field.colorClass}`}
                  >
                    {field.icon}
                  </div>
                  <input
                    type="url"
                    dir="ltr"
                    value={links[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d83f2a] focus:ring-1 focus:ring-[#d83f2a] text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all outline-none text-left font-medium"
                  />
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
