import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { PrideRegistration } from '@/types';

// Mock/Seed registrations if database is empty so organizers immediately have an operational view to inspect
const initialSeedData: PrideRegistration[] = [
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

let globalStore = [...initialSeedData];

export async function GET() {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (hasSupabase) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('pride_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to memory store:', err);
    }
  }

  return NextResponse.json({ success: true, data: globalStore });
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, check_in_status } = await request.json();

    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      try {
        const supabase = createAdminClient();
        const updatePayload: Record<string, unknown> = {};
        if (status) updatePayload.status = status;
        if (check_in_status) {
          updatePayload.check_in_status = check_in_status;
          if (check_in_status === 'checked_in') {
            updatePayload.checked_in_at = new Date().toISOString();
          } else {
            updatePayload.checked_in_at = null;
          }
        }

        const { error } = await supabase
          .from('pride_registrations')
          .update(updatePayload)
          .eq('id', id);

        if (!error) {
          return NextResponse.json({ success: true });
        }
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    // Memory update fallback
    const target = globalStore.find((item) => item.id === id);
    if (target) {
      if (status) target.status = status;
      if (check_in_status) {
        target.check_in_status = check_in_status;
        target.checked_in_at =
          check_in_status === 'checked_in' ? new Date().toISOString() : undefined;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui status data.' },
      { status: 500 }
    );
  }
}
