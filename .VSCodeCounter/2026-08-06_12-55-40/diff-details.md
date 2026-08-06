# Diff Details

Date : 2026-08-06 12:55:40

Directory /Users/omarragab/Projects/zalameh_dashboard_app

Total : 39 files,  3546 codes, 40 comments, 238 blanks, all 3824 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [package-lock.json](/package-lock.json) | JSON | 1,049 | 0 | 0 | 1,049 |
| [package.json](/package.json) | JSON | 1 | 0 | 0 | 1 |
| [src/core/auth/AuthContext.tsx](/src/core/auth/AuthContext.tsx) | TypeScript JSX | 19 | 0 | 3 | 22 |
| [src/core/auth/authService.ts](/src/core/auth/authService.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [src/core/firebase/firebase.ts](/src/core/firebase/firebase.ts) | TypeScript | 24 | 4 | 6 | 34 |
| [src/features/categories/components/CategoryTable.tsx](/src/features/categories/components/CategoryTable.tsx) | TypeScript JSX | 14 | 0 | 3 | 17 |
| [src/features/categories/data/api/categoryApiService.ts](/src/features/categories/data/api/categoryApiService.ts) | TypeScript | 31 | 0 | 4 | 35 |
| [src/features/content/pages/ContentManagementPage.tsx](/src/features/content/pages/ContentManagementPage.tsx) | TypeScript JSX | 31 | 4 | 5 | 40 |
| [src/features/content/services/firebaseContentService.ts](/src/features/content/services/firebaseContentService.ts) | TypeScript | 131 | 0 | 13 | 144 |
| [src/features/dashboard/pages/DashboardPage.tsx](/src/features/dashboard/pages/DashboardPage.tsx) | TypeScript JSX | 5 | 0 | 0 | 5 |
| [src/features/partners/components/AddEditBranchModal.tsx](/src/features/partners/components/AddEditBranchModal.tsx) | TypeScript JSX | 246 | 6 | 17 | 269 |
| [src/features/partners/components/AddEditBrandModal.tsx](/src/features/partners/components/AddEditBrandModal.tsx) | TypeScript JSX | 229 | 8 | 22 | 259 |
| [src/features/partners/components/AddEditMenuItemModal.tsx](/src/features/partners/components/AddEditMenuItemModal.tsx) | TypeScript JSX | 195 | 4 | 17 | 216 |
| [src/features/partners/components/AddEditOfferModal.tsx](/src/features/partners/components/AddEditOfferModal.tsx) | TypeScript JSX | 103 | 5 | 9 | 117 |
| [src/features/partners/components/AddEditPartnerModal.tsx](/src/features/partners/components/AddEditPartnerModal.tsx) | TypeScript JSX | -8 | -2 | 5 | -5 |
| [src/features/partners/components/AddEditPromoCodeModal.tsx](/src/features/partners/components/AddEditPromoCodeModal.tsx) | TypeScript JSX | 32 | 1 | 1 | 34 |
| [src/features/partners/components/BrandDetailView.tsx](/src/features/partners/components/BrandDetailView.tsx) | TypeScript JSX | 353 | 24 | 44 | 421 |
| [src/features/partners/components/BrandExtraInfoView.tsx](/src/features/partners/components/BrandExtraInfoView.tsx) | TypeScript JSX | -357 | -25 | -26 | -408 |
| [src/features/partners/components/DeleteBrandModal.tsx](/src/features/partners/components/DeleteBrandModal.tsx) | TypeScript JSX | 70 | 1 | 7 | 78 |
| [src/features/partners/components/DeletePartnerModal.tsx](/src/features/partners/components/DeletePartnerModal.tsx) | TypeScript JSX | 24 | 1 | 2 | 27 |
| [src/features/partners/components/PartnerBrandsView.tsx](/src/features/partners/components/PartnerBrandsView.tsx) | TypeScript JSX | 11 | 4 | 2 | 17 |
| [src/features/partners/components/extra-info/ContactInfoCard.tsx](/src/features/partners/components/extra-info/ContactInfoCard.tsx) | TypeScript JSX | 52 | 0 | 5 | 57 |
| [src/features/partners/components/extra-info/DeliveryServiceCard.tsx](/src/features/partners/components/extra-info/DeliveryServiceCard.tsx) | TypeScript JSX | 43 | 0 | 4 | 47 |
| [src/features/partners/components/extra-info/PaymentMethodsCard.tsx](/src/features/partners/components/extra-info/PaymentMethodsCard.tsx) | TypeScript JSX | 47 | 0 | 3 | 50 |
| [src/features/partners/components/extra-info/SaveActionBar.tsx](/src/features/partners/components/extra-info/SaveActionBar.tsx) | TypeScript JSX | 62 | 0 | 8 | 70 |
| [src/features/partners/components/extra-info/SectionCard.tsx](/src/features/partners/components/extra-info/SectionCard.tsx) | TypeScript JSX | 28 | 0 | 3 | 31 |
| [src/features/partners/components/extra-info/ToggleSwitch.tsx](/src/features/partners/components/extra-info/ToggleSwitch.tsx) | TypeScript JSX | 23 | 0 | 3 | 26 |
| [src/features/partners/components/extra-info/WorkingHoursCard.tsx](/src/features/partners/components/extra-info/WorkingHoursCard.tsx) | TypeScript JSX | 108 | 0 | 8 | 116 |
| [src/features/partners/components/extra-info/constants.ts](/src/features/partners/components/extra-info/constants.ts) | TypeScript | 30 | 0 | 5 | 35 |
| [src/features/partners/components/extra-info/useBrandExtraInfoForm.ts](/src/features/partners/components/extra-info/useBrandExtraInfoForm.ts) | TypeScript | 115 | 0 | 15 | 130 |
| [src/features/partners/data/api/brandApiService.ts](/src/features/partners/data/api/brandApiService.ts) | TypeScript | 264 | 1 | 45 | 310 |
| [src/features/partners/data/api/packageApiService.ts](/src/features/partners/data/api/packageApiService.ts) | TypeScript | 74 | 2 | 8 | 84 |
| [src/features/partners/data/api/partnerApiService.ts](/src/features/partners/data/api/partnerApiService.ts) | TypeScript | 61 | 0 | 8 | 69 |
| [src/features/partners/data/mockBrandDetailsData.ts](/src/features/partners/data/mockBrandDetailsData.ts) | TypeScript | 425 | 0 | 6 | 431 |
| [src/features/partners/data/repositories/partnerRepositoryImpl.ts](/src/features/partners/data/repositories/partnerRepositoryImpl.ts) | TypeScript | 11 | 0 | 0 | 11 |
| [src/features/partners/domain/entities/partner.entity.ts](/src/features/partners/domain/entities/partner.entity.ts) | TypeScript | 49 | 0 | 4 | 53 |
| [src/features/partners/pages/PartnersPage.tsx](/src/features/partners/pages/PartnersPage.tsx) | TypeScript JSX | -99 | 2 | -27 | -124 |
| [src/features/partners/presentation/hooks/usePartners.ts](/src/features/partners/presentation/hooks/usePartners.ts) | TypeScript | 43 | 0 | 5 | 48 |
| [src/main.tsx](/src/main.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details