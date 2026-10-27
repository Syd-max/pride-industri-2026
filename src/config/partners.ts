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
    id: 'created-rrd',
    name: 'RRD Organizer',
    category: 'created-by',
    role: 'PT Rahman Ramadhan Diandra',
    logoUrl: '/LOGO_RRD_ORGANIZER.png',
  },

  // ─── 2. SPONSORED BY (2 Logo) ────────────────────────────────
  {
    id: 'sponsor-braga',
    name: 'Braga City Walk',
    category: 'sponsored-by',
    role: 'Official Sponsor & Venue',
    logoUrl: '/LOGO_BRAGA_CITYWALK.png',
    website: 'https://bragacitywalk.co.id',
  },
  {
    id: 'sponsor-02',
    name: 'Official Sponsor 02',
    category: 'sponsored-by',
    role: 'Official Industry Sponsor',
    isPlaceholder: true,
  },

  // ─── 3. SUPPORT BY (3 Logo) ──────────────────────────────────
  {
    id: 'support-disdagin',
    name: 'Disdagin Kota Bandung',
    category: 'support-by',
    role: 'Pemerintah Kota Bandung',
    logoUrl: '/LOGOS_GOV_DISDAGIN_KEMILAU_CROPPED.png',
    website: 'https://disdagin.bandung.go.id',
  },
  {
    id: 'support-nxg',
    name: 'NXG Institute',
    category: 'support-by',
    role: 'Edukasi & Riset Digital',
    logoUrl: '/LOGO_NXG_INSTITUTE.png',
  },
  {
    id: 'support-dekranasda',
    name: 'Dekranasda Kota Bandung',
    category: 'support-by',
    role: 'Dewan Kerajinan Nasional Daerah',
    isPlaceholder: true,
  },

  // ─── 4. PARTNERSHIP BY (2 Logo) ──────────────────────────────
  {
    id: 'partner-tactlink',
    name: 'Tactlink',
    category: 'partnership-by',
    role: 'Official Verification & Platform',
    logoUrl: '/LOGO_TACTLINK_CROPPED.png',
    website: 'https://tactlink.id',
  },
  {
    id: 'partner-media',
    name: 'Official Media Partner',
    category: 'partnership-by',
    role: 'Liputan Nasional & Lokal',
    isPlaceholder: true,
  },
];
