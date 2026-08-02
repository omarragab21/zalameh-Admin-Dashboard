import React, { useEffect, useState } from 'react';
import type { Category, SubCategory, PaginationMeta } from '../types/category.types';

interface CategoryTableProps {
  categories: Category[];
  paginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onViewCategory: (category: Category) => void;
  onAddSubCategory: (parentCategory: Category) => void;
  onEditSubCategory: (parentCategory: Category, subCategory: SubCategory) => void;
  onDeleteSubCategory: (parentCategoryId: string, subCategoryId: string) => void;
  onViewSubCategory?: (parentCategory: Category, subCategory: SubCategory, index: number) => void;
  onReorderSubCategories?: (parentCatId: string, sourceIndex: number, targetIndex: number) => void;
  onExpandCategory?: (categoryId: string) => void | Promise<unknown>;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  paginationMeta,
  onPageChange,
  onEditCategory,
  onDeleteCategory,
  onViewCategory,
  onAddSubCategory,
  onEditSubCategory,
  onDeleteSubCategory,
  onViewSubCategory,
  onReorderSubCategories,
  onExpandCategory,
}) => {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);
  const [localPage, setLocalPage] = useState(1);
  const localPerPage = 15;

  // Drag and Drop state
  const [draggedSubIndex, setDraggedSubIndex] = useState<{ parentId: string; index: number } | null>(null);
  const [dragOverSubIndex, setDragOverSubIndex] = useState<{ parentId: string; index: number } | null>(null);

  // Reset local page to 1 whenever categories list reference or length changes
  useEffect(() => {
    setLocalPage(1);
  }, [categories.length, categories]);

  const toggleExpand = (id: string) => {
    const isExpanding = !expandedCategoryIds.includes(id);
    setExpandedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (isExpanding && onExpandCategory) {
      void Promise.resolve()
        .then(() => onExpandCategory(id))
        .catch((err) => {
          console.error('Unable to expand category', id, err);
        });
    }
  };

  // Pagination calculation (Supports both Server Pagination and Local Client Pagination)
  const isServerPaginated = Boolean(paginationMeta);
  const totalItems = paginationMeta ? paginationMeta.total : categories.length;
  const itemsPerPage = paginationMeta ? paginationMeta.perPage : localPerPage;
  const activePage = paginationMeta ? paginationMeta.currentPage : Math.min(localPage, Math.ceil(totalItems / itemsPerPage) || 1);
  const totalPages = paginationMeta ? paginationMeta.lastPage : Math.ceil(totalItems / itemsPerPage) || 1;

  const currentCategories = isServerPaginated
    ? categories
    : categories.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const displayFrom = paginationMeta
    ? (paginationMeta.from ?? (totalItems > 0 ? (activePage - 1) * itemsPerPage + 1 : 0))
    : (totalItems === 0 ? 0 : (activePage - 1) * itemsPerPage + 1);

  const displayTo = paginationMeta
    ? (paginationMeta.to ?? Math.min(activePage * itemsPerPage, totalItems))
    : Math.min(activePage * itemsPerPage, totalItems);

  const handlePageSelect = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  };

  // Helper for generating page numbers with ellipsis if totalPages is large
  const getPageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const handleDragStart = (parentId: string, index: number) => {
    setDraggedSubIndex({ parentId, index });
  };

  const handleDragOver = (e: React.DragEvent, parentId: string, index: number) => {
    e.preventDefault();
    if (draggedSubIndex && draggedSubIndex.parentId === parentId && draggedSubIndex.index !== index) {
      setDragOverSubIndex({ parentId, index });
    }
  };

  const handleDrop = (parentId: string, targetIndex: number) => {
    if (draggedSubIndex && draggedSubIndex.parentId === parentId && onReorderSubCategories) {
      onReorderSubCategories(parentId, draggedSubIndex.index, targetIndex);
    }
    setDraggedSubIndex(null);
    setDragOverSubIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedSubIndex(null);
    setDragOverSubIndex(null);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm border-collapse" dir="rtl">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/50 text-slate-500 font-bold text-xs">
              <th className="py-4 px-3 w-12 text-center"></th>
              <th className="py-4 px-4 text-slate-600">الصورة</th>
              <th className="py-4 px-4 text-slate-600">الاسم بالعربية</th>
              <th className="py-4 px-4 text-slate-600">الاسم بالإنجليزية</th>
              <th className="py-4 px-4 text-slate-600 text-center">الفئات الفرعية</th>
              <th className="py-4 px-4 text-slate-600 text-center">الحالة</th>
              <th className="py-4 px-4 text-slate-600 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentCategories.length > 0 ? (
              currentCategories.map((cat) => {
                const isExpanded = expandedCategoryIds.includes(cat.id);
                const subList = cat.subcategories || [];
                const actualSubCount = cat.subcategoriesCount ?? 0;

                return (
                  <React.Fragment key={cat.id}>
                    {/* Main Parent Category Row */}
                    <tr
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isExpanded ? 'bg-slate-50/40' : ''
                      }`}
                    >
                      {/* Expand / Collapse Button (Far Right in RTL) */}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => toggleExpand(cat.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                          title={isExpanded ? 'طي الفئات الفرعية' : 'عرض الفئات الفرعية'}
                        >
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90 text-slate-700' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-4 px-4">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.nameAr}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 font-extrabold text-sm shadow-xs">
                            {cat.nameAr ? cat.nameAr.charAt(0) : 'ف'}
                          </div>
                        )}
                      </td>

                      {/* Name in Arabic */}
                      <td className="py-4 px-4 font-extrabold text-slate-900">
                        {cat.nameAr}
                      </td>

                      {/* Name in English */}
                      <td className="py-4 px-4 text-slate-500 font-semibold" dir="ltr">
                        {cat.nameEn || '-'}
                      </td>

                      {/* Subcategories Badge */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-600 font-extrabold text-xs border border-sky-100 shadow-2xs">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 4H5m14 4H5M19 7H5" />
                          </svg>
                          <span>{actualSubCount}</span>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            cat.status === 'active'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                              : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cat.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {cat.status === 'active' ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Plus: Add Subcategory */}
                          <button
                            onClick={() => onAddSubCategory(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                            title="إضافة فئة فرعية"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>

                          {/* Eye: View Details */}
                          <button
                            onClick={() => onViewCategory(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                            title="معاينة التفاصيل"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Edit Pencil */}
                          <button
                            onClick={() => onEditCategory(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                            title="تعديل الفئة"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          {/* Delete Trash */}
                          <button
                            onClick={() => onDeleteCategory(cat.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="حذف الفئة"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Subcategories Expanded Rows */}
                    {isExpanded &&
                      subList.length > 0 &&
                      subList.map((sub, idx) => {
                        const isDragOver =
                          dragOverSubIndex?.parentId === cat.id && dragOverSubIndex?.index === idx;

                        return (
                          <tr
                            key={sub.id}
                            draggable
                            onDragStart={() => handleDragStart(cat.id, idx)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, cat.id, idx)}
                            onDrop={() => handleDrop(cat.id, idx)}
                            className={`transition-colors border-b border-slate-100/60 ${
                              isDragOver
                                ? 'bg-red-50/80 border-2 border-dashed border-[#d83f2a]'
                                : 'bg-slate-50/50 hover:bg-slate-100/60'
                            }`}
                          >
                            {/* Column 1: Far Right Drag Grip Icon ONLY */}
                            <td className="py-3.5 px-3 text-center select-none">
                              <div className="flex items-center justify-center">
                                <span
                                  className="text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing p-1.5 rounded hover:bg-slate-200/60 transition"
                                  title="اسحب الفئة الفرعية لإعادة الترتيب"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm12-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                                  </svg>
                                </span>
                              </div>
                            </td>

                            {/* Column 2: Subcategory Image Thumbnail */}
                            <td className="py-3.5 px-4">
                              {sub.image ? (
                                <img
                                  src={sub.image}
                                  alt={sub.nameAr}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs mr-2"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : null}
                            </td>

                            {/* Column 3: Aligned Arabic Subcategory Name */}
                            <td className="py-3.5 px-4 font-extrabold text-slate-900 text-xs tracking-tight">
                              {sub.nameAr}
                            </td>

                            {/* Column 4: Aligned English Subcategory Name */}
                            <td className="py-3.5 px-4 font-semibold text-slate-500 text-xs" dir="ltr">
                              {sub.nameEn || '-'}
                            </td>

                            {/* Column 5: Subcategories count spacer */}
                            <td className="py-3.5 px-4 text-center text-slate-300 text-xs">
                              -
                            </td>

                            {/* Column 6: Status Badge */}
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  sub.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    sub.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                                  }`}
                                />
                                {sub.status === 'active' ? 'نشط' : 'غير نشط'}
                              </span>
                            </td>

                            {/* Column 7: Action Buttons */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => (onViewSubCategory ? onViewSubCategory(cat, sub, idx) : onViewCategory(cat))}
                                  className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                                  title="معاينة الفئة الفرعية"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => onEditSubCategory(cat, sub)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                                  title="تعديل الفئة الفرعية"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => onDeleteSubCategory(cat.id, sub.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                  title="حذف الفئة الفرعية"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 4H5m14 4H5M19 7H5" />
                      </svg>
                    </div>
                    <p className="text-base font-extrabold text-slate-800">لا يوجد أي فئة رئيسية</p>
                    <p className="text-xs text-slate-400 font-semibold max-w-sm">
                      لم يتم إضافة أي فئات رئيسية حتى الآن. يمكنك إضافة فئة جديدة بالضغط على زر إضافة فئة رئيسية.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold" dir="rtl">
        <div>
          عرض {displayFrom}-{displayTo} من أصل {totalItems} فئة رئيسية
        </div>

        <div className="flex items-center gap-1.5" dir="rtl">
          <button
            onClick={() => handlePageSelect(Math.max(1, activePage - 1))}
            disabled={activePage <= 1}
            title="الصفحة السابقة"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {getPageNumbers(activePage, totalPages).map((pageNum, idx) => {
            if (typeof pageNum === 'string') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 font-bold select-none">
                  ...
                </span>
              );
            }

            const isActive = pageNum === activePage;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageSelect(pageNum)}
                className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center transition cursor-pointer ${
                  isActive
                    ? 'bg-[#d83f2a] text-white shadow-xs shadow-[#d83f2a]/30'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageSelect(Math.min(totalPages, activePage + 1))}
            disabled={activePage >= totalPages}
            title="الصفحة التالية"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
