import React, { useState, useEffect, useRef } from 'react';
import type { Category, SubCategory, CategoryFilterStatus } from '../types/category.types';
import { useCategories } from '../presentation/hooks/useCategories';
import { CategoryStatsHeader } from '../components/CategoryStatsHeader';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { CategoryTable } from '../components/CategoryTable';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { AddSubCategoryModal } from '../components/AddSubCategoryModal';
import { CategoryDetailModal } from '../components/CategoryDetailModal';
import { SubCategoryDetailModal } from '../components/SubCategoryDetailModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

export const CategoriesPage: React.FC = () => {
  const {
    categories,
    filteredCategories,
    loading,
    error,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    setPage,
    paginationMeta,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    reorderSubCategories,
    fetchSubCategories,
    isSubCategoriesLoaded,
    refresh,
  } = useCategories();

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [parentCategoryForSub, setParentCategoryForSub] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [isViewingCategoryLoading, setIsViewingCategoryLoading] = useState(false);
  const [viewingCategoryLoadError, setViewingCategoryLoadError] = useState<string | null>(null);
  const viewCategoryRequestVersion = useRef(0);
  const [viewingSubCategory, setViewingSubCategory] = useState<{
    parent: Category;
    sub: SubCategory;
    index: number;
  } | null>(null);

  // Delete Confirm Modal State
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState<{
    parentCatId: string;
    sub: SubCategory;
  } | null>(null);

  // Submitting state for async operations & Toast Notification State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
  };

  // Add / Edit Main Category Handler
  const handleSaveCategory = async (categoryData: Partial<Category> & { imageFile?: File }) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, {
          nameAr: categoryData.nameAr,
          nameEn: categoryData.nameEn,
          descriptionAr: categoryData.descriptionAr,
          descriptionEn: categoryData.descriptionEn,
          status: categoryData.status,
          image: categoryData.imageFile || categoryData.image,
        });
        showToast('تم حفظ تعديلات الفئة بنجاح');
      } else {
        // Add new main category
        await addCategory({
          nameAr: categoryData.nameAr || 'فئة جديدة',
          nameEn: categoryData.nameEn || 'New Category',
          descriptionAr: categoryData.descriptionAr,
          descriptionEn: categoryData.descriptionEn,
          status: categoryData.status || 'active',
          image: categoryData.imageFile || categoryData.image,
        });
        showToast('تم إضافة الفئة الرئيسية بنجاح');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      showToast(err.message || 'حدث خطأ أثناء حفظ الفئة', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Delete Main Category Modal
  const handleRequestDeleteCategory = (categoryId: string) => {
    const target = categories.find((c) => c.id === categoryId);
    if (target) {
      setDeletingCategory(target);
    }
  };

  // Confirm Delete Main Category
  const handleConfirmDeleteCategory = async () => {
    if (deletingCategory) {
      setIsSubmitting(true);
      try {
        await deleteCategory(deletingCategory.id);
        showToast('تم حذف الفئة الرئيسية بنجاح');
        setDeletingCategory(null);
      } catch (err: any) {
        showToast(err.message || 'حدث خطأ أثناء حذف الفئة', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Open SubCategory Modal (Add)
  const handleOpenAddSubCategory = (parent: Category) => {
    setParentCategoryForSub(parent);
    setEditingSubCategory(null);
    setIsSubCategoryModalOpen(true);
  };

  // Open SubCategory Modal (Edit)
  const handleOpenEditSubCategory = (parent: Category, sub: SubCategory) => {
    setParentCategoryForSub(parent);
    setEditingSubCategory(sub);
    setIsSubCategoryModalOpen(true);
  };

  // Save SubCategory Handler
  const handleSaveSubCategory = async (subData: Partial<SubCategory>) => {
    if (!parentCategoryForSub) return;
    setIsSubmitting(true);
    try {
      if (editingSubCategory) {
        // Edit existing subcategory
        await updateSubCategory(parentCategoryForSub.id, editingSubCategory.id, {
          nameAr: subData.nameAr,
          nameEn: subData.nameEn,
          descriptionAr: subData.descriptionAr,
          descriptionEn: subData.descriptionEn,
          status: subData.status,
        });
        showToast('تم حفظ تعديلات الفئة الفرعية بنجاح');
      } else {
        // Add new subcategory
        await addSubCategory(parentCategoryForSub.id, {
          parentId: parentCategoryForSub.id,
          nameAr: subData.nameAr || 'فئة فرعية جديدة',
          nameEn: subData.nameEn || 'New Subcategory',
          descriptionAr: subData.descriptionAr,
          descriptionEn: subData.descriptionEn,
          status: subData.status || 'active',
        });
        showToast('تم إضافة الفئة الفرعية بنجاح');
      }
      setIsSubCategoryModalOpen(false);
      setEditingSubCategory(null);
    } catch (err: any) {
      showToast(err.message || 'حدث خطأ أثناء حفظ الفئة الفرعية', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Delete SubCategory Modal
  const handleRequestDeleteSubCategory = (parentCatId: string, subId: string) => {
    const parent = categories.find((c) => c.id === parentCatId);
    const sub = parent?.subcategories?.find((s) => s.id === subId);
    if (parent && sub) {
      setDeletingSubCategory({ parentCatId, sub });
    }
  };

  // Confirm Delete SubCategory
  const handleConfirmDeleteSubCategory = async () => {
    if (deletingSubCategory) {
      const { parentCatId, sub } = deletingSubCategory;
      setIsSubmitting(true);
      try {
        await deleteSubCategory(parentCatId, sub.id);
        showToast('تم حذف الفئة الفرعية بنجاح');
        setDeletingSubCategory(null);
      } catch (err: any) {
        showToast(err.message || 'حدث خطأ أثناء حذف الفئة الفرعية', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Reorder SubCategories Handler (Swap / Drag & Drop)
  const handleReorderSubCategories = async (parentCatId: string, sourceIndex: number, targetIndex: number) => {
    try {
      await reorderSubCategories(parentCatId, sourceIndex, targetIndex);
    } catch (err: any) {
      console.error('Reorder error:', err);
    }
  };

  const handleViewCategory = async (category: Category) => {
    const requestVersion = viewCategoryRequestVersion.current + 1;
    viewCategoryRequestVersion.current = requestVersion;
    setViewingCategory(category);
    setViewingCategoryLoadError(null);

    if (
      isSubCategoriesLoaded(category.id) &&
      category.subcategories.length >= category.subcategoriesCount
    ) {
      setIsViewingCategoryLoading(false);
      return;
    }

    setIsViewingCategoryLoading(true);
    try {
      const subcategories = await fetchSubCategories(category.id);
      if (viewCategoryRequestVersion.current !== requestVersion) return;
      setViewingCategory((current) =>
        current?.id === category.id
          ? {
              ...current,
              subcategories,
              subcategoriesCount: subcategories.length,
            }
          : current
      );
    } catch (err: any) {
      if (viewCategoryRequestVersion.current === requestVersion) {
        setViewingCategoryLoadError(
          err?.message || 'تعذر تحميل الفئات الفرعية حالياً.'
        );
      }
    } finally {
      if (viewCategoryRequestVersion.current === requestVersion) {
        setIsViewingCategoryLoading(false);
      }
    }
  };

  const handleCloseCategoryDetails = () => {
    viewCategoryRequestVersion.current += 1;
    setIsViewingCategoryLoading(false);
    setViewingCategoryLoadError(null);
    setViewingCategory(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative" dir="rtl">
      {/* Toast Pop-up Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md transition-all ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100'
                : 'bg-red-900/90 border-red-700 text-red-100'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm font-bold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center justify-between">
          <span className="text-sm font-semibold">{error}</span>
          <button
            onClick={refresh}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* 1. Header Stats (3 Cards: Total, Active, Inactive) */}
      <CategoryStatsHeader
        totalCount={stats.totalCount}
        activeCount={stats.activeCount}
        inactiveCount={stats.inactiveCount}
      />

      {/* 2. Unified Container: Filter Bar + Category Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Top Header Filter Bar inside the card block */}
        <CategoryFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={(st: CategoryFilterStatus) => setStatusFilter(st)}
          onAddCategoryClick={() => {
            setEditingCategory(null);
            setIsCategoryModalOpen(true);
          }}
        />

        {/* Loading Spinner / Main Category Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d83f2a] border-t-transparent mb-3"></div>
            <p className="text-xs">جاري تحميل بيانات الفئات...</p>
          </div>
        ) : (
          <CategoryTable
            categories={filteredCategories}
            paginationMeta={paginationMeta}
            statusFilter={statusFilter}
            totalAllCategoriesCount={stats.totalCount}
            onPageChange={setPage}
            onEditCategory={(cat) => {
              setEditingCategory(cat);
              setIsCategoryModalOpen(true);
            }}
            onDeleteCategory={handleRequestDeleteCategory}
            onViewCategory={(cat) => void handleViewCategory(cat)}
            onAddSubCategory={handleOpenAddSubCategory}
            onEditSubCategory={handleOpenEditSubCategory}
            onDeleteSubCategory={handleRequestDeleteSubCategory}
            onViewSubCategory={(parent, sub, index) => setViewingSubCategory({ parent, sub, index })}
            onReorderSubCategories={handleReorderSubCategories}
            onExpandCategory={fetchSubCategories}
          />
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsCategoryModalOpen(false);
        }}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        isLoading={isSubmitting}
      />

      {/* Add / Edit SubCategory Modal */}
      <AddSubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsSubCategoryModalOpen(false);
        }}
        parentCategory={parentCategoryForSub}
        onSave={handleSaveSubCategory}
        editingSubCategory={editingSubCategory}
        isLoading={isSubmitting}
      />

      {/* View Parent Category Details Modal */}
      <CategoryDetailModal
        category={viewingCategory}
        onClose={handleCloseCategoryDetails}
        isLoadingSubcategories={isViewingCategoryLoading}
        subcategoriesLoadError={viewingCategoryLoadError}
        onRetrySubcategories={() => {
          if (viewingCategory) void handleViewCategory(viewingCategory);
        }}
      />

      {/* View SubCategory Details Modal */}
      <SubCategoryDetailModal
        isOpen={!!viewingSubCategory}
        onClose={() => setViewingSubCategory(null)}
        parentCategory={viewingSubCategory?.parent || null}
        subCategory={viewingSubCategory?.sub || null}
        orderIndex={(viewingSubCategory?.index ?? 0) + 1}
        onEditClick={handleOpenEditSubCategory}
      />

      {/* Delete Main Category Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDeleteCategory}
        title="حذف الفئة الرئيسية"
        itemName={deletingCategory?.nameAr || ''}
        isSubcategory={false}
        isLoading={isSubmitting}
      />

      {/* Delete Subcategory Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingSubCategory}
        onClose={() => setDeletingSubCategory(null)}
        onConfirm={handleConfirmDeleteSubCategory}
        title="حذف الفئة الفرعية"
        itemName={deletingSubCategory?.sub.nameAr || ''}
        isSubcategory={true}
        isLoading={isSubmitting}
      />
    </div>
  );
};
