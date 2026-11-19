import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { isRateLimited } from '@/lib/utils';
import { validateVisitorForm } from '@/lib/visitor-forms';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'visitor-form-client';
  if (isRateLimited('visitor-form:' + ip, 10, 60_000)) {
    return NextResponse.json({ success: false, error: 'Terlalu banyak pengiriman. Tunggu sebentar lalu coba lagi.' }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const result = validateVisitorForm(body);
  if (!result.values) return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  if (typeof body.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id)) {
    return NextResponse.json({ success: false, error: 'ID pengiriman tidak valid. Segarkan halaman dan coba lagi.' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient(true);
    // A retry uses the same ID so an uncertain network response does not duplicate a submission.
    const { error } = await supabase.from('visitor_form_submissions')
      .insert({ id: body.id, ...result.values });
    if (error?.code === '23505') {
      const { data: previous, error: readError } = await supabase.from('visitor_form_submissions')
        .select('visitor_type, full_name, brand_name, product_name, consultation_topic, domicile, age, whatsapp_url, catalog_url')
        .eq('id', body.id).maybeSingle();
      if (readError) throw readError;
      if (!previous || !Object.entries(result.values).every(([key, value]) => previous[key as keyof typeof previous] === value)) {
        return NextResponse.json({ success: false, error: 'Pengiriman sebelumnya sudah tersimpan. Segarkan halaman untuk mengirim data baru.' }, { status: 409 });
      }
    } else if (error) {
      throw error;
    }
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[VISITOR_FORM_SUBMISSION]', error);
    return NextResponse.json({ success: false, error: 'Data belum tersimpan. Silakan coba lagi.' }, { status: 503 });
  }
}
