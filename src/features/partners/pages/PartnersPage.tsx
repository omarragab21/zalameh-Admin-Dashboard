import React, { useState, useEffect } from 'react';
import type { Partner, Brand, BrandStatus, Branch, BranchStatus, Offer, BrandExtraInfo, PromoCode, JobPosition, MenuItem } from '../types/partner.types';
import { PartnerStatsHeader } from '../components/PartnerStatsHeader';
import { PartnerFilterBar } from '../components/PartnerFilterBar';
import { PartnersTable } from '../components/PartnersTable';
import { AddEditPartnerModal } from '../components/AddEditPartnerModal';
import { PartnerBrandsView } from '../components/PartnerBrandsView';
import { AddEditBrandModal } from '../components/AddEditBrandModal';
import { BrandDetailView } from '../components/BrandDetailView';
import { AddEditOfferModal } from '../components/AddEditOfferModal';
import { AddEditBranchModal } from '../components/AddEditBranchModal';
import { AddEditPromoCodeModal } from '../components/AddEditPromoCodeModal';
import { AddEditJobModal } from '../components/AddEditJobModal';
import { AddEditMenuItemModal } from '../components/AddEditMenuItemModal';
import { SuspendPartnerModal } from '../components/SuspendPartnerModal';
import { DeletePartnerModal } from '../components/DeletePartnerModal';

import { usePartners } from '../presentation/hooks/usePartners';

