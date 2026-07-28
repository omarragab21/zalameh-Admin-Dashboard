import React, { useState, useMemo } from 'react';
import type { Category, SubCategory, CategoryFilterStatus } from '../types/category.types';
import { initialCategories } from '../data/mockCategories';
import { CategoryStatsHeader } from '../components/CategoryStatsHeader';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { CategoryTable } from '../components/CategoryTable';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { AddSubCategoryModal } from '../components/AddSubCategoryModal';
import { CategoryDetailModal } from '../components/CategoryDetailModal';
import { SubCategoryDetailModal } from '../components/SubCategoryDetailModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CategoryFilterStatus>('all');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [parentCategoryForSub, setParentCategoryForSub] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
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

  // Compute Statistics
  const totalCount = categories.length;
  const activeCount = useMemo(() => categories.filter((c) => c.status === 'active').length, [categories]);
  const inactiveCount = useMemo(() => categories.filter((c) => c.status === 'inactive').length, [categories]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Status filter
      if (statusFilter !== 'all' && cat.status !== statusFilter) {
        return false;
      }
      // Search filter (in Arabic name or English name or subcategories)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAr = cat.nameAr.toLowerCase().includes(q);
        const matchesEn = cat.nameEn.toLowerCase().includes(q);
        const matchesSub = cat.subcategories?.some(
          (sub) => sub.nameAr.toLowerCase().includes(q) || sub.nameEn.toLowerCase().includes(q)
        );
        return matchesAr || matchesEn || matchesSub;
      }
      return true;
    });
  }, [categories, statusFilter, searchQuery]);

  // Add / Edit Main Category Handler
  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, ...categoryData }
            : c
        )
      );
    } else {
      // Add new main category
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        nameAr: categoryData.nameAr || 'فئة جديدة',
        nameEn: categoryData.nameEn || 'New Category',
        descriptionAr: categoryData.descriptionAr,
        descriptionEn: categoryData.descriptionEn,
        image: categoryData.image || 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=150&auto=format&fit=crop&q=80',
        status: categoryData.status || 'active',
        subcategoriesCount: 0,
        subcategories: [],
      };
      setCategories((prev) => [newCat, ...prev]);
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
  const handleConfirmDeleteCategory = () => {
    if (deletingCategory) {
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      setDeletingCategory(null);
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
  const handleSaveSubCategory = (subData: Partial<SubCategory>) => {
    if (!parentCategoryForSub) return;

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== parentCategoryForSub.id) return c;

        let updatedSubs = [...(c.subcategories || [])];
        if (editingSubCategory) {
          // Edit existing subcategory
          updatedSubs = updatedSubs.map((s) =>
            s.id === editingSubCategory.id ? { ...s, ...subData } : s
          );
        } else {
          // Add new subcategory
          const newSub: SubCategory = {
            id: `sub-${Date.now()}`,
            parentId: parentCategoryForSub.id,
            nameAr: subData.nameAr || 'فئة فرعية جديدة',
            nameEn: subData.nameEn || 'New Subcategory',
            descriptionAr: subData.descriptionAr,
            descriptionEn: subData.descriptionEn,
            status: subData.status || 'active',
          };
          updatedSubs.push(newSub);
        }

        return {
          ...c,
          subcategories: updatedSubs,
          subcategoriesCount: updatedSubs.length,
        };
      })
    );
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
  const handleConfirmDeleteSubCategory = () => {
    if (deletingSubCategory) {
      const { parentCatId, sub } = deletingSubCategory;
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== parentCatId) return c;
          const updatedSubs = (c.subcategories || []).filter((s) => s.id !== sub.id);
          return {
            ...c,
            subcategories: updatedSubs,
            subcategoriesCount: updatedSubs.length,
          };
        })
      );
      setDeletingSubCategory(null);
    }
  };

  // Reorder SubCategories Handler (Swap / Drag & Drop)
  const handleReorderSubCategories = (parentCatId: string, sourceIndex: number, targetIndex: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== parentCatId) return c;
        const list = [...(c.subcategories || [])];
        if (sourceIndex < 0 || sourceIndex >= list.length || targetIndex < 0 || targetIndex >= list.length) return c;
        const [movedItem] = list.splice(sourceIndex, 1);
        list.splice(targetIndex, 0, movedItem);
        return {
          ...c,
          subcategories: list,
        };
      })
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Stats (3 Cards) */}
      <CategoryStatsHeader
        totalCount={totalCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
      />

      {/* 2. Unified Connected Container: Filter Bar + Category Table + Pagination */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Top Header Filter Bar inside the same card block */}
        <CategoryFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddCategoryClick={() => {
            setEditingCategory(null);
            setIsCategoryModalOpen(true);
          }}
        />

        {/* Main Category Table with Row Collapsible Subcategories */}
        <CategoryTable
          categories={filteredCategories}
          onEditCategory={(cat) => {
            setEditingCategory(cat);
            setIsCategoryModalOpen(true);
          }}
          onDeleteCategory={handleRequestDeleteCategory}
          onViewCategory={(cat) => setViewingCategory(cat)}
          onAddSubCategory={handleOpenAddSubCategory}
          onEditSubCategory={handleOpenEditSubCategory}
          onDeleteSubCategory={handleRequestDeleteSubCategory}
          onViewSubCategory={(parent, sub, index) => setViewingSubCategory({ parent, sub, index })}
          onReorderSubCategories={handleReorderSubCategories}
        />
      </div>

      {/* Add / Edit Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />

      {/* Add / Edit SubCategory Modal */}
      <AddSubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
        parentCategory={parentCategoryForSub}
        onSave={handleSaveSubCategory}
        editingSubCategory={editingSubCategory}
      />

      {/* View Parent Category Details Modal */}
      <CategoryDetailModal
        category={viewingCategory}
        onClose={() => setViewingCategory(null)}
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

      {/* Delete Main Category Confirmation Modal (Matching Screenshot 1) */}
      <DeleteConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDeleteCategory}
        title="حذف الفئة الرئيسية"
        itemName={deletingCategory?.nameAr || ''}
        isSubcategory={false}
      />

      {/* Delete Subcategory Confirmation Modal (Matching Screenshot 2) */}
      <DeleteConfirmModal
        isOpen={!!deletingSubCategory}
        onClose={() => setDeletingSubCategory(null)}
        onConfirm={handleConfirmDeleteSubCategory}
        title="حذف الفئة الفرعية"
        itemName={deletingSubCategory?.sub.nameAr || ''}
        isSubcategory={true}
      />
    </div>
  );
};
