import type { CategoryRepository } from '../../domain/repositories/category.repository';
import type {
  Category,
  SubCategory,
  CategoryFilterStatus,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
} from '../../domain/entities/category.entity';
import {
  ApiRequestError,
  categoryApiService,
  getCategoryResponseMeta,
  mapCategoryFromApi,
  mapSubCategoryFromApi,
  setCategoryResponseMeta,
} from '../api/categoryApiService';

const CATEGORIES_STORAGE_KEY = 'zalameh_categories_data_v5';

export class CategoryRepositoryImpl implements CategoryRepository {
  private readonly categoryDetailsInFlight = new Map<string, Promise<Category>>();
  private readonly subCategoryRequestVersions = new Map<string, number>();
  private readonly subCategoriesInFlight = new Map<
    string,
    { version: number; request: Promise<SubCategory[]> }
  >();
  private categoriesInFlight: Promise<Category[]> | null = null;
  private categoryDataVersion = 0;
  private mutationCommitTail: Promise<void> = Promise.resolve();

  private getLocalCategories(): Category[] {
    try {
      const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(mapCategoryFromApi)
        .filter((c) => Boolean(c.nameAr || c.nameEn) && c.id !== 'cat-1');
    } catch (err) {
      console.warn('Unable to read categories cache.', err);
      return [];
    }
  }

