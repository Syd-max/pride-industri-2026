// ─── Competition & Registration Types ───────────────────────────────────────

export type CompetitionSlug = 'desain-kemasan' | 'video-lokal';

export type RegistrationStatus =
  | 'pending'
  | 'confirmed'
  | 'finalist'
  | 'disqualified'
  | 'cancelled';

export type CheckInStatus = 'not_checked_in' | 'checked_in';

export interface PrideRegistration {
  id: string;
  registration_code: string;
  competition_id: CompetitionSlug;
  full_name: string;
  email: string;
  phone: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  // Desain Kemasan specific
  product_name?: string;
  brand_name?: string;
  address?: string;
  local_ingredients?: string;
  ai_used?: boolean;
  // Video Lokal specific
  institution?: string;
  video_category?: string;
  video_title?: string;
  video_description?: string;
  platform_instagram?: boolean;
  platform_tiktok?: boolean;
  video_url?: string;
  instagram_video_url?: string;
  tiktok_video_url?: string;
  pakta_integritas_file_name?: string;
  surat_persetujuan_file_name?: string;
  declaration_original?: boolean;
  declaration_secondary?: boolean;
  declaration_terms?: boolean;
  declaration_usage_rights?: boolean;
  // Common
  status: RegistrationStatus;
  check_in_status: CheckInStatus;
  checked_in_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PrideCheckIn {
  id: string;
  registration_id: string;
  gate_token_id: string;
  checked_in_at: string;
  source: 'qr_scan' | 'manual_admin';
  created_at: string;
}

export interface PrideGateToken {
  id: string;
  token: string;
  label: string;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  created_at: string;
}

// ─── Form Types ──────────────────────────────────────────────────────────────

export interface DesainKemasanFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  product_name: string;
  brand_name: string;
  local_ingredients: string;
  ai_used: boolean;
  declaration_original: boolean;
  declaration_unpublished: boolean;
  declaration_terms: boolean;
}

export interface VideoLokalFormData {
  full_name: string;
  institution: string;
  phone: string;
  email: string;
  video_category: string;
  video_title: string;
  video_description: string;
  platform_instagram: boolean;
  platform_tiktok: boolean;
  instagram_handle: string;
  tiktok_handle: string;
  instagram_video_url: string;
  tiktok_video_url: string;
  video_url?: string;
  declaration_original: boolean;
  declaration_terms: boolean;
  declaration_usage_rights: boolean;
  declaration_public_account?: boolean;
  pakta_integritas_name?: string;
  surat_persetujuan_name?: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface RegistrationSuccessData {
  registration_code: string;
  full_name: string;
  competition_id: CompetitionSlug;
  email: string;
}

export interface CheckInSuccessData {
  registration_code: string;
  full_name: string;
  competition_id: CompetitionSlug;
  checked_in_at: string;
}

// ─── Admin Types ──────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  total_registrations: number;
  desain_kemasan_count: number;
  video_lokal_count: number;
  checked_in_count: number;
  not_checked_in_count: number;
  recent_registrations: PrideRegistration[];
  recent_checkins: PrideCheckIn[];
}

// ─── Countdown Types ─────────────────────────────────────────────────────────

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type EventState = 'upcoming' | 'live' | 'ended';
