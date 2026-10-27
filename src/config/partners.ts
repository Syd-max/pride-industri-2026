export type PartnerCategory = 'all' | 'created-by' | 'sponsored-by' | 'support-by' | 'partnership-by';

export interface PartnerCategoryInfo {
  id: PartnerCategory;
  title: string;
  badgeLabel: string;
  description: string;
  accentColor: string;
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
    title: 'Created By',
    badgeLabel: 'Penyelenggara Resmi',
    description: 'Inisiasi dan penyelenggaraan resmi festival oleh pemerintah dan dinas terkait.',
    accentColor: 'blue',
  },
  {
    id: 'sponsored-by',
    title: 'Sponsored By',
    badgeLabel: 'Sponsor Resmi',
    description: 'Mitra sponsor utama dan akselerator kemajuan industri kreatif Kota Bandung.',
    accentColor: 'amber',
  },
  {
    id: 'support-by',
    title: 'Support By',
    badgeLabel: 'Didukung Oleh',
    description: 'Fasilitator tempat, ekosistem pembinaan industri, dan komunitas kreatif.',
    accentColor: 'emerald',
  },
  {
    id: 'partnership-by',
    title: 'Partnership By',
    badgeLabel: 'Mitra & Kolaborasi',
    description: 'Mitra strategis verifikasi, media publikasi, dan jejaring kolaborator.',
    accentColor: 'purple',
  },
];

export const PARTNERS_DATA: PartnerItem[] = [
  // ─── 1. CREATED BY ───────────────────────────────────────────
  {
    id: 'created-disdagin',
    name: 'Disdagin Kota Bandung',
    category: 'created-by',
    role: 'Penyelenggara Utama',
    logoUrl: '/LOGOS_GOV_DISDAGIN_KEMILAU_CROPPED.png',
    website: 'https://disdagin.bandung.go.id',
    tag: 'Official Host',
  },
  {
    id: 'created-pemkot',
    name: 'Pemerintah Kota Bandung',
    category: 'created-by',
    role: 'Pemerintah Daerah',
    logoUrl: '/LOGOS_GOV_DISDAGIN_KEMILAU_CROPPED.png',
    website: 'https://bandung.go.id',
    tag: 'Government',
  },
  {
    id: 'created-rumah-kemasan',
    name: 'Rumah Kemasan Disdagin',
    category: 'created-by',
    role: 'Inisiator Kompetisi Kemasan',
    isPlaceholder: true,
    tag: 'Fasilitasi IKM',
  },
  {
    id: 'created-slot-extra',
    name: 'Penyelenggara / Co-Host',
    category: 'created-by',
    role: 'Slot Penyelenggara',
    isPlaceholder: true,
    tag: 'Slot Siap',
  },

  // ─── 2. SPONSORED BY ─────────────────────────────────────────
  {
    id: 'sponsor-platinum',
    name: 'Platinum Sponsor',
    category: 'sponsored-by',
    role: 'Main Corporate Partner',
    isPlaceholder: true,
    tag: 'Platinum Tier',
  },
  {
    id: 'sponsor-gold-1',
    name: 'Gold Sponsor 01',
    category: 'sponsored-by',
    role: 'Official Industry Sponsor',
    isPlaceholder: true,
    tag: 'Gold Tier',
  },
  {
    id: 'sponsor-gold-2',
    name: 'Gold Sponsor 02',
    category: 'sponsored-by',
    role: 'Official Financial Sponsor',
    isPlaceholder: true,
    tag: 'Gold Tier',
  },
  {
    id: 'sponsor-silver',
    name: 'Silver Sponsor',
    category: 'sponsored-by',
    role: 'Supporting Sponsor',
    isPlaceholder: true,
    tag: 'Silver Tier',
  },

  // ─── 3. SUPPORT BY ───────────────────────────────────────────
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
  {
    id: 'support-creative-hub',
    name: 'Bandung Creative Hub',
    category: 'support-by',
    role: 'Dukungan Fasilitas Kreatif',
    isPlaceholder: true,
    tag: 'Creative Ecosystem',
  },

  // ─── 4. PARTNERSHIP BY ───────────────────────────────────────
  {
    id: 'partner-tactlink',
    name: 'Tactlink',
    category: 'partnership-by',
    role: 'Official Verification & Platform',
    logoUrl: '/LOGO_TACTLINK_CROPPED.png',
    website: 'https://tactlink.id',
    tag: 'Tech & Verification',
  },
  {
    id: 'partner-media-1',
    name: 'Official Media Partner',
    category: 'partnership-by',
    role: 'Liputan Nasional & Lokal',
    isPlaceholder: true,
    tag: 'Media Partner',
  },
  {
    id: 'partner-broadcast',
    name: 'Radio & Broadcast Network',
    category: 'partnership-by',
    role: 'Publikasi Media Siar',
    isPlaceholder: true,
    tag: 'Broadcast',
  },
  {
    id: 'partner-community',
    name: 'Creative Community Network',
    category: 'partnership-by',
    role: 'Kolaborasi Komunitas Desain & Video',
    isPlaceholder: true,
    tag: 'Community',
  },
];
