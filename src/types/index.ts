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
  video_category?: string;
  video_url?: string;
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
  email: string;
  phone: string;
  instagram_handle: string;
  tiktok_handle: string;
  video_category: string;
  video_url?: string;
  declaration_original: boolean;
  declaration_public_account: boolean;
  declaration_terms: boolean;
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
