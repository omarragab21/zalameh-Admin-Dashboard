import type { CategoryRepository } from '../../domain/repositories/category.repository';
import type {
  Category,
  SubCategory,
  CategoryFilterStatus,
  PaginatedCategoriesResult,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
} from '../../domain/entities/category.entity';
import { categoryApiService } from '../api/categoryApiService';

export class CategoryRepositoryImpl implements CategoryRepository {
  private filterByStatus(categories: Category[], statusFilter?: CategoryFilterStatus): Category[] {
    if (!statusFilter || statusFilter === 'all') return categories;
    return categories.filter((cat) => cat.status === statusFilter);
  }

  async getCategories(statusFilter?: CategoryFilterStatus): Promise<Category[]> {
    const categories = await categoryApiService.fetchCategories();
    return this.filterByStatus(categories, statusFilter);
  }

  async getCategoriesPage(params?: {
    page?: number;
    perPage?: number;
    statusFilter?: CategoryFilterStatus;
    search?: string;
  }): Promise<PaginatedCategoriesResult> {
    const page = params?.page ?? 1;
    const perPage = params?.perPage ?? 15;
    const search = params?.search;
    const statusFilter = params?.statusFilter;

    const res = await categoryApiService.fetchCategoriesPage(page, perPage, search, statusFilter);
    return {
      categories: res.data,
      meta: res.meta,
    };
  }

  async getSubCategoriesByCategoryId(categoryId: string): Promise<SubCategory[]> {
    return categoryApiService.fetchSubCategoriesByCategoryId(categoryId);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      return await categoryApiService.fetchCategoryById(id);
    } catch {
      return null;
    }
  }

  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    return categoryApiService.createCategory(payload);
  }

  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    return categoryApiService.updateCategory(id, payload);
  }

  async deleteCategory(id: string): Promise<void> {
    await categoryApiService.deleteCategory(id);
  }

  async createSubCategory(categoryId: string, payload: CreateSubCategoryPayload): Promise<SubCategory> {
    return categoryApiService.createSubCategory(categoryId, payload);
  }

  async updateSubCategory(
    categoryId: string,
    subCategoryId: string,
    payload: UpdateSubCategoryPayload
  ): Promise<SubCategory> {
    return categoryApiService.updateSubCategory(categoryId, subCategoryId, payload);
  }

  async deleteSubCategory(categoryId: string, subCategoryId: string): Promise<void> {
    await categoryApiService.deleteSubCategory(categoryId, subCategoryId);
  }

  async reorderSubCategories(
    _categoryId: string,
    _sourceIndex: number,
    _targetIndex: number
  ): Promise<SubCategory[]> {
    return [];
  }

  async uploadImage(file: File): Promise<string> {
    return categoryApiService.uploadCategoryIcon(file);
  }
}
