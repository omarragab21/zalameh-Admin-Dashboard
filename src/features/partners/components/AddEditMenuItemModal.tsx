import React, { useState, useEffect, useRef } from 'react';
import type { MenuItem, MenuItemUnitType, MenuItemStatus, PublishingScope, Branch } from '../types/partner.types';

interface AddEditMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<MenuItem>) => void;
  editingItem?: MenuItem | null;
  branches?: Branch[];
}

export const AddEditMenuItemModal: React.FC<AddEditMenuItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  branches = [],
}) => {
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar');

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('');
  const [categoryEn, setCategoryEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  const [price, setPrice] = useState<number | string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [unitType, setUnitType] = useState<MenuItemUnitType>('count');
  const [status, setStatus] = useState<MenuItemStatus>('available');
  const [publishingScope, setPublishingScope] = useState<PublishingScope>('all_branches');
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);

  // Image Crop & Resize Modal State (Declared unconditionally at top of component for React Rules of Hooks)
  const [cropRawSrc, setCropRawSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropOffset, setCropOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (editingItem) {
      setNameAr(editingItem.nameAr || '');
      setNameEn(editingItem.nameEn || '');
      setCategory(editingItem.category || '');
      setCategoryEn(editingItem.categoryEn || '');
      setDescriptionAr(editingItem.descriptionAr || '');
      setDescriptionEn(editingItem.descriptionEn || '');

      setPrice(editingItem.price ?? '');
      setImageUrl(editingItem.imageUrl || '');
      setUnitType(editingItem.unitType || 'count');
      setStatus(editingItem.status || 'available');
      setPublishingScope(editingItem.publishingScope || 'all_branches');
      if (editingItem.branchIds && editingItem.branchIds.length > 0) {
        setSelectedBranchIds(editingItem.branchIds);
      } else if (editingItem.branchId) {
        setSelectedBranchIds([editingItem.branchId]);
      } else {
        setSelectedBranchIds([]);
      }
    } else {
      setNameAr('');
      setNameEn('');
      setCategory('');
      setCategoryEn('');
      setDescriptionAr('');
      setDescriptionEn('');

      setPrice('');
      setImageUrl('');
      setUnitType('count');
      setStatus('available');
      setPublishingScope('all_branches');
      setSelectedBranchIds([]);
    }
    setActiveLang('ar');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleToggleBranch = (id: string) => {
    setSelectedBranchIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!nameAr.trim()) return;

    onSave({
      nameAr,
      nameEn: nameEn || undefined,
      category: category || 'توصيل',
      categoryEn: categoryEn || undefined,
      descriptionAr: descriptionAr || undefined,
      descriptionEn: descriptionEn || undefined,
      price: Number(price) || 0,
      imageUrl,
      unitType,
      status,
      publishingScope,
      branchIds: publishingScope === 'specific_branch' ? selectedBranchIds : undefined,
      branchId: publishingScope === 'specific_branch' ? selectedBranchIds[0] || undefined : undefined,
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
                <span>قص وضبط صورة العنصر (512x512)</span>
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

      {/* 2. Main Add/Edit Menu Item Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
        <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 space-y-0">
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-black text-slate-900">
              {editingItem ? 'تعديل عنصر في القائمة' : 'إضافة عنصر للقائمة'}
            </h3>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center justify-start px-6 gap-8 border-b border-slate-100 text-xs font-bold pt-3 pb-0">
            <button
              type="button"
              onClick={() => setActiveLang('ar')}
              className={`pb-2.5 px-2 relative transition cursor-pointer ${
                activeLang === 'ar' ? 'text-[#d83f2a]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              العربية
              {activeLang === 'ar' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d83f2a] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`pb-2.5 px-2 relative transition cursor-pointer ${
                activeLang === 'en' ? 'text-[#d83f2a]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              English
              {activeLang === 'en' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d83f2a] rounded-full" />
              )}
            </button>
          </div>

          {/* Modal Body / Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Tab 1: Arabic */}
            {activeLang === 'ar' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اسم العنصر بالعربية <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="اسم العنصر أو الخدمة بالعربية"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الفئة بالعربية
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="مثل: توصيل / وجبات رئيسية"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الوصف بالعربية
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="وصف مختصر للعنصر ومكوناته بالعربية..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition resize-none"
                  />
                </div>

                {/* Price (Arabic) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    السعر
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25 د.أ"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
                  />
                </div>

                {/* Unit Type (Arabic) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    نوع العنصر (كمية أو عدد)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setUnitType('count')}
                      className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                        unitType === 'count'
                          ? 'border-[#d83f2a] bg-rose-50/40 text-[#d83f2a] font-extrabold'
                          : 'border-slate-200 text-slate-600 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">عدد (قطعة / ملحق)</span>
                    </div>

                    <div
                      onClick={() => setUnitType('quantity')}
                      className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                        unitType === 'quantity'
                          ? 'border-[#d83f2a] bg-rose-50/40 text-[#d83f2a] font-extrabold'
                          : 'border-slate-200 text-slate-600 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">كمية (وزن / وجبة)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: English */}
            {activeLang === 'en' && (
              <div className="space-y-4" dir="ltr">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">
                    Item Name (English)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Item name in English"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">
                    Category (English)
                  </label>
                  <input
                    type="text"
                    value={categoryEn}
                    onChange={(e) => setCategoryEn(e.target.value)}
                    placeholder="e.g. Delivery / Main Course"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Brief item description in English..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition resize-none"
                  />
                </div>

                {/* Price (English) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-left">
                    Price
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25 JOD"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d83f2a]/20 focus:border-[#d83f2a] transition"
                  />
                </div>

                {/* Unit Type (English) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 text-left">
                    Item Type (Quantity or Count)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setUnitType('count')}
                      className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                        unitType === 'count'
                          ? 'border-[#d83f2a] bg-rose-50/40 text-[#d83f2a] font-extrabold'
                          : 'border-slate-200 text-slate-600 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">Count (Piece / Item)</span>
                    </div>

                    <div
                      onClick={() => setUnitType('quantity')}
                      className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                        unitType === 'quantity'
                          ? 'border-[#d83f2a] bg-rose-50/40 text-[#d83f2a] font-extrabold'
                          : 'border-slate-200 text-slate-600 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">Quantity (Weight / Portion)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Common Fields Section */}
            <div className="pt-3 border-t border-slate-100 space-y-4">

              {/* Item Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  صورة العنصر (رفع وقص 512x512 أو رابط)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="cursor-pointer px-4 py-2 bg-[#d83f2a] hover:bg-[#c23420] text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
                  >
                    ✂️ رفع وقص صورة
                  </button>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="أو ضع رابط الصورة هنا..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                  />
                </div>
                {imageUrl && (
                  <div className="mt-2.5 w-20 h-20 rounded-2xl border border-slate-200 overflow-hidden relative group shadow-2xs">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-extrabold transition"
                    >
                      تغيير / قص
                    </button>
                  </div>
                )}
              </div>

            {/* Status Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">الحالة</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('available')}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    status === 'available'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>متاح</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('unavailable')}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    status === 'unavailable'
                      ? 'bg-slate-100 text-slate-600 border-slate-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>غير متاح</span>
                </button>
              </div>
            </div>

            {/* Publishing Scope (نطاق النشر) - Right Aligned (justify-start) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                نطاق النشر
              </label>
              <div className="flex items-center justify-start gap-3">
                {/* All Branches Option */}
                <div
                  onClick={() => setPublishingScope('all_branches')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition select-none ${
                    publishingScope === 'all_branches'
                      ? 'border-2 border-[#d83f2a] text-[#d83f2a] bg-rose-50/40 font-extrabold'
                      : 'border border-slate-200 text-slate-600 bg-white font-bold hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    publishingScope === 'all_branches' ? 'border-[#d83f2a] bg-[#d83f2a]' : 'border-slate-300'
                  }`}>
                    {publishingScope === 'all_branches' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs">جميع الفروع</span>
                </div>

                {/* Specific Branch Option */}
                <div
                  onClick={() => setPublishingScope('specific_branch')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition select-none ${
                    publishingScope === 'specific_branch'
                      ? 'border-2 border-[#d83f2a] text-[#d83f2a] bg-rose-50/40 font-extrabold'
                      : 'border border-slate-200 text-slate-600 bg-white font-bold hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    publishingScope === 'specific_branch' ? 'border-[#d83f2a] bg-[#d83f2a]' : 'border-slate-300'
                  }`}>
                    {publishingScope === 'specific_branch' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs">فرع محدد</span>
                </div>
              </div>

              {/* Branch Checkboxes when specific branch is chosen */}
              {publishingScope === 'specific_branch' && (
                <div className="mt-3 bg-slate-50/70 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">
                    اختر الفروع المستهدفة
                  </span>
                  {branches.length === 0 ? (
                    <p className="text-xs font-bold text-slate-400">لا توجد فروع مسجلة</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {branches.map((b) => {
                        const isChecked = selectedBranchIds.includes(b.id);
                        return (
                          <label
                            key={b.id}
                            className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer hover:text-slate-900 select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleBranch(b.id)}
                              className="w-4 h-4 rounded text-[#d83f2a] focus:ring-[#d83f2a]/20 accent-[#d83f2a] cursor-pointer"
                            />
                            <span>{b.nameAr}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-start gap-3 pt-4 border-t border-slate-100">
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