export const PartnersPage: React.FC = () => {
  const {
    partners,
    loading,
    error,
    searchQuery,
    statusFilter,
    page,
    paginationMeta,
    stats,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleSavePartner: savePartnerToApi,
    handleToggleStatus: toggleStatusInApi,
    handleDeletePartner: deletePartnerFromApi,
    refetch,
  } = usePartners();

  const [localPartners, setLocalPartners] = useState<Partner[]>([]);

  useEffect(() => {
    setLocalPartners(partners);
  }, [partners]);

  // Active View State (List View vs Detail Brands View)
  const [selectedPartnerForBrands, setSelectedPartnerForBrands] = useState<Partner | null>(null);

  // Modals state
  const [isAddEditPartnerOpen, setIsAddEditPartnerOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const [partnerToSuspend, setPartnerToSuspend] = useState<Partner | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);

  // Brand Modals state
  const [isAddEditBrandOpen, setIsAddEditBrandOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Offers Modals state
  const [activeBrandForOffers, setActiveBrandForOffers] = useState<Brand | null>(null);
  const [isAddEditOfferOpen, setIsAddEditOfferOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Branch Modals state
  const [isAddEditBranchOpen, setIsAddEditBranchOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Promo Code Modals state
  const [isAddEditPromoCodeOpen, setIsAddEditPromoCodeOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);

  // Job Modals state
  const [isAddEditJobOpen, setIsAddEditJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);

  // Menu Item Modals state
  const [isAddEditMenuItemOpen, setIsAddEditMenuItemOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // Save Partner (Add or Edit)
  const handleSavePartner = async (partnerData: Partial<Partner>) => {
    try {
      await savePartnerToApi(partnerData as any, editingPartner?.id);
      setIsAddEditPartnerOpen(false);
      setEditingPartner(null);
    } catch (err: any) {
      alert(err?.message || 'حدث خطأ أثناء حفظ بيانات الشريك');
    }
  };

  // Toggle Suspend Partner Status
  const handleConfirmSuspendPartner = async () => {
    if (!partnerToSuspend) return;
    try {
      await toggleStatusInApi(partnerToSuspend.id, partnerToSuspend.status);
    } catch (err: any) {
      alert(err?.message || 'فشل تغيير حالة الشريك');
    } finally {
      setPartnerToSuspend(null);
    }
  };

  // Confirm Delete Partner
  const handleConfirmDeletePartner = async () => {
    if (!partnerToDelete) return;
    try {
      await deletePartnerFromApi(partnerToDelete.id);
      if (selectedPartnerForBrands?.id === partnerToDelete.id) {
        setSelectedPartnerForBrands(null);
      }
    } catch (err: any) {
      alert(err?.message || 'فشل حذف الشريك');
    } finally {
      setPartnerToDelete(null);
    }
  };

  // Brand Operations
  const handleSaveBrand = (brandData: Partial<Brand>) => {
    if (!selectedPartnerForBrands) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        let currentBrands = [...(p.brands || [])];
        if (editingBrand) {
          currentBrands = currentBrands.map((b) =>
            b.id === editingBrand.id ? { ...b, ...brandData } : b
          );
        } else {
          const newBrand: Brand = {
            id: `brand-${Date.now()}`,
            partnerId: p.id,
            nameAr: brandData.nameAr || 'علامة تجارية جديدة',
            nameEn: brandData.nameEn || 'New Brand',
            descriptionAr: brandData.descriptionAr,
            descriptionEn: brandData.descriptionEn,
            logoUrl: brandData.logoUrl,
            categoryId: brandData.categoryId || '',
            categoryName: brandData.categoryName || '',
            subcategoryIds: brandData.subcategoryIds,
            subcategoryNames: brandData.subcategoryNames,
            status: brandData.status || 'active',
            isFeatured: brandData.isFeatured || false,
            offersCount: 0,
            offers: [],
            branches: [],
          };
          currentBrands.push(newBrand);
        }

        const updatedPartner = {
          ...p,
          brands: currentBrands,
          brandsCount: currentBrands.length,
        };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  // Delete Brand
  const handleDeleteBrand = (brand: Brand) => {
    if (!selectedPartnerForBrands) return;
    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;
        const updatedBrands = (p.brands || []).filter((b) => b.id !== brand.id);
        const updatedPartner = {
          ...p,
          brands: updatedBrands,
          brandsCount: updatedBrands.length,
        };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  // Toggle Brand Status (from detail view)
  const handleToggleBrandStatus = (brand: Brand) => {
    if (!selectedPartnerForBrands) return;
    const newStatus: BrandStatus = brand.status === 'active' ? 'inactive' : 'active';
    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;
        const updatedBrands = (p.brands || []).map((b) =>
          b.id === brand.id ? { ...b, status: newStatus } : b
        );
        const updatedPartner = { ...p, brands: updatedBrands };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
    setActiveBrandForOffers((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  // Update Brand Extra Info
  const handleUpdateBrandExtraInfo = (extraInfo: BrandExtraInfo) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    const updatedBrand = { ...activeBrandForOffers, extraInfo };
    setActiveBrandForOffers(updatedBrand);

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const currentBrands = (p.brands || []).map((b) =>
          b.id === activeBrandForOffers.id ? updatedBrand : b
        );

        const updatedPartner = {
          ...p,
          brands: currentBrands,
        };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  // Offer Operations
  const handleSaveOffer = (offerData: Partial<Offer>) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;

          let currentOffers = [...(b.offers || [])];
          if (editingOffer) {
            currentOffers = currentOffers.map((o) =>
              o.id === editingOffer.id ? { ...o, ...offerData } : o
            );
          } else {
            const newOffer: Offer = {
              id: `offer-${Date.now()}`,
              brandId: b.id,
              titleAr: offerData.titleAr || 'عرض جديد',
              titleEn: offerData.titleEn || 'New Offer',
              descriptionAr: offerData.descriptionAr,
              descriptionEn: offerData.descriptionEn,
              imageUrl: offerData.imageUrl,
              branchIds: offerData.branchIds,
              startDate: offerData.startDate || new Date().toISOString().split('T')[0],
              endDate: offerData.endDate || '',
              status: offerData.status || 'active',
            };
            currentOffers.push(newOffer);
          }

          const updatedBrand = {
            ...b,
            offers: currentOffers,
            offersCount: currentOffers.length,
          };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = {
          ...p,
          brands: updatedBrands,
        };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  // Delete Offer
  const handleDeleteOffer = (offerId: string) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;

          const updatedOffers = (b.offers || []).filter((o) => o.id !== offerId);
          const updatedBrand = {
            ...b,
            offers: updatedOffers,
            offersCount: updatedOffers.length,
          };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = {
          ...p,
          brands: updatedBrands,
        };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  // Branch Operations
  const updateActiveBrandBranches = (updater: (branches: Branch[]) => Branch[]) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;
          const updatedBrand = { ...b, branches: updater(b.branches || []) };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = { ...p, brands: updatedBrands };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  const handleSaveBranch = (branchData: Partial<Branch>) => {
    if (!activeBrandForOffers) return;

    if (editingBranch) {
      updateActiveBrandBranches((branches) =>
        branches.map((b) => {
          if (b.id === editingBranch.id) {
            return { ...b, ...branchData };
          }
          return branchData.isMainBranch ? { ...b, isMainBranch: false } : b;
        })
      );
    } else {
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        brandId: activeBrandForOffers.id,
        nameAr: branchData.nameAr || 'فرع جديد',
        nameEn: branchData.nameEn || branchData.nameAr || 'New Branch',
        address: branchData.address || '',
        phone: branchData.phone || '',
        mapUrl: branchData.mapUrl,
        status: branchData.status || 'active',
        isMainBranch: branchData.isMainBranch || false,
      };
      updateActiveBrandBranches((branches) => {
        if (branchData.isMainBranch) {
          return [...branches.map((b) => ({ ...b, isMainBranch: false })), newBranch];
        }
        return [...branches, newBranch];
      });
    }
  };

  const handleDeleteBranch = (branchId: string) => {
    updateActiveBrandBranches((branches) => branches.filter((b) => b.id !== branchId));
  };

  // Promo Code Operations
  const handleSavePromoCode = (promoData: Partial<PromoCode>) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;

          let currentPromoCodes = [...(b.promoCodes || [])];
          if (currentPromoCodes.length === 0) {
            currentPromoCodes = [
              {
                id: 'promo-1',
                brandId: b.id,
                code: 'SAVE20',
                titleAr: 'خصم 20% للعملاء الجدد',
                usageLocation: 'store_and_website',
                status: 'active',
                publishingScope: 'all_branches',
              },
              {
                id: 'promo-2',
                brandId: b.id,
                code: 'FIRST50',
                titleAr: 'خصم الاشتراك الأول',
                usageLocation: 'website',
                status: 'inactive',
                publishingScope: 'all_branches',
              },
            ];
          }

          if (editingPromoCode) {
            currentPromoCodes = currentPromoCodes.map((pc) =>
              pc.id === editingPromoCode.id ? { ...pc, ...promoData } : pc
            );
          } else {
            const newPromoCode: PromoCode = {
              id: `promo-${Date.now()}`,
              brandId: b.id,
              code: promoData.code || 'SAVE20',
              titleAr: promoData.titleAr || 'خصم جديد',
              titleEn: promoData.titleEn,
              descriptionAr: promoData.descriptionAr,
              descriptionEn: promoData.descriptionEn,
              termsAr: promoData.termsAr,
              termsEn: promoData.termsEn,
              usageLocation: promoData.usageLocation || 'store_and_website',
              status: promoData.status || 'active',
              publishingScope: promoData.publishingScope || 'all_branches',
              branchId: promoData.branchId,
            };
            currentPromoCodes.push(newPromoCode);
          }

          const updatedBrand = { ...b, promoCodes: currentPromoCodes };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = { ...p, brands: updatedBrands };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  const handleDeletePromoCode = (promoCodeId: string) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;

          let currentPromoCodes = b.promoCodes && b.promoCodes.length > 0 ? b.promoCodes : [
            {
              id: 'promo-1',
              brandId: b.id,
              code: 'SAVE20',
              titleAr: 'خصم 20% للعملاء الجدد',
              usageLocation: 'store_and_website' as const,
              status: 'active' as const,
              publishingScope: 'all_branches' as const,
            },
            {
              id: 'promo-2',
              brandId: b.id,
              code: 'FIRST50',
              titleAr: 'خصم الاشتراك الأول',
              usageLocation: 'website' as const,
              status: 'inactive' as const,
              publishingScope: 'all_branches' as const,
            },
          ];

          currentPromoCodes = currentPromoCodes.filter((pc) => pc.id !== promoCodeId);
          const updatedBrand = { ...b, promoCodes: currentPromoCodes };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = { ...p, brands: updatedBrands };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  // Job Operations
  const handleSaveJob = (jobData: Partial<JobPosition>) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;

          let currentJobs = [...(b.jobs || [])];
          if (currentJobs.length === 0) {
            currentJobs = [
              {
                id: 'job-1',
                brandId: b.id,
                titleAr: 'مندوب مبيعات',
                employmentType: 'full_time',
                contactMethods: ['phone'],
                status: 'open',
                publishingScope: 'all_branches',
              },
              {
                id: 'job-2',
                brandId: b.id,
                titleAr: 'مشرف عمليات',
                employmentType: 'part_time',
                contactMethods: ['phone'],
                status: 'closed',
                publishingScope: 'all_branches',
              },
            ];
          }

          if (editingJob) {
            currentJobs = currentJobs.map((j) =>
              j.id === editingJob.id ? { ...j, ...jobData } : j
            );
          } else {
            const newJob: JobPosition = {
              id: `job-${Date.now()}`,
              brandId: b.id,
              titleAr: jobData.titleAr || 'وظيفة جديدة',
              titleEn: jobData.titleEn,
              descriptionAr: jobData.descriptionAr,
              descriptionEn: jobData.descriptionEn,
              employmentType: jobData.employmentType || 'full_time',
              contactMethods: jobData.contactMethods || ['phone'],
              status: jobData.status || 'open',
              publishingScope: jobData.publishingScope || 'all_branches',
              branchIds: jobData.branchIds,
            };
            currentJobs.push(newJob);
          }

          const updatedBrand = { ...b, jobs: currentJobs };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = { ...p, brands: updatedBrands };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  const handleDeleteJob = (jobId: string) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;

          let currentJobs = b.jobs && b.jobs.length > 0 ? b.jobs : [
            {
              id: 'job-1',
              brandId: b.id,
              titleAr: 'مندوب مبيعات',
              employmentType: 'full_time' as const,
              contactMethods: ['phone' as const],
              status: 'open' as const,
              publishingScope: 'all_branches' as const,
            },
            {
              id: 'job-2',
              brandId: b.id,
              titleAr: 'مشرف عمليات',
              employmentType: 'part_time' as const,
              contactMethods: ['phone' as const],
              status: 'closed' as const,
              publishingScope: 'all_branches' as const,
            },
          ];

          currentJobs = currentJobs.filter((j) => j.id !== jobId);
          const updatedBrand = { ...b, jobs: currentJobs };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = { ...p, brands: updatedBrands };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  // Menu Item Operations
  const handleSaveMenuItem = (itemData: Partial<MenuItem>) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;

          let currentMenuItems = [...(b.menuItems || [])];
          if (currentMenuItems.length === 0) {
            currentMenuItems = [
              {
                id: 'menu-1',
                brandId: b.id,
                nameAr: 'خدمة التوصيل السريع',
                category: 'توصيل',
                price: 25,
                unitType: 'count',
                status: 'available',
                publishingScope: 'all_branches',
              },
              {
                id: 'menu-2',
                brandId: b.id,
                nameAr: 'باقة التوصيل الشهرية',
                category: 'باقات',
                price: 199,
                unitType: 'quantity',
                status: 'available',
                publishingScope: 'all_branches',
              },
              {
                id: 'menu-3',
                brandId: b.id,
                nameAr: 'توصيل دولي',
                category: 'توصيل',
                price: 150,
                unitType: 'count',
                status: 'unavailable',
                publishingScope: 'all_branches',
              },
            ];
          }

          if (editingMenuItem) {
            currentMenuItems = currentMenuItems.map((mi) =>
              mi.id === editingMenuItem.id ? { ...mi, ...itemData } : mi
            );
          } else {
            const newMenuItem: MenuItem = {
              id: `menu-${Date.now()}`,
              brandId: b.id,
              nameAr: itemData.nameAr || 'عنصر جديد',
              nameEn: itemData.nameEn,
              category: itemData.category || 'توصيل',
              price: itemData.price || 0,
              imageUrl: itemData.imageUrl,
              unitType: itemData.unitType || 'count',
              status: itemData.status || 'available',
              publishingScope: itemData.publishingScope || 'all_branches',
              branchId: itemData.branchId,
            };
            currentMenuItems.push(newMenuItem);
          }

          const updatedBrand = { ...b, menuItems: currentMenuItems };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = { ...p, brands: updatedBrands };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  const handleDeleteMenuItem = (itemId: string) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        const updatedBrands = (p.brands || []).map((b) => {
          if (b.id !== activeBrandForOffers.id) return b;

          let currentMenuItems = b.menuItems && b.menuItems.length > 0 ? b.menuItems : [
            {
              id: 'menu-1',
              brandId: b.id,
              nameAr: 'خدمة التوصيل السريع',
              category: 'توصيل',
              price: 25,
              unitType: 'count' as const,
              status: 'available' as const,
              publishingScope: 'all_branches' as const,
            },
            {
              id: 'menu-2',
              brandId: b.id,
              nameAr: 'باقة التوصيل الشهرية',
              category: 'باقات',
              price: 199,
              unitType: 'quantity' as const,
              status: 'available' as const,
              publishingScope: 'all_branches' as const,
            },
            {
              id: 'menu-3',
              brandId: b.id,
              nameAr: 'توصيل دولي',
              category: 'توصيل',
              price: 150,
              unitType: 'count' as const,
              status: 'unavailable' as const,
              publishingScope: 'all_branches' as const,
            },
          ];

          const updatedMenuItems = currentMenuItems.filter((mi) => mi.id !== itemId);
          const updatedBrand = { ...b, menuItems: updatedMenuItems };
          setActiveBrandForOffers(updatedBrand);
          return updatedBrand;
        });

        const updatedPartner = { ...p, brands: updatedBrands };
        setSelectedPartnerForBrands(updatedPartner);
        return updatedPartner;
      })
    );
  };

  const handleToggleBranchStatus = (branch: Branch) => {
    const newStatus: BranchStatus = branch.status === 'active' ? 'inactive' : 'active';
    updateActiveBrandBranches((branches) =>
      branches.map((b) => (b.id === branch.id ? { ...b, status: newStatus } : b))
    );
  };

  // If a partner is selected for brands detail view:
  if (selectedPartnerForBrands) {
    return (
      <div className="space-y-6">
        {activeBrandForOffers ? (
          <BrandDetailView
            brand={activeBrandForOffers}
            partnerName={selectedPartnerForBrands.nameAr}
            onBack={() => setActiveBrandForOffers(null)}
            onEditBrand={() => {
              setEditingBrand(activeBrandForOffers);
              setIsAddEditBrandOpen(true);
            }}
            onToggleStatus={() => handleToggleBrandStatus(activeBrandForOffers)}
            onDeleteBrand={() => {
              handleDeleteBrand(activeBrandForOffers);
              setActiveBrandForOffers(null);
            }}
            onAddOffer={() => {
              setEditingOffer(null);
              setIsAddEditOfferOpen(true);
            }}
            onEditOffer={(offer) => {
              setEditingOffer(offer);
              setIsAddEditOfferOpen(true);
            }}
            onDeleteOffer={handleDeleteOffer}
            onAddBranch={() => {
              setEditingBranch(null);
              setIsAddEditBranchOpen(true);
            }}
            onEditBranch={(branch) => {
              setEditingBranch(branch);
              setIsAddEditBranchOpen(true);
            }}
            onDeleteBranch={handleDeleteBranch}
            onToggleBranchStatus={handleToggleBranchStatus}
            onSaveExtraInfo={handleUpdateBrandExtraInfo}
            onAddPromoCode={() => {
              setEditingPromoCode(null);
              setIsAddEditPromoCodeOpen(true);
            }}
            onEditPromoCode={(promoCode) => {
              setEditingPromoCode(promoCode);
              setIsAddEditPromoCodeOpen(true);
            }}
            onDeletePromoCode={handleDeletePromoCode}
            onAddJob={() => {
              setEditingJob(null);
              setIsAddEditJobOpen(true);
            }}
            onEditJob={(job) => {
              setEditingJob(job);
              setIsAddEditJobOpen(true);
            }}
            onDeleteJob={handleDeleteJob}
            onAddMenuItem={() => {
              setEditingMenuItem(null);
              setIsAddEditMenuItemOpen(true);
            }}
            onEditMenuItem={(item) => {
              setEditingMenuItem(item);
              setIsAddEditMenuItemOpen(true);
            }}
            onDeleteMenuItem={handleDeleteMenuItem}
          />
        ) : (
          <PartnerBrandsView
            partner={selectedPartnerForBrands}
            onBack={() => setSelectedPartnerForBrands(null)}
            onAddBrand={() => {
              setEditingBrand(null);
              setIsAddEditBrandOpen(true);
            }}
            onEditBrand={(brand) => {
              setEditingBrand(brand);
              setIsAddEditBrandOpen(true);
            }}
            onManageBrandOffers={(brand) => {
              setActiveBrandForOffers(brand);
            }}
            onDeleteBrand={handleDeleteBrand}
          />
        )}

        {/* Add / Edit Brand Modal */}
        <AddEditBrandModal
          isOpen={isAddEditBrandOpen}
          onClose={() => setIsAddEditBrandOpen(false)}
          onSave={handleSaveBrand}
          partnerName={selectedPartnerForBrands.nameAr}
          editingBrand={editingBrand}
        />

        {/* Add / Edit Offer Modal */}
        <AddEditOfferModal
          isOpen={isAddEditOfferOpen}
          onClose={() => setIsAddEditOfferOpen(false)}
          onSave={handleSaveOffer}
          brandName={activeBrandForOffers?.nameAr || ''}
          editingOffer={editingOffer}
          branches={activeBrandForOffers?.branches || []}
        />

        {/* Add / Edit Branch Modal */}
        <AddEditBranchModal
          isOpen={isAddEditBranchOpen}
          onClose={() => setIsAddEditBranchOpen(false)}
          onSave={handleSaveBranch}
          editingBranch={editingBranch}
        />

        {/* Add / Edit Promo Code Modal */}
        <AddEditPromoCodeModal
          isOpen={isAddEditPromoCodeOpen}
          onClose={() => setIsAddEditPromoCodeOpen(false)}
          onSave={handleSavePromoCode}
          editingPromoCode={editingPromoCode}
          branches={activeBrandForOffers?.branches || []}
        />

        {/* Add / Edit Job Modal */}
        <AddEditJobModal
          isOpen={isAddEditJobOpen}
          onClose={() => setIsAddEditJobOpen(false)}
          onSave={handleSaveJob}
          editingJob={editingJob}
          branches={activeBrandForOffers?.branches || []}
        />

        {/* Add / Edit Menu Item Modal */}
        <AddEditMenuItemModal
          isOpen={isAddEditMenuItemOpen}
          onClose={() => setIsAddEditMenuItemOpen(false)}
          onSave={handleSaveMenuItem}
          editingItem={editingMenuItem}
          branches={activeBrandForOffers?.branches || []}
        />
      </div>
    );
  }

  // Main Partners List View
  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Error Alert Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">{error}</p>
              <p className="text-xs text-rose-600">تعذر الاتصال بـ API الشركاء. الرجاء التأكد من الخادم والرمز التكليفي.</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Top 4 Stat Cards */}
      <PartnerStatsHeader
        totalCount={stats.totalCount}
        activeCount={stats.activeCount}
        pendingCount={stats.pendingCount}
        inactiveCount={stats.inactiveCount}
      />

      {/* Main Table Card Block */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Action Filter Bar */}
        <PartnerFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onAddPartnerClick={() => {
            setEditingPartner(null);
            setIsAddEditPartnerOpen(true);
          }}
        />

        {/* Loading Spinner or Partners Table */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-500 gap-3">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#d83f2a] rounded-full animate-spin" />
            <span className="font-bold text-sm text-slate-700">جاري تحميل بيانات الشركاء من الـ API...</span>
          </div>
        ) : (
          <PartnersTable
            partners={localPartners}
            onViewBrands={(partner) => setSelectedPartnerForBrands(partner)}
            onEditPartner={(partner) => {
              setEditingPartner(partner);
              setIsAddEditPartnerOpen(true);
            }}
            onSuspendPartner={(partner) => setPartnerToSuspend(partner)}
            onManageOffers={(partner) => {
              setSelectedPartnerForBrands(partner);
              if (partner.brands && partner.brands.length > 0) {
                setActiveBrandForOffers(partner.brands[0]);
              }
            }}
            onDeletePartner={(partner) => setPartnerToDelete(partner)}
          />
        )}

        {/* Pagination Bar */}
        {!loading && paginationMeta.total > 0 && (
          <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
            <div>
              <span>عرض </span>
              <span className="font-extrabold text-slate-900">{paginationMeta.from ?? (partners.length > 0 ? 1 : 0)}</span>
              <span> إلى </span>
              <span className="font-extrabold text-slate-900">{paginationMeta.to ?? partners.length}</span>
              <span> من إجمالي </span>
              <span className="font-extrabold text-[#d83f2a]">{paginationMeta.total}</span>
              <span> شريك</span>
            </div>

            {paginationMeta.lastPage > 1 && (
              <div className="flex items-center gap-1.5 dir-ltr">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold"
                >
                  السابق
                </button>

                {/* Page Numbers */}
                {Array.from({ length: paginationMeta.lastPage }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => handlePageChange(pNum)}
                    className={`w-8 h-8 rounded-lg font-extrabold transition ${
                      pNum === page
                        ? 'bg-[#d83f2a] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= paginationMeta.lastPage}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold"
                >
                  التالي
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEditPartnerModal
        isOpen={isAddEditPartnerOpen}
        onClose={() => setIsAddEditPartnerOpen(false)}
        onSave={handleSavePartner}
        editingPartner={editingPartner}
      />

      <SuspendPartnerModal
        isOpen={!!partnerToSuspend}
        onClose={() => setPartnerToSuspend(null)}
        onConfirm={handleConfirmSuspendPartner}
        partner={partnerToSuspend}
      />

      <DeletePartnerModal
        isOpen={!!partnerToDelete}
        onClose={() => setPartnerToDelete(null)}
        onConfirm={handleConfirmDeletePartner}
        partner={partnerToDelete}
      />
    </div>
  );
};
