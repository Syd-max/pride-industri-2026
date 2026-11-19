import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, hasAdminSession } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: 'Silakan login sebagai admin.' }, { status: 401 });
  }
  const type = request.nextUrl.searchParams.get('type');
  const page = Number(request.nextUrl.searchParams.get('page') ?? 0);
  if ((type !== 'booth' && type !== 'umum') || !Number.isSafeInteger(page) || page < 0 || page > 100000) {
    return NextResponse.json({ success: false, error: 'Halaman atau jenis visitor tidak valid.' }, { status: 400 });
  }
  try {
    const { data, count, error, status } = await createAdminClient(true).from('visitor_form_submissions')
      .select('*', { count: 'exact' }).eq('visitor_type', type)
      .order('created_at', { ascending: false }).order('id', { ascending: false })
      .range(page * 20, page * 20 + 19);
    if (status === 416) return NextResponse.json({ success: true, data: [], count: 0 }, { headers: { 'Cache-Control': 'private, no-store' } });
    if (error) throw error;
    return NextResponse.json({ success: true, data, count }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('[VISITOR_FORMS_ADMIN_READ]', error);
    return NextResponse.json({ success: false, error: 'Data visitor belum bisa dimuat. Coba lagi.' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: 'Silakan login sebagai admin.' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ success: false, error: 'ID data visitor tidak valid.' }, { status: 400 });
  }
  try {
    const { error } = await createAdminClient(true).from('visitor_form_submissions').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('[VISITOR_FORMS_ADMIN_DELETE]', error);
    return NextResponse.json({ success: false, error: 'Data visitor belum berhasil dihapus. Coba lagi.' }, { status: 503 });
  }
}
