import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Partner,
  PartnerFilterStatus,
  PartnerStats,
  PaginationMeta,
  CreatePartnerPayload,
  UpdatePartnerPayload,
  PartnerStatus,
} from '../../domain/entities/partner.entity';
import { PartnerRepositoryImpl } from '../../data/repositories/partnerRepositoryImpl';

const repository = new PartnerRepositoryImpl();

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<PartnerFilterStatus>('all');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);

  const [overallStats, setOverallStats] = useState<PartnerStats>({
    totalCount: 0,
    activeCount: 0,
    pendingCount: 0,
    inactiveCount: 0,
  });

  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  const requestVersion = useRef(0);

  const fetchOverallStats = useCallback(async () => {
    try {
      const s = await repository.getPartnersStats();
      setOverallStats(s);
    } catch {
      // Keep existing overall stats on error
    }
  }, []);

  useEffect(() => {
    fetchOverallStats();
  }, [fetchOverallStats]);

  const fetchPartnersData = useCallback(async () => {
    const currentVer = ++requestVersion.current;
    setLoading(true);
    setError(null);

    try {
      const res = await repository.getPartnersPage({
        page,
        perPage,
        statusFilter,
        search: searchQuery,
      });

      if (requestVersion.current === currentVer) {
        let displayPartners = res.partners;

        if (statusFilter && statusFilter !== 'all') {
          displayPartners = displayPartners.filter((p) => p.status === statusFilter);
        }

        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          displayPartners = displayPartners.filter(
            (p) =>
              p.nameAr.toLowerCase().includes(q) ||
              p.nameEn.toLowerCase().includes(q) ||
              p.email.toLowerCase().includes(q) ||
              p.phone.toLowerCase().includes(q)
          );
        }

        setPartners(displayPartners);
        setPaginationMeta({
          ...res.meta,
          total: statusFilter !== 'all' || searchQuery.trim() !== '' ? displayPartners.length : res.meta.total,
          from: displayPartners.length > 0 ? 1 : 0,
          to: displayPartners.length,
        });

        if (statusFilter === 'all' && !searchQuery.trim()) {
          const totalCount = res.meta.total > 0 ? res.meta.total : res.partners.length;
          const activeCount = res.partners.filter((p) => p.status === 'active').length;
          const pendingCount = res.partners.filter((p) => p.status === 'pending').length;
          const inactiveCount = res.partners.filter((p) => p.status === 'inactive').length;
          setOverallStats((prev) => ({
            totalCount: totalCount || prev.totalCount,
            activeCount: activeCount || prev.activeCount,
            pendingCount: pendingCount || prev.pendingCount,
            inactiveCount: inactiveCount || prev.inactiveCount,
          }));
        }
      }
    } catch (err: any) {
      if (requestVersion.current === currentVer) {
        setError(err?.message || 'حدث خطأ أثناء تحميل الشركاء');
      }
    } finally {
      if (requestVersion.current === currentVer) {
        setLoading(false);
      }
    }
  }, [page, perPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchPartnersData();
  }, [fetchPartnersData]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleStatusFilterChange = (filter: PartnerFilterStatus) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationMeta.lastPage) {
      setPage(newPage);
    }
  };

  const handlePerPageChange = (size: number) => {
    setPerPage(size);
    setPage(1);
  };

  // Save (Create or Update)
  const handleSavePartner = async (
    payload: CreatePartnerPayload | UpdatePartnerPayload,
    editingPartnerId?: string
  ): Promise<Partner> => {
    if (editingPartnerId) {
      const updated = await repository.updatePartner(editingPartnerId, payload as UpdatePartnerPayload);
      setPartners((prev) => prev.map((p) => (p.id === editingPartnerId ? updated : p)));
      fetchOverallStats();
      return updated;
    } else {
      const created = await repository.createPartner(payload as CreatePartnerPayload);
      setPartners((prev) => [created, ...prev]);
      setPaginationMeta((prev) => ({ ...prev, total: prev.total + 1 }));
      fetchOverallStats();
      return created;
    }
  };

  // Suspend / Toggle Status
  const handleToggleStatus = async (partnerId: string, currentStatus: PartnerStatus, fullPartner?: Partner): Promise<void> => {
    const nextStatus: PartnerStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const targetPartner = fullPartner || partners.find((p) => p.id === partnerId);
    const updated = await repository.togglePartnerStatus(partnerId, nextStatus, targetPartner);
    setPartners((prev) => prev.map((p) => (p.id === partnerId ? updated : p)));
    fetchOverallStats();
  };

  // Delete Partner
  const handleDeletePartner = async (partnerId: string): Promise<void> => {
    await repository.deletePartner(partnerId);
    setPartners((prev) => prev.filter((p) => p.id !== partnerId));
    setPaginationMeta((prev) => ({ ...prev, total: Math.max(prev.total - 1, 0) }));
    fetchOverallStats();
  };

  return {
    partners,
    loading,
    error,
    searchQuery,
    statusFilter,
    page,
    perPage,
    paginationMeta,
    stats: overallStats,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePerPageChange,
    handleSavePartner,
    handleToggleStatus,
    handleDeletePartner,
    refetch: () => {
      fetchPartnersData();
      fetchOverallStats();
    },
  };
}
