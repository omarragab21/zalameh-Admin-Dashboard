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

  const [totalAllCount, setTotalAllCount] = useState<number>(0);

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
        if (statusFilter === 'all' && !searchQuery) {
          setTotalAllCount(res.meta.total);
        } else if (res.meta.total > totalAllCount) {
          setTotalAllCount(res.meta.total);
        }

        loadedSubCategoryIds.current = new Set(
          res.categories
            .filter(
              (category) =>
                category.subcategories.length > 0 &&
                category.subcategories.length >= category.subcategoriesCount
            )
            .map((category) => category.id)
        );
        setCategories((prev) => {
          const prevMap = new Map(prev.map((c) => [c.id, c.subcategories]));
          return res.categories.map((cat) => {
            const existingSubs = prevMap.get(cat.id);
            if (existingSubs && existingSubs.length > 0) {
              return {
                ...cat,
                subcategories: existingSubs,
                subcategoriesCount: Math.max(cat.subcategoriesCount, existingSubs.length),
              };
            }
            return cat;
          });
        });
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
  }, [page, perPage, statusFilter, searchQuery, totalAllCount]);

  useEffect(() => {
    void fetchCategoriesData();
    return () => {
      categoriesRequestVersion.current += 1;
    };
  }, [fetchCategoriesData]);

  // Dynamic Statistics Calculation
  const stats: CategoryStats = useMemo(() => {
    const totalCount = totalAllCount || paginationMeta.total || categories.length;
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
  }, [categories, paginationMeta.total, totalAllCount]);

  // Filtered categories based on selected statusFilter ('all' | 'active' | 'inactive') and searchQuery
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (statusFilter !== 'all' && cat.status !== statusFilter) {
        return false;
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAr = cat.nameAr.toLowerCase().includes(q);
        const matchesEn = cat.nameEn.toLowerCase().includes(q);
        return matchesAr || matchesEn;
      }
      return true;
    });
  }, [categories, statusFilter, searchQuery]);

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

  // Handlers for CRUD operations - Always re-fetch from API to update counts & pagination
  const addCategory = async (payload: CreateCategoryPayload) => {
    const newCat = await repository.createCategory(payload);
    invalidateCategoriesRequest();
    await fetchCategoriesData();
    return newCat;
  };

  const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
    const updated = await repository.updateCategory(id, payload);
    invalidateCategoriesRequest();
    await fetchCategoriesData();
    return updated;
  };

  const deleteCategory = async (id: string) => {
    await repository.deleteCategory(id);
    invalidateCategoriesRequest();
    loadedSubCategoryIds.current.delete(id);
    if (categories.length === 1 && page > 1) {
      setPage((prev) => Math.max(prev - 1, 1));
    } else {
      await fetchCategoriesData();
    }
  };

  const addSubCategory = async (categoryId: string, payload: CreateSubCategoryPayload) => {
    const newSub = await repository.createSubCategory(categoryId, payload);
    invalidateCategoriesRequest();
    invalidateSubCategoryRequest(categoryId);
    await fetchCategoriesData();
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
    await fetchCategoriesData();
    return updatedSub;
  };

  const deleteSubCategory = async (categoryId: string, subCategoryId: string) => {
    await repository.deleteSubCategory(categoryId, subCategoryId);
    invalidateCategoriesRequest();
    invalidateSubCategoryRequest(categoryId);
    await fetchCategoriesData();
  };

  const reorderSubCategories = async (categoryId: string, sourceIndex: number, targetIndex: number) => {
    const updatedSubs = await repository.reorderSubCategories(categoryId, sourceIndex, targetIndex);
    invalidateCategoriesRequest();
    invalidateSubCategoryRequest(categoryId);
    await fetchCategoriesData();
    return updatedSubs;
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
