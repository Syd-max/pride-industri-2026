import type { PrideRegistration } from '@/types';

export interface PrideVisitorCheckIn {
  id: string;
  visitor_type: 'umum';
  ticket_code: string;
  full_name: string;
  city: string;
  group_size: number;
  checked_in_at: string;
}

// In-memory persistent mock data across API routes for preview and offline demonstration
export const initialSeedData: PrideRegistration[] = [
  {
    id: 'seed-1',
    registration_code: 'PRIDE-DK-20261021-X9K2L1',
    competition_id: 'desain-kemasan',
    full_name: 'Dian Permatasari',
    email: 'dian.permatasari@gmail.com',
    phone: '081223456789',
    address: 'Jl. R.E. Martadinata No. 45, Citarum, Bandung',
    product_name: 'Keripik Tempe Mendoan Oven',
    brand_name: 'Tempe Juara',
    local_ingredients: 'Kedelai lokal non-GMO, rempah daun jeruk',
    ai_used: false,
    status: 'confirmed',
    check_in_status: 'checked_in',
    checked_in_at: '2026-11-27T09:45:00+07:00',
    created_at: '2026-10-22T10:15:00+07:00',
    updated_at: '2026-10-22T10:15:00+07:00',
  },
  {
    id: 'seed-2',
    registration_code: 'PRIDE-VL-20261022-M4P8T2',
    competition_id: 'video-lokal',
    full_name: 'Fikri Aditya Nugraha',
    email: 'fikri.aditya.creative@gmail.com',
    phone: '085721987654',
    instagram_handle: 'fikriaditya.films',
    tiktok_handle: 'fikrimedia_bdg',
    video_category: 'Fesyen',
    video_url: 'https://www.instagram.com/reel/DBa123XYZ',
    status: 'confirmed',
    check_in_status: 'checked_in',
    checked_in_at: '2026-11-27T10:30:00+07:00',
    created_at: '2026-10-23T14:20:00+07:00',
    updated_at: '2026-10-23T14:20:00+07:00',
  },
  {
    id: 'seed-3',
    registration_code: 'PRIDE-DK-20261024-C3B7H9',
    competition_id: 'desain-kemasan',
    full_name: 'Rizky Maulana Putra',
    email: 'rizky.putra.design@gmail.com',
    phone: '081398765432',
    address: 'Jl. Dago Asri No. 12, Coblong, Bandung',
    product_name: 'Minuman Serbuk Jahe Merah & Kolak Instant',
    brand_name: 'HerbaSari Pasundan',
    local_ingredients: 'Jahe merah Garut, gula aren Ciamis',
    ai_used: true,
    status: 'finalist',
    check_in_status: 'not_checked_in',
    created_at: '2026-10-24T16:00:00+07:00',
    updated_at: '2026-10-25T11:00:00+07:00',
  },
  {
    id: 'seed-4',
    registration_code: 'PRIDE-VL-20261025-W1N5Z8',
    competition_id: 'video-lokal',
    full_name: 'Siti Nurhaliza Putri',
    email: 'siti.nurhaliza.kriya@gmail.com',
    phone: '082145678901',
    instagram_handle: 'sitinurhaliza_art',
    tiktok_handle: 'sitikriya_bdg',
    video_category: 'Kriya',
    video_url: '',
    status: 'confirmed',
    check_in_status: 'not_checked_in',
    created_at: '2026-10-25T09:12:00+07:00',
    updated_at: '2026-10-25T09:12:00+07:00',
  },
];

// Global persistent in-memory array across API handler invocations
declare global {
  // eslint-disable-next-line no-var
  var __PRIDE_REGISTRATIONS__: PrideRegistration[] | undefined;
  // eslint-disable-next-line no-var
  var __PRIDE_VISITORS__: PrideVisitorCheckIn[] | undefined;
}

if (!globalThis.__PRIDE_REGISTRATIONS__) {
  globalThis.__PRIDE_REGISTRATIONS__ = [...initialSeedData];
}

if (!globalThis.__PRIDE_VISITORS__) {
  globalThis.__PRIDE_VISITORS__ = [
    {
      id: 'vis-1',
      visitor_type: 'umum',
      ticket_code: 'PRIDE-VISITOR-1024',
      full_name: 'Ahmad Fauzi',
      city: 'Kota Bandung',
      group_size: 2,
      checked_in_at: '2026-11-27T08:30:00+07:00',
    },
    {
      id: 'vis-2',
      visitor_type: 'umum',
      ticket_code: 'PRIDE-VISITOR-1038',
      full_name: 'Dewi Lestari',
      city: 'Kota Cimahi',
      group_size: 1,
      checked_in_at: '2026-11-27T09:15:00+07:00',
    },
  ];
}

export function getSharedRegistrations(): PrideRegistration[] {
  return globalThis.__PRIDE_REGISTRATIONS__ || initialSeedData;
}

export function updateSharedRegistration(
  idOrCode: string,
  updates: Partial<PrideRegistration>
): PrideRegistration | null {
  const list = getSharedRegistrations();
  const target = list.find(
    (item) => item.id === idOrCode || item.registration_code.toUpperCase() === idOrCode.toUpperCase()
  );
  if (target) {
    Object.assign(target, updates);
    return target;
  }
  return null;
}

export function getSharedVisitors(): PrideVisitorCheckIn[] {
  return globalThis.__PRIDE_VISITORS__ || [];
}

export function addSharedVisitor(visitor: Omit<PrideVisitorCheckIn, 'id' | 'ticket_code' | 'checked_in_at'>): PrideVisitorCheckIn {
  const visitors = getSharedVisitors();
  const newVisitor: PrideVisitorCheckIn = {
    id: `vis-${Date.now()}`,
    ticket_code: `PRIDE-VISITOR-${Math.floor(1000 + Math.random() * 9000)}`,
    full_name: visitor.full_name || 'Pengunjung Umum',
    city: visitor.city || 'Kota Bandung',
    group_size: visitor.group_size || 1,
    checked_in_at: new Date().toISOString(),
    visitor_type: 'umum',
  };
  visitors.unshift(newVisitor);
  return newVisitor;
}
