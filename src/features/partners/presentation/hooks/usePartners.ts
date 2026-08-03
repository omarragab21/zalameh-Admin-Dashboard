import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  const requestVersion = useRef(0);

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
        setPartners(res.partners);
        setPaginationMeta(res.meta);
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

  // Compute live stats from loaded partners or overall data
  const stats: PartnerStats = useMemo(() => {
    const totalCount = paginationMeta.total > 0 ? paginationMeta.total : partners.length;
    const activeCount = partners.filter((p) => p.status === 'active').length;
    const pendingCount = partners.filter((p) => p.status === 'pending').length;
    const inactiveCount = partners.filter((p) => p.status === 'inactive').length;

    return {
      totalCount,
      activeCount,
      pendingCount,
      inactiveCount,
    };
  }, [partners, paginationMeta.total]);

  // Save (Create or Update)
  const handleSavePartner = async (
    payload: CreatePartnerPayload | UpdatePartnerPayload,
    editingPartnerId?: string
  ): Promise<Partner> => {
    if (editingPartnerId) {
      const updated = await repository.updatePartner(editingPartnerId, payload as UpdatePartnerPayload);
      setPartners((prev) => prev.map((p) => (p.id === editingPartnerId ? updated : p)));
      return updated;
    } else {
      const created = await repository.createPartner(payload as CreatePartnerPayload);
      setPartners((prev) => [created, ...prev]);
      setPaginationMeta((prev) => ({ ...prev, total: prev.total + 1 }));
      return created;
    }
  };

  // Suspend / Toggle Status
  const handleToggleStatus = async (partnerId: string, currentStatus: PartnerStatus): Promise<void> => {
    const nextStatus: PartnerStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const updated = await repository.togglePartnerStatus(partnerId, nextStatus);
    setPartners((prev) => prev.map((p) => (p.id === partnerId ? updated : p)));
  };

  // Delete Partner
  const handleDeletePartner = async (partnerId: string): Promise<void> => {
    await repository.deletePartner(partnerId);
    setPartners((prev) => prev.filter((p) => p.id !== partnerId));
    setPaginationMeta((prev) => ({ ...prev, total: Math.max(prev.total - 1, 0) }));
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
    stats,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePerPageChange,
    handleSavePartner,
    handleToggleStatus,
    handleDeletePartner,
    refetch: fetchPartnersData,
  };
}
