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
  logoUrl: string;
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

  // ─── 2. SPONSORED BY (1 Logo) ────────────────────────────────
  {
    id: 'sponsor-braga',
    name: 'Braga City Walk',
    category: 'sponsored-by',
    role: 'Official Sponsor & Venue',
    logoUrl: '/LOGO_BRAGA_CITYWALK.png',
  },

  // ─── 3. SUPPORT BY (3 Logo) ──────────────────────────────────
  {
    id: 'support-akademi-umkm',
    name: 'Akademi UMKM',
    category: 'support-by',
    role: 'Akademi UMKM',
    logoUrl: '/LOGO_AKADEMI_UMKM.png',
  },
  {
    id: 'support-bank-bjb',
    name: 'Bank BJB',
    category: 'support-by',
    role: 'Bank BJB',
    logoUrl: '/LOGO_BANK_BJB.png',
  },
  {
    id: 'support-tactlink',
    name: 'Tactlink',
    category: 'support-by',
    role: 'Tactlink Smart Digital Directory',
    logoUrl: '/LOGO_TACTLINK_CROPPED.png',
  },

  // ─── 4. PARTNERSHIP BY (2 Logo) ──────────────────────────────
  {
    id: 'partner-gajiya',
    name: 'Gajiya by JOOB',
    category: 'partnership-by',
    role: 'Gajiya by JOOB',
    logoUrl: '/LOGO_GAJIYA.png',
  },
  {
    id: 'partner-perintis-berdaya',
    name: 'Perintis Berdaya',
    category: 'partnership-by',
    role: 'Perintis Berdaya',
    logoUrl: '/LOGO_PERINTIS_BERDAYA.png',
  },
];
