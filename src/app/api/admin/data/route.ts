import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, hasAdminSession } from '@/lib/supabase/server';
import type { PrideRegistration } from '@/types';

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) return fail('Silakan login sebagai admin.', 401);

  try {
    const supabase = createAdminClient();
    const data: PrideRegistration[] = [];
    const pageSize = 500;
    let total: number | null = null;
    for (;;) {
      const { data: page, error, count } = await supabase
        .from('pride_registrations')
        .select('*', data.length === 0 ? { count: 'exact' } : undefined)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(data.length, data.length + pageSize - 1);
      if (error) throw error;
      if (!page.length) break;
      data.push(...page);
      total ??= count;
      if (total !== null && data.length >= total) break;
    }

    const visitors = request.nextUrl.searchParams.get('visitors') === 'true'
      ? data.filter((entry) => entry.competition_id === 'pengunjung-umum').map((entry) => ({
          id: entry.id,
          visitor_type: 'umum',
          ticket_code: entry.registration_code,
          full_name: entry.full_name,
          city: entry.address || entry.phone,
          group_size: 1,
          checked_in_at: entry.checked_in_at,
        }))
      : undefined;

    return NextResponse.json({ success: true, data, visitors }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    console.error('[PRIDE_ADMIN_DATA_FETCH_ERROR]', error);
    return fail('Data peserta belum bisa dimuat. Silakan coba lagi.', 503);
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await hasAdminSession())) return fail('Silakan login sebagai admin.', 401);

  try {
    const { id, status, check_in_status } = await request.json();
    if (
      typeof id !== 'string' || !id || (!status && !check_in_status) ||
      (status && !['pending', 'confirmed', 'finalist', 'disqualified', 'cancelled'].includes(status)) ||
      (check_in_status && !['not_checked_in', 'checked_in'].includes(check_in_status))
    ) {
      return fail('ID atau status peserta tidak valid.', 400);
    }

    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (check_in_status) {
      update.check_in_status = check_in_status;
      update.checked_in_at = check_in_status === 'checked_in' ? new Date().toISOString() : null;
    }

    const { data, error } = await createAdminClient()
      .from('pride_registrations')
      .update(update)
      .eq(isUuid(id) ? 'id' : 'registration_code', id)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) return fail('Data peserta tidak ditemukan.', 404);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PRIDE_ADMIN_DATA_PATCH_ERROR]', error);
    return fail('Gagal memperbarui status data.', 500);
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) return fail('Silakan login sebagai admin.', 401);

  try {
    const id = request.nextUrl.searchParams.get('id') || (await request.json().catch(() => null))?.id;
    if (typeof id !== 'string' || !id) return fail('ID atau kode registrasi wajib disertakan.', 400);

    const supabase = createAdminClient();
    const { data: registration, error: findError } = await supabase
      .from('pride_registrations')
      .select('id')
      .eq(isUuid(id) ? 'id' : 'registration_code', id)
      .maybeSingle();
    if (findError) throw findError;
    if (!registration) return fail('Data peserta tidak ditemukan.', 404);

    const { error: checkInError } = await supabase.from('pride_checkins')
      .delete().eq('registration_id', registration.id);
    if (checkInError) throw checkInError;

    const { data: deleted, error: deleteError } = await supabase.from('pride_registrations')
      .delete().eq('id', registration.id).select('id').maybeSingle();
    if (deleteError) throw deleteError;
    if (!deleted) return fail('Data peserta tidak ditemukan.', 404);
    return NextResponse.json({ success: true, message: 'Data berhasil dihapus secara permanen.' });
  } catch (error) {
    console.error('[PRIDE_ADMIN_DATA_DELETE_ERROR]', error);
    return fail('Terjadi kesalahan sistem saat menghapus data.', 500);
  }
}
