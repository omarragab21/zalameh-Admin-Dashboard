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
import { DeleteBrandModal } from '../components/DeleteBrandModal';

import { usePartners } from '../presentation/hooks/usePartners';
import { brandApiService } from '../data/api/brandApiService';
import { partnerApiService } from '../data/api/partnerApiService';
import {
  MOCK_DEFAULT_BRANCHES,
  MOCK_DEFAULT_OFFERS,
  MOCK_DEFAULT_PROMO_CODES,
  MOCK_DEFAULT_JOBS,
  MOCK_DEFAULT_MENU_ITEMS,
} from '../data/mockBrandDetailsData';

const ensureBrandMockData = (b?: Brand | null): Brand => {
  if (!b) {
    return {
      id: 'brand-fallback',
      partnerId: '',
      nameAr: 'علامة تجارية',
      nameEn: 'Brand',
      descriptionAr: '',
      descriptionEn: '',
      categoryId: '',
      categoryName: 'عام',
      status: 'active',
      isFeatured: false,
      offersCount: MOCK_DEFAULT_OFFERS.length,
      branches: MOCK_DEFAULT_BRANCHES,
      offers: MOCK_DEFAULT_OFFERS,
      promoCodes: MOCK_DEFAULT_PROMO_CODES,
      jobs: MOCK_DEFAULT_JOBS,
      menuItems: MOCK_DEFAULT_MENU_ITEMS,
    };
  }
  const brandId = b.id || 'brand-fallback';
  return {
    ...b,
    id: brandId,
    nameAr: b.nameAr || 'علامة تجارية',
    nameEn: b.nameEn || 'Brand',
    branches: Array.isArray(b.branches) && b.branches.length > 0 ? b.branches : MOCK_DEFAULT_BRANCHES.map((br) => ({ ...br, brandId })),
    offers: Array.isArray(b.offers) && b.offers.length > 0 ? b.offers : MOCK_DEFAULT_OFFERS.map((o) => ({ ...o, brandId })),
    promoCodes: Array.isArray(b.promoCodes) && b.promoCodes.length > 0 ? b.promoCodes : MOCK_DEFAULT_PROMO_CODES.map((p) => ({ ...p, brandId })),
    jobs: Array.isArray(b.jobs) && b.jobs.length > 0 ? b.jobs : MOCK_DEFAULT_JOBS.map((j) => ({ ...j, brandId })),
    menuItems: Array.isArray(b.menuItems) && b.menuItems.length > 0 ? b.menuItems : MOCK_DEFAULT_MENU_ITEMS.map((m) => ({ ...m, brandId })),
  };
};

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
  const [isFetchingPartnerDetail, setIsFetchingPartnerDetail] = useState(false);

  useEffect(() => {
    if (!selectedPartnerForBrands?.id) return;
    const partnerId = selectedPartnerForBrands.id;
    setIsFetchingPartnerDetail(true);
    partnerApiService
      .fetchPartnerById(partnerId)
      .then((partnerDetail) => {
        const fetchedBrands = partnerDetail.brands || [];
        const updatedPartner = {
          ...partnerDetail,
          brands: fetchedBrands,
          brandsCount: fetchedBrands.length,
        };

        setSelectedPartnerForBrands((prev) =>
          prev && prev.id === partnerId ? { ...prev, ...updatedPartner } : prev
        );
        setLocalPartners((prev) =>
          prev.map((p) => (p.id === partnerId ? { ...p, ...updatedPartner } : p))
        );

        setActiveBrandForOffers((prevActive) => {
          if (!prevActive) return null;
          const matching = fetchedBrands.find((b) => b.id === prevActive.id);
          return matching || prevActive;
        });
      })
      .catch((err) => {
        console.error('Failed to fetch partner details:', err);
      })
      .finally(() => {
        setIsFetchingPartnerDetail(false);
      });
  }, [selectedPartnerForBrands?.id]);

  // Modals state
  const [isAddEditPartnerOpen, setIsAddEditPartnerOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const [partnerToSuspend, setPartnerToSuspend] = useState<Partner | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);

  // Brand Modals state
  const [isAddEditBrandOpen, setIsAddEditBrandOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

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
      await toggleStatusInApi(partnerToSuspend.id, partnerToSuspend.status, partnerToSuspend);
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

  // Helper to update active brand across state
  const updateActiveBrand = (updater: (prevBrand: Brand) => Brand) => {
    if (!selectedPartnerForBrands || !activeBrandForOffers) return;

    const nextBrand = updater(activeBrandForOffers);
    setActiveBrandForOffers(nextBrand);

    setSelectedPartnerForBrands((prevPartner) => {
      if (!prevPartner) return null;
      const updatedBrands = (prevPartner.brands || []).map((b) =>
        b.id === nextBrand.id ? nextBrand : b
      );
      return {
        ...prevPartner,
        brands: updatedBrands,
      };
    });

    setLocalPartners((prevPartners) =>
      prevPartners.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;
        const updatedBrands = (p.brands || []).map((b) =>
          b.id === nextBrand.id ? nextBrand : b
        );
        return {
          ...p,
          brands: updatedBrands,
        };
      })
    );
  };

  // Brand Operations
  const handleSaveBrand = async (brandData: Partial<Brand>) => {
    if (!selectedPartnerForBrands) return;

    let savedBrand: Brand;
    if (editingBrand) {
      savedBrand = await brandApiService.updateBrand(editingBrand.id, {
        ...brandData,
        partnerId: selectedPartnerForBrands.id,
      });
    } else {
      savedBrand = await brandApiService.createBrand({
        ...brandData,
        partnerId: selectedPartnerForBrands.id,
      });
    }

    setSelectedPartnerForBrands((prev) => {
      if (!prev) return null;
      let currentBrands = [...(prev.brands || [])];
      if (editingBrand) {
        currentBrands = currentBrands.map((b) => (b.id === editingBrand.id ? savedBrand : b));
      } else {
        currentBrands.unshift(savedBrand);
      }
      return {
        ...prev,
        brands: currentBrands,
        brandsCount: currentBrands.length,
      };
    });

    setLocalPartners((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPartnerForBrands.id) return p;

        let currentBrands = [...(p.brands || [])];
        if (editingBrand) {
          currentBrands = currentBrands.map((b) => (b.id === editingBrand.id ? savedBrand : b));
        } else {
          currentBrands.unshift(savedBrand);
        }

        return {
          ...p,
          brands: currentBrands,
          brandsCount: currentBrands.length,
        };
      })
    );

    if (activeBrandForOffers && (editingBrand?.id === activeBrandForOffers.id || activeBrandForOffers.id === savedBrand.id)) {
      setActiveBrandForOffers(savedBrand);
    }

    setIsAddEditBrandOpen(false);
    setEditingBrand(null);
  };

  // Delete Brand
  const handleDeleteBrand = (brand: Brand) => {
    setBrandToDelete(brand);
  };

  const handleConfirmDeleteBrand = async () => {
    if (!selectedPartnerForBrands || !brandToDelete) return;

    try {
      await brandApiService.deleteBrand(brandToDelete.id);
      setSelectedPartnerForBrands((prev) => {
        if (!prev) return null;
        const updatedBrands = (prev.brands || []).filter((b) => b.id !== brandToDelete.id);
        return {
          ...prev,
          brands: updatedBrands,
          brandsCount: updatedBrands.length,
        };
      });

      setLocalPartners((prev) =>
        prev.map((p) => {
          if (p.id !== selectedPartnerForBrands.id) return p;
          const updatedBrands = (p.brands || []).filter((b) => b.id !== brandToDelete.id);
          return {
            ...p,
            brands: updatedBrands,
            brandsCount: updatedBrands.length,
          };
        })
      );

      if (activeBrandForOffers?.id === brandToDelete.id) {
        setActiveBrandForOffers(null);
      }
    } catch (err: any) {
      alert(err?.message || 'حدث خطأ أثناء حذف العلامة التجارية من السيرفر');
      throw err;
    } finally {
      setBrandToDelete(null);
    }
  };

  // Toggle Brand Status (from detail view)
  const handleToggleBrandStatus = async (brand: Brand) => {
    if (!selectedPartnerForBrands) return;
    const newStatus: BrandStatus = brand.status === 'active' ? 'inactive' : 'active';
    try {
      const updatedBrand = await brandApiService.updateBrand(brand.id, {
        status: newStatus,
        partnerId: selectedPartnerForBrands.id,
      });

      setSelectedPartnerForBrands((prev) => {
        if (!prev) return null;
        const updatedBrands = (prev.brands || []).map((b) =>
          b.id === brand.id ? updatedBrand : b
        );
        return { ...prev, brands: updatedBrands };
      });

      setLocalPartners((prev) =>
        prev.map((p) => {
          if (p.id !== selectedPartnerForBrands.id) return p;
          const updatedBrands = (p.brands || []).map((b) =>
            b.id === brand.id ? updatedBrand : b
          );
          return { ...p, brands: updatedBrands };
        })
      );

      if (activeBrandForOffers?.id === brand.id) {
        setActiveBrandForOffers(updatedBrand);
      }
    } catch (err: any) {
      alert(err?.message || 'فشل تغيير حالة العلامة التجارية');
    }
  };

  // Update Brand Extra Info
  const handleUpdateBrandExtraInfo = (extraInfo: BrandExtraInfo) => {
    updateActiveBrand((brand) => ({ ...brand, extraInfo }));
  };

  // Offer Operations
  const handleSaveOffer = (offerData: Partial<Offer>) => {
    updateActiveBrand((brand) => {
      let currentOffers = [...(brand.offers || [])];
      if (editingOffer) {
        currentOffers = currentOffers.map((o) =>
          o.id === editingOffer.id ? { ...o, ...offerData } : o
        );
      } else {
        const newOffer: Offer = {
          id: `offer-${Date.now()}`,
          brandId: brand.id,
          titleAr: offerData.titleAr || 'عرض جديد',
          titleEn: offerData.titleEn || 'New Offer',
          descriptionAr: offerData.descriptionAr,
          descriptionEn: offerData.descriptionEn,
          imageUrl: offerData.imageUrl,
          branchIds: offerData.branchIds,
          publishingScope: offerData.publishingScope,
          startDate: offerData.startDate,
          endDate: offerData.endDate,
          status: offerData.status || 'active',
          contactMethods: offerData.contactMethods,
          contactDetails: offerData.contactDetails,
        };
        currentOffers.push(newOffer);
      }
      return {
        ...brand,
        offers: currentOffers,
        offersCount: currentOffers.length,
      };
    });
  };

  // Delete Offer
  const handleDeleteOffer = (offerId: string) => {
    updateActiveBrand((brand) => {
      const updatedOffers = (brand.offers || []).filter((o) => o.id !== offerId);
      return {
        ...brand,
        offers: updatedOffers,
        offersCount: updatedOffers.length,
      };
    });
  };

  // Branch Operations
  const handleSaveBranch = (branchData: Partial<Branch>) => {
    updateActiveBrand((brand) => {
      let currentBranches = [...(brand.branches || [])];
      if (editingBranch) {
        currentBranches = currentBranches.map((b) => {
          if (b.id === editingBranch.id) {
            return { ...b, ...branchData };
          }
          return branchData.isMainBranch ? { ...b, isMainBranch: false } : b;
        });
      } else {
        const newBranch: Branch = {
          id: `branch-${Date.now()}`,
          brandId: brand.id,
          nameAr: branchData.nameAr || 'فرع جديد',
          nameEn: branchData.nameEn || branchData.nameAr || 'New Branch',
          address: branchData.address || '',
          phone: branchData.phone || '',
          mapUrl: branchData.mapUrl,
          status: branchData.status || 'active',
          isMainBranch: branchData.isMainBranch || false,
        };
        if (branchData.isMainBranch) {
          currentBranches = [...currentBranches.map((b) => ({ ...b, isMainBranch: false })), newBranch];
        } else {
          currentBranches = [...currentBranches, newBranch];
        }
      }
      return {
        ...brand,
        branches: currentBranches,
      };
    });
  };

  const handleDeleteBranch = (branchId: string) => {
    updateActiveBrand((brand) => ({
      ...brand,
      branches: (brand.branches || []).filter((b) => b.id !== branchId),
    }));
  };

  const handleToggleBranchStatus = (branch: Branch) => {
    const newStatus: BranchStatus = branch.status === 'active' ? 'inactive' : 'active';
    updateActiveBrand((brand) => ({
      ...brand,
      branches: (brand.branches || []).map((b) =>
        b.id === branch.id ? { ...b, status: newStatus } : b
      ),
    }));
  };

  // Promo Code Operations
  const handleSavePromoCode = (promoData: Partial<PromoCode>) => {
    updateActiveBrand((brand) => {
      let currentPromoCodes = [...(brand.promoCodes || [])];
      if (editingPromoCode) {
        currentPromoCodes = currentPromoCodes.map((pc) =>
          pc.id === editingPromoCode.id ? { ...pc, ...promoData } : pc
        );
      } else {
        const newPromoCode: PromoCode = {
          id: `promo-${Date.now()}`,
          brandId: brand.id,
          code: promoData.code || 'SAVE20',
          titleAr: promoData.titleAr || 'خصم جديد',
          titleEn: promoData.titleEn,
          descriptionAr: promoData.descriptionAr,
          descriptionEn: promoData.descriptionEn,
          termsAr: promoData.termsAr,
          termsEn: promoData.termsEn,
          usageLocation: promoData.usageLocation || 'store_and_website',
          startDate: promoData.startDate,
          endDate: promoData.endDate,
          status: promoData.status || 'active',
          publishingScope: promoData.publishingScope || 'all_branches',
          branchId: promoData.branchId,
        };
        currentPromoCodes.push(newPromoCode);
      }
      return { ...brand, promoCodes: currentPromoCodes };
    });
  };

  const handleDeletePromoCode = (promoCodeId: string) => {
    updateActiveBrand((brand) => ({
      ...brand,
      promoCodes: (brand.promoCodes || []).filter((pc) => pc.id !== promoCodeId),
    }));
  };

  // Job Operations
  const handleSaveJob = (jobData: Partial<JobPosition>) => {
    updateActiveBrand((brand) => {
      let currentJobs = [...(brand.jobs || [])];
      if (editingJob) {
        currentJobs = currentJobs.map((j) =>
          j.id === editingJob.id ? { ...j, ...jobData } : j
        );
      } else {
        const newJob: JobPosition = {
          id: `job-${Date.now()}`,
          brandId: brand.id,
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
      return { ...brand, jobs: currentJobs };
    });
  };

  const handleDeleteJob = (jobId: string) => {
    updateActiveBrand((brand) => ({
      ...brand,
      jobs: (brand.jobs || []).filter((j) => j.id !== jobId),
    }));
  };

  // Menu Item Operations
  const handleSaveMenuItem = (itemData: Partial<MenuItem>) => {
    updateActiveBrand((brand) => {
      let currentMenuItems = [...(brand.menuItems || [])];
      if (editingMenuItem) {
        currentMenuItems = currentMenuItems.map((mi) =>
          mi.id === editingMenuItem.id ? { ...mi, ...itemData } : mi
        );
      } else {
        const newMenuItem: MenuItem = {
          id: `menu-${Date.now()}`,
          brandId: brand.id,
          nameAr: itemData.nameAr || 'عنصر جديد',
          nameEn: itemData.nameEn,
          category: itemData.category || 'توصيل',
          categoryEn: itemData.categoryEn,
          descriptionAr: itemData.descriptionAr,
          descriptionEn: itemData.descriptionEn,
          price: itemData.price || 0,
          imageUrl: itemData.imageUrl,
          unitType: itemData.unitType || 'count',
          status: itemData.status || 'available',
          publishingScope: itemData.publishingScope || 'all_branches',
          branchId: itemData.branchId,
          branchIds: itemData.branchIds,
        };
        currentMenuItems.push(newMenuItem);
      }
      return { ...brand, menuItems: currentMenuItems };
    });
  };

  const handleDeleteMenuItem = (itemId: string) => {
    updateActiveBrand((brand) => ({
      ...brand,
      menuItems: (brand.menuItems || []).filter((mi) => mi.id !== itemId),
    }));
  };

  // If a partner is selected for brands detail view:
  if (selectedPartnerForBrands) {
    if (isFetchingPartnerDetail) {
      return (
        <div className="space-y-6 animate-fadeIn" dir="rtl">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#d83f2a] rounded-full animate-spin mb-4" />
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              جاري تحميل بيانات الشريك والعلامات التجارية...
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              يتم استدعاء الـ API لجلب التفاصيل الخاصة بـ <span className="font-bold text-slate-700">{selectedPartnerForBrands.nameAr}</span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {activeBrandForOffers ? (
          <BrandDetailView
            brand={activeBrandForOffers}
            partnerName={selectedPartnerForBrands.nameAr}
            onBack={() => setActiveBrandForOffers(null)}
            onBackToPartnersList={() => {
              setActiveBrandForOffers(null);
              setSelectedPartnerForBrands(null);
            }}
            onEditBrand={() => {
              setEditingBrand(activeBrandForOffers);
              setIsAddEditBrandOpen(true);
            }}
            onToggleStatus={() => handleToggleBrandStatus(activeBrandForOffers)}
            onDeleteBrand={() => handleDeleteBrand(activeBrandForOffers)}
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
              setActiveBrandForOffers(ensureBrandMockData(brand));
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

        {/* Delete Brand Modal */}
        <DeleteBrandModal
          isOpen={!!brandToDelete}
          onClose={() => setBrandToDelete(null)}
          onConfirm={handleConfirmDeleteBrand}
          brand={brandToDelete}
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
                setActiveBrandForOffers(ensureBrandMockData(partner.brands[0]));
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

      <DeleteBrandModal
        isOpen={!!brandToDelete}
        onClose={() => setBrandToDelete(null)}
        onConfirm={handleConfirmDeleteBrand}
        brand={brandToDelete}
      />
    </div>
  );
};