  private saveLocalCategories(categories: Category[]): void {
    try {
      const validCategories = categories.filter((c) => Boolean(c.nameAr || c.nameEn));
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(validCategories));
    } catch (err) {
      console.warn('Unable to update categories cache.', err);
    }
  }

  private getSubCategoryRequestVersion(categoryId: string): number {
    return this.subCategoryRequestVersions.get(categoryId) ?? 0;
  }

  private invalidateSubCategoryRequests(categoryId: string): void {
    this.subCategoryRequestVersions.set(
      categoryId,
      this.getSubCategoryRequestVersion(categoryId) + 1
    );
  }

  private invalidateCategoryData(): void {
    this.categoryDataVersion += 1;
  }

  private async getMutationBaseCategories(): Promise<Category[]> {
    const inFlight = this.categoriesInFlight;
    if (inFlight) {
      try {
        return await inFlight;
      } catch {
        // The mutation result is still valid even if the background list request failed.
      } finally {
        if (this.categoriesInFlight === inFlight) {
          this.categoriesInFlight = null;
        }
      }
    }
    return this.getLocalCategories();
  }

  private async commitCategoryMutation<T>(
    mutate: (categories: Category[]) => T | Promise<T>
  ): Promise<T> {
    const previousCommit = this.mutationCommitTail;
    let releaseCommit = () => {};
    this.mutationCommitTail = new Promise<void>((resolve) => {
      releaseCommit = resolve;
    });

    await previousCommit;
    try {
      const categories = await this.getMutationBaseCategories();
      return await mutate(categories);
    } finally {
      releaseCommit();
    }
  }

  private fetchSubCategoriesOnce(
    categoryId: string,
    requestVersion: number
  ): Promise<SubCategory[]> {
    const activeRequest = this.subCategoriesInFlight.get(categoryId);
    if (activeRequest?.version === requestVersion) return activeRequest.request;

    const entry = {
      version: requestVersion,
      request: Promise.resolve([] as SubCategory[]),
    };
    entry.request = categoryApiService
      .fetchSubCategoriesByCategoryId(categoryId)
      .finally(() => {
        if (this.subCategoriesInFlight.get(categoryId) === entry) {
          this.subCategoriesInFlight.delete(categoryId);
        }
      });
    this.subCategoriesInFlight.set(categoryId, entry);
    return entry.request;
  }

  private fetchCategoryDetailsOnce(categoryId: string): Promise<Category> {
    const activeRequest = this.categoryDetailsInFlight.get(categoryId);
    if (activeRequest) return activeRequest;

    const request = categoryApiService
      .fetchCategoryById(categoryId)
      .finally(() => this.categoryDetailsInFlight.delete(categoryId));

    this.categoryDetailsInFlight.set(categoryId, request);
    return request;
  }

  private async hydrateMissingSubCategoryCounts(categories: Category[]): Promise<Category[]> {
    return Promise.all(
      categories.map(async (category) => {
        try {
          const subcategories = await this.fetchSubCategoriesOnce(
            category.id,
            this.getSubCategoryRequestVersion(category.id)
          );
          return {
            ...category,
            subcategories,
          };
        } catch (err) {
          if (
            err instanceof ApiRequestError &&
            (err.status === 401 || err.status === 403)
          ) {
            throw err;
          }
          console.warn(
            `Unable to hydrate subcategories for category ${category.id}.`,
            err
          );
          return category;
        }
      })
    );
  }

  private async loadCategories(requestVersion: number): Promise<Category[]> {
    let apiError: unknown = null;

    try {
      const apiCategories = await categoryApiService.fetchCategories();
      const hydratedCategories = await this.hydrateMissingSubCategoryCounts(apiCategories);

      if (requestVersion !== this.categoryDataVersion) {
        return this.getLocalCategories();
      }

      this.saveLocalCategories(hydratedCategories);
      return hydratedCategories;
    } catch (err) {
      console.warn('Backend API connection warning.', err);
      apiError = err;
    }

    if (
      apiError instanceof ApiRequestError &&
      (apiError.status === 401 || apiError.status === 403)
    ) {
      throw apiError;
    }

    const local = this.getLocalCategories();
    if (local.length > 0) {
      const hydratedLocal = await this.hydrateMissingSubCategoryCounts(local);
      this.saveLocalCategories(hydratedLocal);
      return hydratedLocal;
    }

    if (apiError instanceof Error) throw apiError;
    throw new Error('Failed to load categories');
  }

  async getCategories(statusFilter?: CategoryFilterStatus): Promise<Category[]> {
    const request = this.categoriesInFlight ?? this.loadCategories(this.categoryDataVersion);
    this.categoriesInFlight = request;

    try {
      const categories = await request;
      return this.filterByStatus(categories, statusFilter);
    } finally {
      if (this.categoriesInFlight === request) {
        this.categoriesInFlight = null;
      }
    }
  }

  async getSubCategoriesByCategoryId(categoryId: string): Promise<SubCategory[]> {
    const requestVersion = this.getSubCategoryRequestVersion(categoryId);
    try {
      const subs = await this.fetchSubCategoriesOnce(categoryId, requestVersion);
      if (requestVersion !== this.getSubCategoryRequestVersion(categoryId)) {
        const current = this.getLocalCategories().find((category) => category.id === categoryId);
        return current?.subcategories ?? [];
      }

      const local = this.getLocalCategories();
      const updated = local.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: subs,
            }
          : category
      );
      this.saveLocalCategories(updated);
      return subs;
    } catch (err) {
      console.warn('API getSubCategoriesByCategoryId failed.', err);
      if (
        err instanceof ApiRequestError &&
        (err.status === 401 || err.status === 403)
      ) {
        throw err;
      }

      if (err instanceof Error) throw err;
      throw new Error('Failed to load subcategories');
    }
  }

  private filterByStatus(categories: Category[], statusFilter?: CategoryFilterStatus): Category[] {
    if (!statusFilter || statusFilter === 'all') return categories;
    return categories.filter((cat) => cat.status === statusFilter);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await this.fetchCategoryDetailsOnce(id);
      const local = this.getLocalCategories();
      const exists = local.some((item) => item.id === id);
      const updated = exists
        ? local.map((item) => (item.id === id ? category : item))
        : [category, ...local];
      this.saveLocalCategories(updated);
      return category;
    } catch (err) {
      console.warn(`Unable to fetch category ${id}.`, err);
      if (
        err instanceof ApiRequestError &&
        (err.status === 401 || err.status === 403)
      ) {
        throw err;
      }
      return this.getLocalCategories().find((category) => category.id === id) ?? null;
    }
  }

  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    try {
      // Pass payload (including image File if present) directly to API
      const apiCat = await categoryApiService.createCategory(payload);
      if (apiCat && apiCat.id) {
        return this.commitCategoryMutation((local) => {
          this.invalidateCategoryData();
          const updated = [
            apiCat,
            ...local.filter((category) => category.id !== apiCat.id),
          ];
          this.saveLocalCategories(updated);
          return apiCat;
        });
      }
    } catch (err) {
      console.warn('API createCategory failed.', err);
      throw err;
    }

    const defaultImage = 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=150&auto=format&fit=crop&q=80';

    // Local creation fallback if API is unavailable
    const imageUrl = payload.image instanceof File ? URL.createObjectURL(payload.image) : (typeof payload.image === 'string' ? payload.image : defaultImage);

    const newCat: Category = mapCategoryFromApi({
      id: `cat-${Date.now()}`,
      name_ar: payload.nameAr,
      name_en: payload.nameEn,
      description_ar: payload.descriptionAr,
      description_en: payload.descriptionEn,
      status: payload.status,
      image: imageUrl,
      subcategories: [],
    });

    this.invalidateCategoryData();
    const local = this.getLocalCategories();
    const updated = [newCat, ...local];
    this.saveLocalCategories(updated);
    return newCat;
  }

  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    try {
      // Pass payload (including image File if present) directly to API
      const apiCat = await categoryApiService.updateCategory(id, payload);
      if (apiCat && apiCat.id) {
        return this.commitCategoryMutation((local) => {
          this.invalidateCategoryData();
          const currentCategory = local.find((category) => category.id === id);
          const responseMeta = getCategoryResponseMeta(apiCat);
          const mergedCategory = currentCategory
            ? (() => {
                const subcategories = responseMeta.hasSubcategoryList
                  ? apiCat.subcategories
                  : responseMeta.hasSubcategoryCount && apiCat.subcategoriesCount === 0
                  ? []
                  : currentCategory.subcategories;

                return {
                  ...currentCategory,
                  ...apiCat,
                  nameAr:
                    payload.nameAr !== undefined
                      ? apiCat.nameAr || payload.nameAr
                      : currentCategory.nameAr,
                  nameEn:
                    payload.nameEn !== undefined
                      ? apiCat.nameEn || payload.nameEn
                      : currentCategory.nameEn,
                  descriptionAr:
                    payload.descriptionAr !== undefined
                      ? apiCat.descriptionAr || payload.descriptionAr
                      : currentCategory.descriptionAr,
                  descriptionEn:
                    payload.descriptionEn !== undefined
                      ? apiCat.descriptionEn || payload.descriptionEn
                      : currentCategory.descriptionEn,
                  image: apiCat.image || currentCategory.image,
                  status: payload.status ?? currentCategory.status,
                  subcategories,
                  createdAt: apiCat.createdAt || currentCategory.createdAt,
                  updatedAt: apiCat.updatedAt || currentCategory.updatedAt,
                };
              })()
            : apiCat;
          setCategoryResponseMeta(mergedCategory, responseMeta);
          const updated = local.map((category) =>
            category.id === id ? mergedCategory : category
          );
          this.saveLocalCategories(updated);
          return mergedCategory;
        });
      }
    } catch (err) {
      console.warn('API updateCategory failed.', err);
      throw err;
    }

    // Local update fallback if API is unavailable
    const local = this.getLocalCategories();
    let updatedCat: Category | null = null;

    const imageUrl = payload.image instanceof File ? URL.createObjectURL(payload.image) : (typeof payload.image === 'string' ? payload.image : undefined);

    this.invalidateCategoryData();
    const updatedList = local.map((c) => {
      if (c.id !== id) return c;
      updatedCat = mapCategoryFromApi({
        ...c,
        name_ar: payload.nameAr !== undefined ? payload.nameAr : c.nameAr,
        name_en: payload.nameEn !== undefined ? payload.nameEn : c.nameEn,
        description_ar: payload.descriptionAr !== undefined ? payload.descriptionAr : c.descriptionAr,
        description_en: payload.descriptionEn !== undefined ? payload.descriptionEn : c.descriptionEn,
        status: payload.status !== undefined ? payload.status : c.status,
        image: imageUrl !== undefined ? imageUrl : c.image,
        updated_at: new Date().toISOString(),
      });
      return updatedCat;
    });

    this.saveLocalCategories(updatedList);
    if (!updatedCat) throw new Error('Category not found');
    return updatedCat;
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await categoryApiService.deleteCategory(id);
    } catch (err) {
      console.warn('API deleteCategory warning, deleting locally.', err);
      throw err;
    }

    await this.commitCategoryMutation((local) => {
      this.invalidateCategoryData();
      const updated = local.filter((c) => c.id !== id);
      this.saveLocalCategories(updated);
    });
  }

  async createSubCategory(categoryId: string, payload: CreateSubCategoryPayload): Promise<SubCategory> {
    try {
      const apiSub = await categoryApiService.createSubCategory(categoryId, payload);
      if (apiSub && apiSub.id) {
        return this.commitCategoryMutation((local) => {
          this.invalidateCategoryData();
          this.invalidateSubCategoryRequests(categoryId);
          const updated = local.map((c) => {
            if (c.id !== categoryId) return c;
            const existingSubs = c.subcategories || [];
            const subs = [
              ...existingSubs.filter((sub) => sub.id !== apiSub.id),
              apiSub,
            ];
            return {
              ...c,
              subcategories: subs,
              subcategoriesCount: c.subcategoriesCount + 1,
            };
          });
          this.saveLocalCategories(updated);
          return apiSub;
        });
      }
    } catch (err) {
      console.warn('API createSubCategory warning.', err);
      throw err;
    }

    // Local creation fallback
    const newSub: SubCategory = mapSubCategoryFromApi(
      {
        id: `sub-${Date.now()}`,
        parent_id: categoryId,
        name_ar: payload.nameAr,
        name_en: payload.nameEn,
        description_ar: payload.descriptionAr,
        description_en: payload.descriptionEn,
        status: payload.status,
      },
      categoryId
    );

    this.invalidateCategoryData();
    this.invalidateSubCategoryRequests(categoryId);
    const local = this.getLocalCategories();
    const updated = local.map((c) => {
      if (c.id !== categoryId) return c;
      const subs = [...(c.subcategories || []), newSub];
      return {
        ...c,
        subcategories: subs,
        subcategoriesCount: c.subcategoriesCount + 1,
      };
    });

    this.saveLocalCategories(updated);
    return newSub;
  }

  async updateSubCategory(
    categoryId: string,
    subCategoryId: string,
    payload: UpdateSubCategoryPayload
  ): Promise<SubCategory> {
    try {
      const apiSub = await categoryApiService.updateSubCategory(categoryId, subCategoryId, payload);
      if (apiSub && apiSub.id) {
        return this.commitCategoryMutation((local) => {
          this.invalidateCategoryData();
          this.invalidateSubCategoryRequests(categoryId);
          let mergedSubCategory = apiSub;
          const updated = local.map((c) => {
            if (c.id !== categoryId) return c;
            const subs = (c.subcategories || []).map((s) => {
              if (s.id !== subCategoryId) return s;
              mergedSubCategory = {
                ...s,
                ...apiSub,
                parentId: apiSub.parentId || s.parentId,
                nameAr:
                  payload.nameAr !== undefined ? apiSub.nameAr || payload.nameAr : s.nameAr,
                nameEn:
                  payload.nameEn !== undefined ? apiSub.nameEn || payload.nameEn : s.nameEn,
                descriptionAr:
                  payload.descriptionAr !== undefined
                    ? apiSub.descriptionAr || payload.descriptionAr
                    : s.descriptionAr,
                descriptionEn:
                  payload.descriptionEn !== undefined
                    ? apiSub.descriptionEn || payload.descriptionEn
                    : s.descriptionEn,
                image: apiSub.image || s.image,
                status: payload.status ?? s.status,
                order: apiSub.order ?? s.order,
                createdAt: apiSub.createdAt || s.createdAt,
                updatedAt: apiSub.updatedAt || s.updatedAt,
              };
              return mergedSubCategory;
            });
            return { ...c, subcategories: subs };
          });
          this.saveLocalCategories(updated);
          return mergedSubCategory;
        });
      }
    } catch (err) {
      console.warn('API updateSubCategory warning.', err);
      throw err;
    }

    // Local update fallback
    const local = this.getLocalCategories();
    let updatedSub: SubCategory | null = null;

    this.invalidateCategoryData();
    this.invalidateSubCategoryRequests(categoryId);
    const updatedList = local.map((c) => {
      if (c.id !== categoryId) return c;
      const subs = (c.subcategories || []).map((s) => {
        if (s.id !== subCategoryId) return s;
        updatedSub = mapSubCategoryFromApi(
          {
            ...s,
            name_ar: payload.nameAr !== undefined ? payload.nameAr : s.nameAr,
            name_en: payload.nameEn !== undefined ? payload.nameEn : s.nameEn,
            description_ar: payload.descriptionAr !== undefined ? payload.descriptionAr : s.descriptionAr,
            description_en: payload.descriptionEn !== undefined ? payload.descriptionEn : s.descriptionEn,
            status: payload.status !== undefined ? payload.status : s.status,
          },
          categoryId
        );
        return updatedSub;
      });
      return { ...c, subcategories: subs };
    });

    this.saveLocalCategories(updatedList);
    if (!updatedSub) throw new Error('SubCategory not found');
    return updatedSub;
  }

  async deleteSubCategory(categoryId: string, subCategoryId: string): Promise<void> {
    try {
      await categoryApiService.deleteSubCategory(categoryId, subCategoryId);
    } catch (err) {
      console.warn('API deleteSubCategory warning.', err);
      throw err;
    }

    await this.commitCategoryMutation((local) => {
      this.invalidateCategoryData();
      this.invalidateSubCategoryRequests(categoryId);
      const updated = local.map((c) => {
        if (c.id !== categoryId) return c;
        const subs = (c.subcategories || []).filter((s) => s.id !== subCategoryId);
        return {
          ...c,
          subcategories: subs,
          subcategoriesCount: Math.max(c.subcategoriesCount - 1, 0),
        };
      });
      this.saveLocalCategories(updated);
    });
  }

  async reorderSubCategories(
    categoryId: string,
    sourceIndex: number,
    targetIndex: number
  ): Promise<SubCategory[]> {
    this.invalidateCategoryData();
    this.invalidateSubCategoryRequests(categoryId);
    const local = this.getLocalCategories();
    let reorderedList: SubCategory[] = [];

    const updated = local.map((c) => {
      if (c.id !== categoryId) return c;
      const list = [...(c.subcategories || [])];
      if (sourceIndex >= 0 && sourceIndex < list.length && targetIndex >= 0 && targetIndex < list.length) {
        const [moved] = list.splice(sourceIndex, 1);
        list.splice(targetIndex, 0, moved);
      }
      reorderedList = list;
      return { ...c, subcategories: list };
    });

    this.saveLocalCategories(updated);
    return reorderedList;
  }

  async uploadImage(file: File): Promise<string> {
    return URL.createObjectURL(file);
  }
}
