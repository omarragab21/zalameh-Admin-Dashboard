export type PackageDuration = 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
export type PackageStatus = 'active' | 'inactive';

export interface PackagePermissions {
  maxOffers?: number | null; // null or undefined means unlimited
  maxJobs?: number | null;
  maxPromoCodes?: number | null;
  maxMenuItems?: number | null;
  maxImages?: number | null;
}

export interface PackageSettings {
  isFeaturedPartner?: boolean;
  priorityInSearch?: boolean;
  isFeaturedPackage?: boolean;
  status: PackageStatus;
  displayOrder: number;
}

export interface Package {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number; // In JOD (د.أ)
  monthlyPrice?: number;
  yearlyPrice?: number;
  duration: PackageDuration;
  features: string[]; // List of feature tags e.g. ["قوائم مميزة", "إدارة العروض"]
  permissions: PackagePermissions;
  settings: PackageSettings;
  createdAt: string;
}

export type PackageFilterStatus = 'all' | 'active' | 'inactive';
