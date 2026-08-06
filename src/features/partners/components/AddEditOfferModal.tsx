import React, { useState, useEffect, useRef } from 'react';
import type { Branch, Offer, OfferStatus, OfferContactMethod } from '../types/partner.types';

interface AddEditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offerData: Partial<Offer>) => void;
  brandName: string;
  editingOffer?: Offer | null;
  branches?: Branch[];
}

const OFFER_CONTACT_METHODS: {
  id: OfferContactMethod;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'phone',
    label: 'اتصال هاتفي',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'واتساب',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.634-1.156 4.22 4.316-1.131.584.344z"/>
      </svg>
    ),
  },
  {
    id: 'map',
    label: 'موقع / خريطة',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export const AddEditOfferModal: React.FC<AddEditOfferModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingOffer,
  branches = [],
}) => {
  const [langTab, setLangTab] = useState<'ar' | 'en'>('ar');

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<OfferStatus>('active');
  const [publishScope, setPublishScope] = useState<'all' | 'specific'>('all');
  const [branchIds, setBranchIds] = useState<string[]>([]);

  // Contact Methods
  const [contactMethods, setContactMethods] = useState<OfferContactMethod[]>(['phone']);
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactMapUrl, setContactMapUrl] = useState('');

  // Image Crop & Resize Modal State (Must be declared before early return for React Rules of Hooks)
  const [cropRawSrc, setCropRawSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropOffset, setCropOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (editingOffer) {
      setTitleAr(editingOffer.titleAr || '');
      setTitleEn(editingOffer.titleEn || '');
      setDescriptionAr(editingOffer.descriptionAr || '');
      setDescriptionEn(editingOffer.descriptionEn || '');
      setImageUrl(editingOffer.imageUrl || '');
      setStatus(editingOffer.status || 'active');
      setBranchIds(editingOffer.branchIds || []);
      setPublishScope(editingOffer.branchIds && editingOffer.branchIds.length > 0 ? 'specific' : 'all');
      setContactMethods(editingOffer.contactMethods && editingOffer.contactMethods.length > 0 ? editingOffer.contactMethods : ['phone']);
      setContactPhone(editingOffer.contactDetails?.phone || '');
      setContactWhatsapp(editingOffer.contactDetails?.whatsapp || '');
      setContactMapUrl(editingOffer.contactDetails?.mapUrl || '');
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setImageUrl('');
      setStatus('active');
      setPublishScope('all');
      setBranchIds([]);
      setContactMethods(['phone']);
      setContactPhone('');
      setContactWhatsapp('');
      setContactMapUrl('');
    }
    setLangTab('ar');
  }, [editingOffer, isOpen]);

  if (!isOpen) return null;

  const handleToggleContactMethod = (method: OfferContactMethod) => {
    setContactMethods((prev) =>
      prev.includes(method)
        ? prev.length > 1
          ? prev.filter((m) => m !== method)
          : prev
        : [...prev, method]
    );
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCropRawSrc(reader.result);
        setCropZoom(1);
        setCropOffset({ x: 0, y: 0 });
        setIsCropOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyCrop = () => {
    if (!cropRawSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = cropRawSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetDimension = 512;
      canvas.width = targetDimension;
      canvas.height = targetDimension;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetDimension, targetDimension);

        const aspect = img.width / img.height;
        let drawW = targetDimension * cropZoom;
        let drawH = (targetDimension / aspect) * cropZoom;

        const drawX = (targetDimension - drawW) / 2 + cropOffset.x;
        const drawY = (targetDimension - drawH) / 2 + cropOffset.y;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImageUrl(croppedDataUrl);
      }
      setIsCropOpen(false);
      setCropRawSrc(null);
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() && !titleEn.trim()) return;

    onSave({
      titleAr: titleAr || titleEn,
      titleEn: titleEn || titleAr,
      descriptionAr,
      descriptionEn,
      imageUrl: imageUrl || undefined,
      status,
      branchIds: publishScope === 'specific' ? branchIds : [],
      publishingScope: publishScope === 'specific' ? 'specific_branch' : 'all_branches',
      contactMethods,
      contactDetails: {
        phone: contactMethods.includes('phone') ? contactPhone : undefined,
        whatsapp: contactMethods.includes('whatsapp') ? contactWhatsapp : undefined,
        mapUrl: contactMethods.includes('map') ? contactMapUrl : undefined,
      },
    });
    onClose();
  };

  return (
    <>
      {/* 1. Image Crop & Resize Modal */}
      {isCropOpen && cropRawSrc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-5 space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>✂️</span>
                <span>قص وضبط صورة العرض (512x512)</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsCropOpen(false);
                  setCropRawSrc(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Crop Canvas Preview Box */}
            <div className="relative w-64 h-64 mx-auto rounded-2xl border-2 border-dashed border-[#d83f2a] overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center">
              <img
                ref={cropImageRef}
                src={cropRawSrc}
                alt="Crop preview"
                style={{
                  transform: `scale(${cropZoom}) translate(${cropOffset.x / cropZoom}px, ${cropOffset.y / cropZoom}px)`,
                  transition: 'transform 0.05s ease-out',
                }}
                className="max-w-full max-h-full object-contain pointer-events-none"
              />
              <div className="absolute inset-0 border border-white/30 pointer-events-none rounded-2xl"></div>
            </div>

            {/* Controls: Zoom & Offset */}
            <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-right">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>التكبير والقص (Zoom)</span>
                  <span className="text-[#d83f2a]">{cropZoom.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#d83f2a] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                <button
                  type="button"
                  onClick={() => setCropOffset((prev) => ({ ...prev, y: prev.y - 15 }))}
                  className="py-1 px-2 bg-white rounded-lg border border-slate-200 font-bold hover:bg-slate-100"
                >
                  ⬆️ تحريك لأعلى
                </button>
                <button
                  type="button"
                  onClick={() => setCropOffset((prev) => ({ ...prev, y: prev.y + 15 }))}
                  className="py-1 px-2 bg-white rounded-lg border border-slate-200 font-bold hover:bg-slate-100"
                >
                  ⬇️ تحريك لأسفل
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c23420] text-white font-extrabold text-xs shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
              >
                اعتماد الصورة وملاءمة الحجم
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCropOpen(false);
                  setCropRawSrc(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Add/Edit Offer Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">العروض المرتبطة بهذا الشريك</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition cursor-pointer mt-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Language Tabs */}
          <div className="px-6 pt-3 flex items-center gap-5 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setLangTab('ar')}
              className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                langTab === 'ar' ? 'text-[#d83f2a] border-[#d83f2a]' : 'text-slate-500 border-transparent'
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setLangTab('en')}
              className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                langTab === 'en' ? 'text-[#d83f2a] border-[#d83f2a]' : 'text-slate-500 border-transparent'
              }`}
            >
              English
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Offer Image */}
            <div className="flex items-start gap-4">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                title="اختر صورة من جهازك وقصها"
                className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#d83f2a] hover:text-[#d83f2a] flex flex-col items-center justify-center text-slate-400 shrink-0 overflow-hidden gap-1 transition cursor-pointer relative group"
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Offer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-extrabold transition">
                      تعديل / قص
                    </div>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
                    </svg>
                    <span className="text-[10px] font-bold">قص الصورة</span>
                  </>
                )}
              </button>
              <div className="flex-1 space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">صورة العرض (رفع وقص 512x512 أو رابط)</label>
                <input
                  type="url"
                  dir="ltr"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium text-left focus:outline-none focus:border-[#d83f2a] transition"
                />
                <p className="text-[11px] text-slate-400">يمكنك رفع صورة وقصها أبعاد 512x512 أو إدخال رابط مباشر</p>
              </div>
            </div>

          {/* Title & Details */}
          {langTab === 'ar' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-[#d83f2a]">*</span> عنوان العرض
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="عنوان العرض بالعربية"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">تفاصيل العرض</label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="اكتب تفاصيل العرض بالعربية..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-[#d83f2a]">*</span> Offer Title
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Offer title in English"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-[#d83f2a] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Offer Details</label>
                <textarea
                  rows={3}
                  dir="ltr"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Write the offer details in English..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium text-left focus:outline-none focus:border-[#d83f2a] transition resize-none"
                />
              </div>
            </>
          )}

          {/* Contact Methods Section */}
          <div className="pt-3 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400">معلومات التواصل المتاحة للعملاء</h4>

            {/* Contact Method Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">طرق التواصل في العرض</label>
              <div className="flex flex-wrap items-center gap-2">
                {OFFER_CONTACT_METHODS.map((method) => {
                  const isSelected = contactMethods.includes(method.id);
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleToggleContactMethod(method.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'border border-[#d83f2a] bg-rose-50/70 text-[#d83f2a] shadow-xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="shrink-0">{method.icon}</span>
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Contact Sub-fields */}
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-500 block">
                تفاصيل التواصل للعميل
              </span>

              {/* Conditional Phone */}
              {contactMethods.includes('phone') && (
                <div className="animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <span>📞</span>
                    <span>رقم الاتصال المباشر</span>
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="أدخل رقم الهاتف للتواصل..."
                    dir="ltr"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition text-left"
                  />
                </div>
              )}

              {/* Conditional WhatsApp */}
              {contactMethods.includes('whatsapp') && (
                <div className="animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <span>💬</span>
                    <span>رقم الواتساب</span>
                  </label>
                  <input
                    type="text"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="أدخل رقم الواتساب للعرض..."
                    dir="ltr"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition text-left"
                  />
                </div>
              )}

              {/* Conditional Map URL */}
              {contactMethods.includes('map') && (
                <div className="animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <span>🗺️</span>
                    <span>رابط الخريطة / الموقع الجغرافي</span>
                  </label>
                  <input
                    type="url"
                    value={contactMapUrl}
                    onChange={(e) => setContactMapUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    dir="ltr"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#d83f2a] transition text-left"
                  />
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">الحالة</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    status === 'active'
                      ? 'bg-emerald-50 border-emerald-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  نشط
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('disabled')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    status === 'disabled'
                      ? 'bg-slate-100 border-slate-400 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status === 'disabled' ? 'bg-slate-500' : 'bg-slate-300'}`}></span>
                  غير نشط
                </button>
              </div>
            </div>

            {/* Publish Scope - Right Aligned (justify-start) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">نطاق النشر</label>
              <div className="flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPublishScope('all');
                    setBranchIds([]);
                  }}
                  className={`py-2 px-4 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    publishScope === 'all'
                      ? 'bg-red-50 border-red-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      publishScope === 'all' ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    {publishScope === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                  </span>
                  جميع الفروع
                </button>
                <button
                  type="button"
                  onClick={() => setPublishScope('specific')}
                  className={`py-2 px-4 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                    publishScope === 'specific'
                      ? 'bg-red-50 border-red-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      publishScope === 'specific' ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    {publishScope === 'specific' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                  </span>
                  فرع محدد
                </button>
              </div>

              {publishScope === 'specific' && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-bold text-slate-700 mb-2">اختر الفروع المستهدفة</p>
                  {branches.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-3 font-medium">
                      لا توجد فروع متاحة لهذه العلامة التجارية — أضف فروعاً من تبويب الفروع أولاً
                    </p>
                  ) : (
                    <div className="space-y-0.5">
                      {branches.map((branch) => (
                        <label
                          key={branch.id}
                          className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                        >
                          <span className="text-xs font-bold text-slate-700">{branch.nameAr}</span>
                          <input
                            type="checkbox"
                            checked={branchIds.includes(branch.id)}
                            onChange={() =>
                              setBranchIds((prev) =>
                                prev.includes(branch.id)
                                  ? prev.filter((id) => id !== branch.id)
                                  : [...prev, branch.id]
                              )
                            }
                            className="w-4 h-4 accent-red-600 cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-start gap-3">
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-[#d83f2a] hover:bg-[#c23420] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer"
            >
              حفظ
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};
