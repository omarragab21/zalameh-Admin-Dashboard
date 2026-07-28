import React, { useState, useMemo } from 'react';
import type { Package, PackageFilterStatus } from '../types/package.types';
import { initialPackages } from '../data/mockPackages';
import { PackageStatsHeader } from '../components/PackageStatsHeader';
import { PackageFilterBar } from '../components/PackageFilterBar';
import { PackagesTable } from '../components/PackagesTable';
import { AddEditPackageModal } from '../components/AddEditPackageModal';
import { PackageDetailsModal } from '../components/PackageDetailsModal';

export const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PackageFilterStatus>('all');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingPackage, setViewingPackage] = useState<Package | null>(null);

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

  // Filtered packages
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
  const handleSavePackage = (packageData: Partial<Package>) => {
    if (editingPackage) {
      setPackages((prev) =>
        prev.map((p) => (p.id === editingPackage.id ? { ...p, ...packageData } as Package : p))
      );
    } else {
      const newPackage: Package = {
        id: `pkg-${Date.now()}`,
        nameAr: packageData.nameAr || 'باقة جديدة',
        nameEn: packageData.nameEn || 'New Package',
        descriptionAr: packageData.descriptionAr,
        descriptionEn: packageData.descriptionEn,
        price: packageData.price ?? 0,
        duration: packageData.duration || 'monthly',
        features: packageData.features || [],
        permissions: packageData.permissions || {},
        settings: packageData.settings || { status: 'active', displayOrder: packages.length + 1 },
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPackages((prev) => [newPackage, ...prev]);
    }
  };

  // Delete Package
  const handleDeletePackage = (pkg: Package) => {
    if (window.confirm(`هل أنت تأكد من حذف باقة "${pkg.nameAr}"؟`)) {
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    }
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
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Action Filter Bar */}
        <PackageFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddPackageClick={() => {
            setEditingPackage(null);
            setIsAddEditOpen(true);
          }}
        />

        {/* Packages Table */}
        <PackagesTable
          packages={filteredPackages}
          onViewPackage={(pkg) => {
            setViewingPackage(pkg);
            setIsDetailsOpen(true);
          }}
          onEditPackage={(pkg) => {
            setEditingPackage(pkg);
            setIsAddEditOpen(true);
          }}
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
