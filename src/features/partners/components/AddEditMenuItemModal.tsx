import React, { useState, useEffect } from 'react';
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
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [unitType, setUnitType] = useState<MenuItemUnitType>('count');
  const [status, setStatus] = useState<MenuItemStatus>('available');
  const [publishingScope, setPublishingScope] = useState<PublishingScope>('all_branches');
  const [branchId, setBranchId] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setNameAr(editingItem.nameAr || '');
      setCategory(editingItem.category || '');
      setPrice(editingItem.price ?? '');
      setImageUrl(editingItem.imageUrl || '');
      setUnitType(editingItem.unitType || 'count');
      setStatus(editingItem.status || 'available');
      setPublishingScope(editingItem.publishingScope || 'all_branches');
      setBranchId(editingItem.branchId || '');
    } else {
      setNameAr('');
      setCategory('');
      setPrice('');
      setImageUrl('');
      setUnitType('count');
      setStatus('available');
      setPublishingScope('all_branches');
      setBranchId('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    onSave({
      nameAr,
      category: category || 'توصيل',
      price: Number(price) || 0,
      imageUrl,
      unitType,
      status,
      publishingScope,
      branchId: publishingScope === 'specific_branch' ? branchId : undefined,
    });
    onClose();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 space-y-0">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
          <h3 className="text-lg font-black text-slate-900">
            {editingItem ? 'تعديل عنصر في القائمة' : 'إضافة عنصر للقائمة'}
          </h3>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اسم العنصر <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="اسم العنصر أو الخدمة"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          {/* Grid 2 Columns: Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الفئة
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="مثل: توصيل"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                السعر
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="25 د.أ"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Unit Type (كمية / عدد) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              نوع العنصر (كمية أو عدد)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setUnitType('count')}
                className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                  unitType === 'count'
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-700 font-extrabold'
                    : 'border-slate-200 text-slate-600 font-bold hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">عدد (قطعة / ملحق)</span>
              </div>

              <div
                onClick={() => setUnitType('quantity')}
                className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                  unitType === 'quantity'
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-700 font-extrabold'
                    : 'border-slate-200 text-slate-600 font-bold hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">كمية (وزن / وجبة)</span>
              </div>
            </div>
          </div>

          {/* Item Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              صورة العنصر
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition">
                <span>اختر صورة</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="أو ضع رابط الصورة هنا..."
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
              />
            </div>
            {imageUrl && (
              <div className="mt-2 w-16 h-16 rounded-xl border border-slate-200 overflow-hidden">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Publishing Scope (نطاق النشر) - Matches Screenshot 1 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              نطاق النشر
            </label>
            <div className="flex items-center justify-center gap-3">
              {/* All Branches Option */}
              <div
                onClick={() => setPublishingScope('all_branches')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition select-none ${
                  publishingScope === 'all_branches'
                    ? 'border-2 border-red-500 text-red-600 bg-red-50/40 font-extrabold'
                    : 'border border-slate-200 text-slate-600 bg-white font-bold hover:bg-slate-50'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  publishingScope === 'all_branches' ? 'border-red-500 bg-red-500' : 'border-slate-300'
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
                    ? 'border-2 border-red-500 text-red-600 bg-red-50/40 font-extrabold'
                    : 'border border-slate-200 text-slate-600 bg-white font-bold hover:bg-slate-50'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  publishingScope === 'specific_branch' ? 'border-red-500 bg-red-500' : 'border-slate-300'
                }`}>
                  {publishingScope === 'specific_branch' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs">فرع محدد</span>
              </div>
            </div>

            {/* Branch Selector dropdown when specific branch is chosen */}
            {publishingScope === 'specific_branch' && branches.length > 0 && (
              <div className="mt-3">
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="">-- اختر الفرع --</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons - Matches Screenshot 1 */}
          <div className="flex items-center justify-start gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer"
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
  );
};
