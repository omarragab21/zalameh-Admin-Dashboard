import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type {
  Category,
  CategoryFilterStatus,
  CategoryStats,
  PaginationMeta,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
} from '../../domain/entities/category.entity';
import { getCategoryResponseMeta } from '../../data/api/categoryApiService';
import { CategoryRepositoryImpl } from '../../data/repositories/categoryRepositoryImpl';

const repository = new CategoryRepositoryImpl();

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<CategoryFilterStatus>('all');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  const categoriesRequestVersion = useRef(0);
  const subCategoryRequestVersions = useRef(new Map<string, number>());
  const loadedSubCategoryIds = useRef(new Set<string>());

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleStatusFilterChange = (st: CategoryFilterStatus) => {
    setStatusFilter(st);
    setPage(1);
  };

  const handlePerPageChange = (size: number) => {
    setPerPage(size);
    setPage(1);
  };

  const invalidateSubCategoryRequest = (categoryId: string) => {
    const nextVersion = (subCategoryRequestVersions.current.get(categoryId) ?? 0) + 1;
    subCategoryRequestVersions.current.set(categoryId, nextVersion);
  };

  const invalidateCategoriesRequest = () => {
    categoriesRequestVersion.current += 1;
  };

  const fetchCategoriesData = useCallback(async () => {
    const requestVersion = categoriesRequestVersion.current + 1;
    categoriesRequestVersion.current = requestVersion;
    setLoading(true);
    setError(null);
    try {
      const res = await repository.getCategoriesPage({
        page,
        perPage,
        statusFilter,
        search: searchQuery,
      });
      if (categoriesRequestVersion.current === requestVersion) {
        loadedSubCategoryIds.current = new Set(
          res.categories
            .filter(
              (category) =>
                category.subcategories.length > 0 &&
                category.subcategories.length >= category.subcategoriesCount
            )
            .map((category) => category.id)
        );
        setCategories(res.categories);
        setPaginationMeta(res.meta);
      }
    } catch (err: any) {
      if (categoriesRequestVersion.current === requestVersion) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'فشل في تحميل الفئات');
      }
    } finally {
      if (categoriesRequestVersion.current === requestVersion) {
        setLoading(false);
      }
    }
  }, [page, perPage, statusFilter, searchQuery]);

  useEffect(() => {
    void fetchCategoriesData();
    return () => {
      categoriesRequestVersion.current += 1;
    };
  }, [fetchCategoriesData]);

  // Dynamic Statistics Calculation
  const stats: CategoryStats = useMemo(() => {
    const totalCount = paginationMeta.total || categories.length;
    const activeCount = categories.filter((c) => c.status === 'active').length;
    const inactiveCount = categories.filter((c) => c.status === 'inactive').length;
    const subcategoriesCount = categories.reduce(
      (acc, curr) => acc + curr.subcategoriesCount,
      0
    );

    return {
      totalCount,
      activeCount,
      inactiveCount,
      subcategoriesCount,
    };
  }, [categories, paginationMeta.total]);

  const filteredCategories = categories;

  // Fetch Subcategories for a given category ID on expand
  const fetchSubCategories = async (categoryId: string) => {
    const requestVersion = (subCategoryRequestVersions.current.get(categoryId) ?? 0) + 1;
    subCategoryRequestVersions.current.set(categoryId, requestVersion);
    try {
      const subs = await repository.getSubCategoriesByCategoryId(categoryId);
      if (subCategoryRequestVersions.current.get(categoryId) !== requestVersion) {
        return subs;
      }
      loadedSubCategoryIds.current.add(categoryId);
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== categoryId) return c;
          return {
            ...c,
            subcategories: subs,
            subcategoriesCount: subs.length,
          };
        })
      );
      return subs;
    } catch (err) {
      console.error('Error fetching subcategories for category', categoryId, err);
      throw err;
    }
  };

  const isSubCategoriesLoaded = useCallback(
    (categoryId: string) => loadedSubCategoryIds.current.has(categoryId),
    []
  );

  // Handlers for CRUD operations
  const addCategory = async (payload: CreateCategoryPayload) => {
    const newCat = await repository.createCategory(payload);
    invalidateCategoriesRequest();
    loadedSubCategoryIds.current.add(newCat.id);
    setCategories((prev) => [
      newCat,
      ...prev.filter((category) => category.id !== newCat.id),
    ]);
    return newCat;
  };

  const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
    const updated = await repository.updateCategory(id, payload);
    invalidateCategoriesRequest();
    const responseMeta = getCategoryResponseMeta(updated);
    if (responseMeta.hasSubcategoryList) {
      loadedSubCategoryIds.current.add(id);
    }
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? (() => {
              const hasUpdatedRelations =
                responseMeta.hasSubcategoryList || responseMeta.hasSubcategoryCount;
              return {
                ...category,
                ...updated,
                nameAr:
                  payload.nameAr !== undefined
                    ? updated.nameAr || payload.nameAr
                    : category.nameAr,
                nameEn:
                  payload.nameEn !== undefined
                    ? updated.nameEn || payload.nameEn
                    : category.nameEn,
                descriptionAr:
                  payload.descriptionAr !== undefined
                    ? updated.descriptionAr || payload.descriptionAr
                    : category.descriptionAr,
                descriptionEn:
                  payload.descriptionEn !== undefined
                    ? updated.descriptionEn || payload.descriptionEn
                    : category.descriptionEn,
                image: updated.image || category.image,
                status: payload.status ?? category.status,
                subcategories: hasUpdatedRelations
                  ? updated.subcategories
                  : category.subcategories,
                subcategoriesCount: hasUpdatedRelations
                  ? Math.max(updated.subcategoriesCount, updated.subcategories.length)
                  : category.subcategoriesCount,
              };
            })()
          : category
      )
    );
    return updated;
  };

  const deleteCategory = async (id: string) => {
    await repository.deleteCategory(id);
    invalidateCategoriesRequest();
    loadedSubCategoryIds.current.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addSubCategory = async (categoryId: string, payload: CreateSubCategoryPayload) => {
    const newSub = await repository.createSubCategory(categoryId, payload);
    invalidateCategoriesRequest();
    invalidateSubCategoryRequest(categoryId);
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        const existingSubs = c.subcategories || [];
        const alreadyExists = existingSubs.some((sub) => sub.id === newSub.id);
        const subs = [
          ...existingSubs.filter((sub) => sub.id !== newSub.id),
          newSub,
        ];
        return {
          ...c,
          subcategories: subs,
          subcategoriesCount: Math.max(
            alreadyExists ? c.subcategoriesCount : c.subcategoriesCount + 1,
            subs.length
          ),
        };
      })
    );
    return newSub;
  };

  const updateSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    payload: UpdateSubCategoryPayload
  ) => {
    const updatedSub = await repository.updateSubCategory(categoryId, subCategoryId, payload);
    invalidateCategoriesRequest();
    invalidateSubCategoryRequest(categoryId);
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        const subs = (c.subcategories || []).map((s) => {
          if (s.id !== subCategoryId) return s;
          return {
            ...s,
            ...updatedSub,
            parentId: updatedSub.parentId || s.parentId,
            nameAr:
              payload.nameAr !== undefined ? updatedSub.nameAr || payload.nameAr : s.nameAr,
            nameEn:
              payload.nameEn !== undefined ? updatedSub.nameEn || payload.nameEn : s.nameEn,
            descriptionAr:
              payload.descriptionAr !== undefined
                ? updatedSub.descriptionAr || payload.descriptionAr
                : s.descriptionAr,
            descriptionEn:
              payload.descriptionEn !== undefined
                ? updatedSub.descriptionEn || payload.descriptionEn
                : s.descriptionEn,
            image: updatedSub.image || s.image,
            status: payload.status ?? s.status,
            order: updatedSub.order ?? s.order,
          };
        });
        return { ...c, subcategories: subs };
      })
    );
    return updatedSub;
  };

  const deleteSubCategory = async (categoryId: string, subCategoryId: string) => {
    await repository.deleteSubCategory(categoryId, subCategoryId);
    invalidateCategoriesRequest();
    invalidateSubCategoryRequest(categoryId);
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        const subs = (c.subcategories || []).filter((s) => s.id !== subCategoryId);
        return {
          ...c,
          subcategories: subs,
          subcategoriesCount: Math.max(c.subcategoriesCount - 1, subs.length, 0),
        };
      })
    );
  };

  const reorderSubCategories = async (categoryId: string, sourceIndex: number, targetIndex: number) => {
    const updatedSubs = await repository.reorderSubCategories(categoryId, sourceIndex, targetIndex);
    invalidateCategoriesRequest();
    invalidateSubCategoryRequest(categoryId);
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        return { ...c, subcategories: updatedSubs };
      })
    );
  };

  return {
    categories,
    filteredCategories,
    loading,
    error,
    stats,
    searchQuery,
    setSearchQuery: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    page,
    setPage,
    perPage,
    setPerPage: handlePerPageChange,
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
    refresh: fetchCategoriesData,
  };
}
