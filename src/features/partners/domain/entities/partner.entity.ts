export type SubscriptionPlan = 'basic' | 'professional' | 'featured' | 'enterprise';

export const PartnerStatusEnum = {
  INACTIVE: 0,
  ACTIVE: 1,
  PENDING: 2,
} as const;

export type PartnerStatusEnumValue = (typeof PartnerStatusEnum)[keyof typeof PartnerStatusEnum];

export type PartnerStatus = 'active' | 'inactive' | 'pending';

export type BrandStatus = 'active' | 'inactive';

export type OfferStatus = 'active' | 'expired' | 'disabled';

export interface Offer {
  id: string;
  brandId: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl?: string;
  branchIds?: string[];
  startDate: string;
  endDate: string;
  status: OfferStatus;
}

export type BranchStatus = 'active' | 'inactive';

export interface Branch {
  id: string;
  brandId: string;
  nameAr: string;
  nameEn: string;
  address: string;
  phone: string;
  mapUrl?: string;
  status: BranchStatus;
  isMainBranch?: boolean;
}

export type PromoCodeStatus = 'active' | 'inactive';
export type UsageLocation = 'store' | 'website' | 'store_and_website';
export type PublishingScope = 'all_branches' | 'specific_branch';

export interface PromoCode {
  id: string;
  brandId: string;
  code: string;
  titleAr: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  termsAr?: string;
  termsEn?: string;
  usageLocation: UsageLocation;
  status: PromoCodeStatus;
  publishingScope: PublishingScope;
  branchId?: string;
}

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'hourly'
  | 'contract'
  | 'internship'
  | 'remote';

export type ContactMethod = 'phone' | 'whatsapp' | 'email';
export type JobStatus = 'open' | 'closed';

export interface JobContactDetails {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export interface JobPosition {
  id: string;
  brandId: string;
  titleAr: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  responsibilitiesAr?: string[];
  responsibilitiesEn?: string[];
  requirementsAr?: string[];
  requirementsEn?: string[];
  benefitsAr?: string[];
  benefitsEn?: string[];
  workingHoursAr?: string;
  workingHoursEn?: string;
  employmentType: EmploymentType;
  contactMethods: ContactMethod[];
  contactDetails?: JobContactDetails;
  status: JobStatus;
  publishingScope: PublishingScope;
  branchIds?: string[];
}

export type MenuItemUnitType = 'quantity' | 'count';
export type MenuItemStatus = 'available' | 'unavailable';

export interface MenuItem {
  id: string;
  brandId: string;
  nameAr: string;
  nameEn?: string;
  category: string;
  price: number;
  imageUrl?: string;
  unitType: MenuItemUnitType;
  status: MenuItemStatus;
  publishingScope: PublishingScope;
  branchId?: string;
}

export interface Brand {
  id: string;
  partnerId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  logoUrl?: string;
  categoryId: string;
  categoryName: string;
  subcategoryIds?: string[];
  subcategoryNames?: string[];
  status: BrandStatus;
  isFeatured: boolean;
  offersCount: number;
  offers?: Offer[];
  branches?: Branch[];
  promoCodes?: PromoCode[];
  jobs?: JobPosition[];
  menuItems?: MenuItem[];
  socialLinks?: SocialLinks;
  extraInfo?: BrandExtraInfo;
}

export interface DayWorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export type PaymentMethod =
  | 'cash'
  | 'visa'
  | 'mastercard'
  | 'applePay'
  | 'googlePay'
  | 'cliq'
  | 'eWallets';

export interface BrandExtraInfo {
  workingHours: DayWorkingHours[];
  deliveryEnabled: boolean;
  paymentMethods: PaymentMethod[];
  whatsapp: string;
  branchPhone: string;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  snapchat?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  plan: SubscriptionPlan;
  planName: string;
  role?: string;
  rating: number;
  status: PartnerStatus;
  createdAt: string;
  updatedAt?: string;
  brandsCount: number;
  brands?: Brand[];
  socialLinks?: SocialLinks;
}

export type PartnerFilterStatus = 'all' | 'active' | 'inactive' | 'pending';

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedPartnersResult {
  partners: Partner[];
  meta: PaginationMeta;
}

export interface PartnerStats {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  inactiveCount: number;
}

export interface PackageItem {
  id: number;
  nameAr: string;
  nameEn: string;
  monthlyPrice: number;
  yearlyPrice: number;
  descriptionAr?: string;
  descriptionEn?: string;
  badge?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface CreatePartnerPayload {
  nameAr: string;
  nameEn: string;
  email: string;
  password?: string;
  phone: string;
  descriptionAr?: string;
  descriptionEn?: string;
  plan?: SubscriptionPlan;
  planName?: string;
  packageId?: number | string;
  billingCycle?: 'monthly' | 'yearly';
  status?: PartnerStatus;
  avatarUrl?: string | File;
  imageFile?: File;
}

export interface UpdatePartnerPayload {
  nameAr?: string;
  nameEn?: string;
  email?: string;
  password?: string;
  phone?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  plan?: SubscriptionPlan;
  planName?: string;
  packageId?: number | string;
  billingCycle?: 'monthly' | 'yearly';
  status?: PartnerStatus;
  avatarUrl?: string | File;
  imageFile?: File;
}
