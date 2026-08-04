import type {
  Partner,
  PartnerFilterStatus,
  PaginatedPartnersResult,
  PartnerStats,
  CreatePartnerPayload,
  UpdatePartnerPayload,
  PartnerStatus,
} from '../entities/partner.entity';

export interface PartnerRepository {
  /**
   * Fetch a paginated list of partners from API
   */
  getPartnersPage(params?: {
    page?: number;
    perPage?: number;
    statusFilter?: PartnerFilterStatus;
    search?: string;
  }): Promise<PaginatedPartnersResult>;

  /**
   * Fetch all partners for client-side stats calculation or dropdowns
   */
  getPartners(statusFilter?: PartnerFilterStatus): Promise<Partner[]>;

  /**
   * Fetch stats for partners (total, active, pending, inactive)
   */
  getPartnersStats(): Promise<PartnerStats>;

  /**
   * Fetch a single partner by ID
   */
  getPartnerById(id: string): Promise<Partner | null>;

  /**
   * Create a new partner
   */
  createPartner(payload: CreatePartnerPayload): Promise<Partner>;

  /**
   * Update an existing partner
   */
  updatePartner(id: string, payload: UpdatePartnerPayload): Promise<Partner>;

  /**
   * Delete a partner by ID
   */
  deletePartner(id: string): Promise<void>;

  /**
   * Toggle or set status for a partner (active, inactive, pending)
   */
  togglePartnerStatus(id: string, newStatus: PartnerStatus, targetPartner?: Partner): Promise<Partner>;
}
