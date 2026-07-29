import React, { useState, useMemo } from 'react';
import type { AdItem, AdFilterPlacement, AdFilterStatus, AdFilterType } from '../types/ad.types';
import { initialAds } from '../data/mockAds';
import { AdsStatsOverview } from '../components/AdsStatsOverview';
import { AdsFilterBar } from '../components/AdsFilterBar';
import { AdsTable } from '../components/AdsTable';
import { AdForm } from '../components/AdForm';
import { AdDetailModal } from '../components/AdDetailModal';
import { DeleteAdModal } from '../components/DeleteAdModal';

export const AdsPage: React.FC = () => {
  const [ads, setAds] = useState<AdItem[]>(initialAds);

  // View state: 'list' | 'form'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [placementFilter, setPlacementFilter] = useState<AdFilterPlacement>('all');
  const [statusFilter, setStatusFilter] = useState<AdFilterStatus>('all');
  const [advertiserTypeFilter, setAdvertiserTypeFilter] = useState<AdFilterType>('all');

  // Active items for editing, viewing, or deleting
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  const [viewingAd, setViewingAd] = useState<AdItem | null>(null);
  const [deletingAd, setDeletingAd] = useState<AdItem | null>(null);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter ads
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      // Placement filter
      if (placementFilter !== 'all') {
        const matchesPlacement = ad.placements.some((p) => p.key === placementFilter);
        if (!matchesPlacement) return false;
      }
      // Status filter
      if (statusFilter !== 'all' && ad.status !== statusFilter) {
        return false;
      }
      // Advertiser type filter
      if (advertiserTypeFilter !== 'all' && ad.advertiserType !== advertiserTypeFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = ad.internalTitle.toLowerCase().includes(q);
        const matchesStore = ad.storeName?.toLowerCase().includes(q);
        const matchesExternal = ad.externalAdvertiserName?.toLowerCase().includes(q);
        return matchesTitle || matchesStore || matchesExternal;
      }
      return true;
    });
  }, [ads, placementFilter, statusFilter, advertiserTypeFilter, searchQuery]);

  // Toggle active switch
  const handleToggleActive = (id: string) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, isActive: !ad.isActive } : ad))
    );
    showToast('تم تحديث حالة التفعيل بنجاح');
  };

  // Open Form for creating
  const handleCreateNew = () => {
    setEditingAd(null);
    setViewMode('form');
  };

  // Open Form for editing
  const handleEdit = (ad: AdItem) => {
    setEditingAd(ad);
    setViewMode('form');
  };

  // Save (Create or Update)
  const handleSaveAd = (adData: Omit<AdItem, 'id' | 'createdAt'> & { id?: string }) => {
    if (adData.id) {
      // Update existing
      setAds((prev) =>
        prev.map((item) =>
          item.id === adData.id
            ? { ...item, ...adData }
            : item
        )
      );
      showToast('تم تعديل الإعلان بنجاح');
    } else {
      // Create new
      const newAd: AdItem = {
        ...adData,
        id: `ad-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAds((prev) => [newAd, ...prev]);
      showToast('تم إضافة الإعلان الجديد بنجاح');
    }
    setViewMode('list');
    setEditingAd(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingAd) {
      setAds((prev) => prev.filter((a) => a.id !== deletingAd.id));
      showToast('تم حذف الإعلان بنجاح');
      setDeletingAd(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 animate-fadeIn text-xs font-bold dir-rtl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {viewMode === 'list' ? (
        <>
          {/* Main Header with "+ إضافة إعلان جديد" Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">إدارة الإعلانات</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                عرض، وتصفية، والتحكم في جميع الإعلانات المضافة في النظام.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#d83f2a] hover:bg-[#c03320] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#d83f2a]/20 transition cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ إضافة إعلان جديد</span>
            </button>
          </div>

          {/* Stats Overview */}
          <AdsStatsOverview ads={ads} />

          {/* Filter Bar */}
          <AdsFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placementFilter={placementFilter}
            onPlacementFilterChange={setPlacementFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            advertiserTypeFilter={advertiserTypeFilter}
            onAdvertiserTypeFilterChange={setAdvertiserTypeFilter}
          />

          {/* Table */}
          <AdsTable
            ads={filteredAds}
            onToggleActive={handleToggleActive}
            onView={(ad) => setViewingAd(ad)}
            onEdit={handleEdit}
            onDelete={(ad) => setDeletingAd(ad)}
          />
        </>
      ) : (
        /* Form View (Add or Edit) */
        <AdForm
          initialData={editingAd}
          onSave={handleSaveAd}
          onCancel={() => {
            setViewMode('list');
            setEditingAd(null);
          }}
        />
      )}

      {/* Modals */}
      <AdDetailModal ad={viewingAd} onClose={() => setViewingAd(null)} />
      <DeleteAdModal
        ad={deletingAd}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingAd(null)}
      />
    </div>
  );
};
