import type { PartnerRepository } from '../../domain/repositories/partner.repository';
import type {
  Partner,
  PartnerFilterStatus,
  PaginatedPartnersResult,
  PartnerStats,
  CreatePartnerPayload,
  UpdatePartnerPayload,
  PartnerStatus,
} from '../../domain/entities/partner.entity';
import { partnerApiService } from '../api/partnerApiService';

export class PartnerRepositoryImpl implements PartnerRepository {
  async getPartnersPage(params?: {
    page?: number;
    perPage?: number;
    statusFilter?: PartnerFilterStatus;
    search?: string;
  }): Promise<PaginatedPartnersResult> {
    const page = params?.page ?? 1;
    const perPage = params?.perPage ?? 15;
    const search = params?.search;
    const statusFilter = params?.statusFilter ?? 'all';

    const res = await partnerApiService.fetchPartnersPage(page, perPage, search, statusFilter);
    return {
      partners: res.partners,
      meta: res.meta,
    };
  }

  async getPartners(statusFilter?: PartnerFilterStatus): Promise<Partner[]> {
    const res = await partnerApiService.fetchPartnersPage(1, 100, undefined, statusFilter);
    return res.partners;
  }

  async getPartnersStats(): Promise<PartnerStats> {
    const res = await partnerApiService.fetchPartnersPage(1, 200, undefined, 'all');
    const partners = res.partners;

    const totalCount = res.meta.total > 0 ? res.meta.total : partners.length;
    const activeCount = partners.filter((p) => p.status === 'active').length;
    const pendingCount = partners.filter((p) => p.status === 'pending').length;
    const inactiveCount = partners.filter((p) => p.status === 'inactive').length;

    return {
      totalCount,
      activeCount,
      pendingCount,
      inactiveCount,
    };
  }

  async getPartnerById(id: string): Promise<Partner | null> {
    try {
      return await partnerApiService.fetchPartnerById(id);
    } catch {
      return null;
    }
  }

  async createPartner(payload: CreatePartnerPayload): Promise<Partner> {
    return await partnerApiService.createPartner(payload);
  }

  async updatePartner(id: string, payload: UpdatePartnerPayload): Promise<Partner> {
    return await partnerApiService.updatePartner(id, payload);
  }

  async deletePartner(id: string): Promise<void> {
    await partnerApiService.deletePartner(id);
  }

  async togglePartnerStatus(id: string, newStatus: PartnerStatus): Promise<Partner> {
    return await partnerApiService.updatePartner(id, { status: newStatus });
  }
}
