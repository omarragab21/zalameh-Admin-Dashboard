import type {
  Category,
  SubCategory,
  CategoryFilterStatus,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
} from '../entities/category.entity';

export interface CategoryRepository {
  /**
   * Fetch all main categories along with their nested subcategories
   */
  getCategories(statusFilter?: CategoryFilterStatus): Promise<Category[]>;

  /**
   * Fetch subcategories for a specific main category ID
   */
  getSubCategoriesByCategoryId(categoryId: string): Promise<SubCategory[]>;

  /**
   * Fetch a single category by ID
   */
  getCategoryById(id: string): Promise<Category | null>;

  /**
   * Create a new main category
   */
  createCategory(payload: CreateCategoryPayload): Promise<Category>;

  /**
   * Update an existing main category
   */
  updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category>;

  /**
   * Delete a main category by ID
   */
  deleteCategory(id: string): Promise<void>;

  /**
   * Create a subcategory under a main category
   */
  createSubCategory(categoryId: string, payload: CreateSubCategoryPayload): Promise<SubCategory>;

  /**
   * Update an existing subcategory
   */
  updateSubCategory(
    categoryId: string,
    subCategoryId: string,
    payload: UpdateSubCategoryPayload
  ): Promise<SubCategory>;

  /**
   * Delete a subcategory
   */
  deleteSubCategory(categoryId: string, subCategoryId: string): Promise<void>;

  /**
   * Reorder subcategories inside a main category
   */
  reorderSubCategories(
    categoryId: string,
    sourceIndex: number,
    targetIndex: number
  ): Promise<SubCategory[]>;

  /**
   * Upload image file for a category
   */
  uploadImage(file: File): Promise<string>;
}
