# Diff Details

Date : 2026-08-03 16:30:31

Directory /Users/omarragab/Projects/zalameh_dashboard_app

Total : 60 files,  9089 codes, 287 comments, 786 blanks, all 10162 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [package-lock.json](/package-lock.json) | JSON | 62 | 0 | 0 | 62 |
| [package.json](/package.json) | JSON | 6 | 0 | 0 | 6 |
| [public/snapchat.svg](/public/snapchat.svg) | XML | 1,283 | 0 | 1 | 1,284 |
| [src/core/auth/authService.ts](/src/core/auth/authService.ts) | TypeScript | 26 | 2 | 4 | 32 |
| [src/core/types/auth.types.ts](/src/core/types/auth.types.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/core/utils/securityUtils.ts](/src/core/utils/securityUtils.ts) | TypeScript | 100 | 8 | 18 | 126 |
| [src/core/utils/terminalLogger.ts](/src/core/utils/terminalLogger.ts) | TypeScript | 15 | 2 | 3 | 20 |
| [src/features/ads/components/AdDetailModal.tsx](/src/features/ads/components/AdDetailModal.tsx) | TypeScript JSX | 109 | 6 | 10 | 125 |
| [src/features/ads/components/AdForm.tsx](/src/features/ads/components/AdForm.tsx) | TypeScript JSX | 447 | 29 | 34 | 510 |
| [src/features/ads/components/AdsFilterBar.tsx](/src/features/ads/components/AdsFilterBar.tsx) | TypeScript JSX | 92 | 4 | 6 | 102 |
| [src/features/ads/components/AdsStatsOverview.tsx](/src/features/ads/components/AdsStatsOverview.tsx) | TypeScript JSX | 79 | 8 | 10 | 97 |
| [src/features/ads/components/AdsTable.tsx](/src/features/ads/components/AdsTable.tsx) | TypeScript JSX | 229 | 12 | 19 | 260 |
| [src/features/ads/components/DeleteAdModal.tsx](/src/features/ads/components/DeleteAdModal.tsx) | TypeScript JSX | 39 | 0 | 5 | 44 |
| [src/features/ads/data/mockAds.ts](/src/features/ads/data/mockAds.ts) | TypeScript | 257 | 0 | 3 | 260 |
| [src/features/ads/pages/AdsPage.tsx](/src/features/ads/pages/AdsPage.tsx) | TypeScript JSX | 155 | 22 | 19 | 196 |
| [src/features/ads/types/ad.types.ts](/src/features/ads/types/ad.types.ts) | TypeScript | 34 | 0 | 6 | 40 |
| [src/features/categories/components/AddCategoryModal.tsx](/src/features/categories/components/AddCategoryModal.tsx) | TypeScript JSX | 193 | 5 | 18 | 216 |
| [src/features/categories/components/AddSubCategoryModal.tsx](/src/features/categories/components/AddSubCategoryModal.tsx) | TypeScript JSX | 87 | 2 | 6 | 95 |
| [src/features/categories/components/CategoryDetailModal.tsx](/src/features/categories/components/CategoryDetailModal.tsx) | TypeScript JSX | 32 | 0 | 1 | 33 |
| [src/features/categories/components/CategoryTable.tsx](/src/features/categories/components/CategoryTable.tsx) | TypeScript JSX | 120 | -2 | 10 | 128 |
| [src/features/categories/components/DeleteConfirmModal.tsx](/src/features/categories/components/DeleteConfirmModal.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [src/features/categories/components/ImageCropModal.tsx](/src/features/categories/components/ImageCropModal.tsx) | TypeScript JSX | 277 | 7 | 29 | 313 |
| [src/features/categories/components/SubCategoryDetailModal.tsx](/src/features/categories/components/SubCategoryDetailModal.tsx) | TypeScript JSX | 15 | 0 | 1 | 16 |
| [src/features/categories/data/api/categoryApiService.ts](/src/features/categories/data/api/categoryApiService.ts) | TypeScript | 776 | 3 | 98 | 877 |
| [src/features/categories/data/mockCategories.ts](/src/features/categories/data/mockCategories.ts) | TypeScript | -364 | 1 | 0 | -363 |
| [src/features/categories/data/repositories/categoryRepositoryImpl.ts](/src/features/categories/data/repositories/categoryRepositoryImpl.ts) | TypeScript | 80 | 0 | 15 | 95 |
| [src/features/categories/domain/entities/category.entity.ts](/src/features/categories/domain/entities/category.entity.ts) | TypeScript | 80 | 0 | 10 | 90 |
| [src/features/categories/domain/repositories/category.repository.ts](/src/features/categories/domain/repositories/category.repository.ts) | TypeScript | 73 | 0 | 13 | 86 |
| [src/features/categories/pages/CategoriesPage.tsx](/src/features/categories/pages/CategoriesPage.tsx) | TypeScript JSX | 123 | -1 | 4 | 126 |
| [src/features/categories/presentation/hooks/useCategories.ts](/src/features/categories/presentation/hooks/useCategories.ts) | TypeScript | 250 | 4 | 26 | 280 |
| [src/features/categories/types/category.types.ts](/src/features/categories/types/category.types.ts) | TypeScript | -20 | 0 | -2 | -22 |
| [src/features/dashboard/components/DashboardSidebar.tsx](/src/features/dashboard/components/DashboardSidebar.tsx) | TypeScript JSX | 75 | 2 | 6 | 83 |
| [src/features/dashboard/pages/DashboardPage.tsx](/src/features/dashboard/pages/DashboardPage.tsx) | TypeScript JSX | 43 | 4 | 4 | 51 |
| [src/features/finance/components/FinanceOverviewTab.tsx](/src/features/finance/components/FinanceOverviewTab.tsx) | TypeScript JSX | 223 | 13 | 13 | 249 |
| [src/features/finance/components/FinancePaymentsTab.tsx](/src/features/finance/components/FinancePaymentsTab.tsx) | TypeScript JSX | 219 | 19 | 20 | 258 |
| [src/features/finance/components/FinanceRenewalsTab.tsx](/src/features/finance/components/FinanceRenewalsTab.tsx) | TypeScript JSX | 366 | 24 | 27 | 417 |
| [src/features/finance/components/FinanceReportsTab.tsx](/src/features/finance/components/FinanceReportsTab.tsx) | TypeScript JSX | 339 | 31 | 24 | 394 |
| [src/features/finance/components/FinanceSubscriptionsTab.tsx](/src/features/finance/components/FinanceSubscriptionsTab.tsx) | TypeScript JSX | 868 | 37 | 63 | 968 |
| [src/features/finance/pages/FinancePage.tsx](/src/features/finance/pages/FinancePage.tsx) | TypeScript JSX | 42 | -1 | 0 | 41 |
| [src/features/packages/components/AddEditPackageModal.tsx](/src/features/packages/components/AddEditPackageModal.tsx) | TypeScript JSX | 2 | 0 | 0 | 2 |
| [src/features/partners/components/AddEditBranchModal.tsx](/src/features/partners/components/AddEditBranchModal.tsx) | TypeScript JSX | 38 | 1 | 1 | 40 |
| [src/features/partners/components/AddEditJobModal.tsx](/src/features/partners/components/AddEditJobModal.tsx) | TypeScript JSX | 269 | 13 | 29 | 311 |
| [src/features/partners/components/AddEditMenuItemModal.tsx](/src/features/partners/components/AddEditMenuItemModal.tsx) | TypeScript JSX | 257 | 13 | 19 | 289 |
| [src/features/partners/components/AddEditPartnerModal.tsx](/src/features/partners/components/AddEditPartnerModal.tsx) | TypeScript JSX | -1 | -1 | 0 | -2 |
| [src/features/partners/components/BrandDetailView.tsx](/src/features/partners/components/BrandDetailView.tsx) | TypeScript JSX | 292 | 9 | 15 | 316 |
| [src/features/partners/components/PartnerBrandsView.tsx](/src/features/partners/components/PartnerBrandsView.tsx) | TypeScript JSX | 10 | 2 | 1 | 13 |
| [src/features/partners/components/PartnerSocialLinks.tsx](/src/features/partners/components/PartnerSocialLinks.tsx) | TypeScript JSX | -8 | 1 | 0 | -7 |
| [src/features/partners/components/PartnersTable.tsx](/src/features/partners/components/PartnersTable.tsx) | TypeScript JSX | 8 | 0 | 0 | 8 |
| [src/features/partners/data/api/partnerApiService.ts](/src/features/partners/data/api/partnerApiService.ts) | TypeScript | 297 | 0 | 47 | 344 |
| [src/features/partners/data/mockPartners.ts](/src/features/partners/data/mockPartners.ts) | TypeScript | -159 | 0 | 0 | -159 |
| [src/features/partners/data/repositories/partnerRepositoryImpl.ts](/src/features/partners/data/repositories/partnerRepositoryImpl.ts) | TypeScript | 66 | 0 | 12 | 78 |
| [src/features/partners/domain/entities/partner.entity.ts](/src/features/partners/domain/entities/partner.entity.ts) | TypeScript | 215 | 0 | 27 | 242 |
| [src/features/partners/domain/repositories/partner.repository.ts](/src/features/partners/domain/repositories/partner.repository.ts) | TypeScript | 48 | 0 | 9 | 57 |
| [src/features/partners/pages/PartnersPage.tsx](/src/features/partners/pages/PartnersPage.tsx) | TypeScript JSX | 202 | 4 | 21 | 227 |
| [src/features/partners/presentation/hooks/usePartners.ts](/src/features/partners/presentation/hooks/usePartners.ts) | TypeScript | 131 | 4 | 20 | 155 |
| [src/features/partners/types/partner.types.ts](/src/features/partners/types/partner.types.ts) | TypeScript | -138 | 0 | -18 | -156 |
| [src/main.tsx](/src/main.tsx) | TypeScript JSX | 0 | 0 | 1 | 1 |
| [tests/categories.integration.test.mjs](/tests/categories.integration.test.mjs) | JavaScript | 703 | 0 | 77 | 780 |
| [vercel.json](/vercel.json) | JSON | 16 | 0 | 1 | 17 |
| [vite.config.ts](/vite.config.ts) | TypeScript | 9 | 0 | 0 | 9 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details