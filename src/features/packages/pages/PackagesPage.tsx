import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Package, PackageFilterStatus } from '../types/package.types';
import { PackageStatsHeader } from '../components/PackageStatsHeader';
import { PackageFilterBar, type PackageFilterDuration } from '../components/PackageFilterBar';
import { PackagesTable } from '../components/PackagesTable';
import { AddEditPackageModal } from '../components/AddEditPackageModal';
import { PackageDetailsModal } from '../components/PackageDetailsModal';
import { packageApiService } from '../../partners/data/api/packageApiService';

export const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PackageFilterStatus>('all');
  const [durationFilter, setDurationFilter] = useState<PackageFilterDuration>('all');
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingPackage, setViewingPackage] = useState<Package | null>(null);

  const loadApiPackages = useCallback(async () => {
    setIsLoadingApi(true);
    setApiError(null);
    try {
      const apiPackages = await packageApiService.fetchManagementPackages();
      setPackages(apiPackages);
    } catch (err: any) {
      setPackages([]);
      setApiError(err?.message || 'تعذر تحميل الباقات من الخادم');
    } finally {
      setIsLoadingApi(false);
    }
  }, []);

  useEffect(() => {
    void loadApiPackages();
  }, [loadApiPackages]);

  // Statistics calculation
  const totalCount = packages.length;
  const activeCount = useMemo(
    () => packages.filter((p) => (p.settings?.status || 'active') === 'active').length,
    [packages]
  );
  const featuredCount = useMemo(
    () => packages.filter((p) => p.settings?.isFeaturedPackage).length,
    [packages]
  );

  // Filtered packages by Status and Search Query (Duration filter controls price display in table)
  const filteredPackages = useMemo(() => {
    return packages.filter((p) => {
      // Status filter
      const pStatus = p.settings?.status || 'active';
      if (statusFilter !== 'all' && pStatus !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAr = p.nameAr.toLowerCase().includes(q);
        const matchesEn = p.nameEn.toLowerCase().includes(q);
        return matchesAr || matchesEn;
      }
      return true;
    });
  }, [packages, statusFilter, searchQuery]);

  // Save Package (Add / Edit)
  const handleSavePackage = async (packageData: Partial<Package>) => {
    setIsLoadingApi(true);
    setApiError(null);
    try {
      if (editingPackage) {
        await packageApiService.updatePackage(editingPackage.id, packageData);
      } else {
        await packageApiService.createPackage(packageData);
      }
      await loadApiPackages();
    } catch (err: any) {
      const message = err?.message || 'تعذر حفظ الباقة';
      setApiError(message);
      throw err;
    } finally {
      setIsLoadingApi(false);
    }
  };

  // Delete Package
  const handleDeletePackage = async (pkg: Package) => {
    if (window.confirm(`هل أنت تأكد من حذف باقة "${pkg.nameAr}"؟`)) {
      setIsLoadingApi(true);
      setApiError(null);
      try {
        await packageApiService.deletePackage(pkg.id);
        await loadApiPackages();
      } catch (err: any) {
        setApiError(err?.message || 'تعذر حذف الباقة');
      } finally {
        setIsLoadingApi(false);
      }
    }
  };

  // Modal Handlers
  const handleViewPackage = (pkg: Package) => {
    setViewingPackage(pkg);
    setIsDetailsOpen(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsAddEditOpen(true);
  };

  const handleAddPackageClick = () => {
    setEditingPackage(null);
    setIsAddEditOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* 1. Top Stats Header (3 Cards) */}
      <PackageStatsHeader
        totalCount={totalCount}
        activeCount={activeCount}
        featuredCount={featuredCount}
      />

      {/* 2. Main Table Block */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col relative">
        {isLoadingApi && (
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#d83f2a]/20 overflow-hidden z-20">
            <div className="h-full bg-[#d83f2a] animate-pulse w-full"></div>
          </div>
        )}

        {apiError && (
          <div className="mx-5 mt-5 flex items-center justify-between gap-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-xs font-bold text-rose-700">{apiError}</p>
            <button
              type="button"
              onClick={() => void loadApiPackages()}
              className="shrink-0 text-xs font-extrabold text-[#d83f2a] hover:text-[#b83220] cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Action Filter Bar */}
        <PackageFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          durationFilter={durationFilter}
          onDurationFilterChange={setDurationFilter}
          onAddPackageClick={handleAddPackageClick}
        />

        {/* Packages Table */}
        <PackagesTable
          packages={filteredPackages}
          activeDurationFilter={durationFilter}
          onViewPackage={handleViewPackage}
          onEditPackage={handleEditPackage}
          onDeletePackage={handleDeletePackage}
        />
      </div>

      {/* Modals */}
      <AddEditPackageModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSavePackage}
        editingPackage={editingPackage}
      />

      <PackageDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        pkg={viewingPackage}
      />
    </div>
  );
};
