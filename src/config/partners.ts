export type PartnerCategory = 'all' | 'created-by' | 'sponsored-by' | 'support-by' | 'partnership-by';

export interface PartnerCategoryInfo {
  id: PartnerCategory;
  title: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  category: 'created-by' | 'sponsored-by' | 'support-by' | 'partnership-by';
  role: string;
  logoUrl?: string;
  website?: string;
  isPlaceholder?: boolean;
  tag?: string;
}

export const PARTNER_CATEGORIES: PartnerCategoryInfo[] = [
  {
    id: 'created-by',
    title: 'CREATED BY',
  },
  {
    id: 'sponsored-by',
    title: 'SPONSORED BY',
  },
  {
    id: 'support-by',
    title: 'SUPPORT BY',
  },
  {
    id: 'partnership-by',
    title: 'PARTNERSHIP BY',
  },
];

export const PARTNERS_DATA: PartnerItem[] = [
  // ─── 1. CREATED BY (1 Logo) ──────────────────────────────────
  {
    id: 'created-disdagin',
    name: 'Disdagin Kota Bandung',
    category: 'created-by',
    role: 'Penyelenggara Resmi',
    logoUrl: '/LOGOS_GOV_DISDAGIN_KEMILAU_CROPPED.png',
    website: 'https://disdagin.bandung.go.id',
    tag: 'Official Host',
  },

  // ─── 2. SPONSORED BY (2 Logo) ────────────────────────────────
  {
    id: 'sponsor-01',
    name: 'Official Sponsor 01',
    category: 'sponsored-by',
    role: 'Main Corporate Partner',
    isPlaceholder: true,
    tag: 'Sponsor Slot',
  },
  {
    id: 'sponsor-02',
    name: 'Official Sponsor 02',
    category: 'sponsored-by',
    role: 'Official Industry Partner',
    isPlaceholder: true,
    tag: 'Sponsor Slot',
  },

  // ─── 3. SUPPORT BY (3 Logo) ──────────────────────────────────
  {
    id: 'support-braga-citywalk',
    name: 'Braga City Walk',
    category: 'support-by',
    role: 'Official Venue Host',
    logoUrl: '/LOGO_BRAGA_CITYWALK.png',
    website: 'https://bragacitywalk.co.id',
    tag: 'Venue Partner',
  },
  {
    id: 'support-dekranasda',
    name: 'Dekranasda Kota Bandung',
    category: 'support-by',
    role: 'Dewan Kerajinan Nasional Daerah',
    isPlaceholder: true,
    tag: 'Ekosistem Kriya',
  },
  {
    id: 'support-ikm-hub',
    name: 'Asosiasi IKM Kota Bandung',
    category: 'support-by',
    role: 'Jejaring Pelaku Industri',
    isPlaceholder: true,
    tag: 'Komunitas IKM',
  },

  // ─── 4. PARTNERSHIP BY (2 Logo) ──────────────────────────────
  {
    id: 'partner-tactlink',
    name: 'Tactlink',
    category: 'partnership-by',
    role: 'Official Verification & Platform',
    logoUrl: '/LOGO_TACTLINK_CROPPED.png',
    website: 'https://tactlink.id',
    tag: 'Platform Partner',
  },
  {
    id: 'partner-media',
    name: 'Official Media Partner',
    category: 'partnership-by',
    role: 'Liputan Nasional & Lokal',
    isPlaceholder: true,
    tag: 'Media Partner',
  },
];
