import { randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { EVENT_CONFIG } from '@/config/event';
import { createAdminClient } from '@/lib/supabase/server';
import { sanitizeString, isRateLimited, formatJakartaDateTime } from '@/lib/utils';

function errorResponse(error: string, code: string, status: number) {
  return NextResponse.json({ success: false, error, code }, { status });
}

export async function POST(request: NextRequest) {
  const now = new Date();
  const { windowStart, windowEnd } = EVENT_CONFIG.checkin;
  if (now < windowStart || now > windowEnd) {
    return errorResponse('Presensi tersedia pada jadwal yang telah ditentukan.', 'CHECK_IN_CLOSED', 403);
  }

  const ip = request.headers.get('x-forwarded-for') || 'checkin-client';
  if (isRateLimited(`checkin:${ip}`, 30, 60_000)) {
    return errorResponse('Terlalu banyak permintaan presensi. Mohon tunggu beberapa detik.', 'RATE_LIMIT', 429);
  }

  try {
    const body = await request.json();
    const supabase = createAdminClient();
    const checkedInAt = now.toISOString();

    if (body.visitor_type === 'umum') {
      const fullName = sanitizeString(body.full_name) || 'Pengunjung Umum';
      const city = sanitizeString(body.city) || 'Kota Bandung';
      const groupSize = Number(body.group_size ?? 1);
      if (!Number.isSafeInteger(groupSize) || groupSize < 1) {
        return errorResponse('Jumlah pengunjung harus berupa angka bulat positif.', 'INVALID_GROUP_SIZE', 400);
      }
      const ticketCode = `PRIDE-VISITOR-${randomInt(1000, 10000)}`;
      const { error } = await supabase.from('pride_registrations').insert({
        registration_code: ticketCode,
        competition_id: 'pengunjung-umum',
        full_name: fullName,
        email: `${ticketCode.toLowerCase()}@festival.prideindustri.id`,
        phone: city,
        address: city,
        status: 'confirmed',
        check_in_status: 'checked_in',
        checked_in_at: checkedInAt,
        declaration_original: true,
        declaration_terms: true,
      });
      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: {
          visitor_type: 'umum',
          ticket_code: ticketCode,
          full_name: fullName,
          city,
          group_size: groupSize,
          checked_in_at: checkedInAt,
          gate_name: 'Main Entrance Braga City Walk',
        },
      });
    }

    const code = sanitizeString(body.registration_code).toUpperCase();
    if (!/^[A-Z0-9_-]{6,80}$/.test(code)) {
      return errorResponse('Masukkan kode registrasi peserta yang valid.', 'MISSING_CREDENTIALS', 400);
    }

    const { data: registration, error } = await supabase
      .from('pride_registrations')
      .select('id, registration_code, full_name, competition_id, check_in_status, checked_in_at')
      .ilike('registration_code', code.replaceAll('_', '\\_'))
      .in('competition_id', ['desain-kemasan', 'video-lokal'])
      .not('status', 'in', '(cancelled,disqualified)')
      .maybeSingle();
    if (error) throw error;
    if (!registration) {
      return errorResponse('Kode registrasi tidak sesuai atau tidak terdaftar sebagai peserta aktif.', 'INVALID_REGISTRATION', 404);
    }

    let alreadyCheckedIn = registration.check_in_status === 'checked_in';
    let persistedAt = registration.checked_in_at;
    if (!alreadyCheckedIn) {
      const { data: updated, error: updateError } = await supabase
        .from('pride_registrations')
        .update({ check_in_status: 'checked_in', checked_in_at: checkedInAt })
        .eq('id', registration.id)
        .eq('check_in_status', 'not_checked_in')
        .not('status', 'in', '(cancelled,disqualified)')
        .select('checked_in_at')
        .maybeSingle();
      if (updateError) throw updateError;
      if (updated) {
        persistedAt = updated.checked_in_at;
      } else {
        const { data: current, error: readError } = await supabase
          .from('pride_registrations')
          .select('checked_in_at')
          .eq('id', registration.id)
          .eq('check_in_status', 'checked_in')
          .not('status', 'in', '(cancelled,disqualified)')
          .maybeSingle();
        if (readError) throw readError;
        if (!current) return errorResponse('Status peserta berubah. Silakan coba lagi.', 'CHECK_IN_CONFLICT', 409);
        alreadyCheckedIn = true;
        persistedAt = current.checked_in_at;
      }
    }

    return NextResponse.json({
      success: true,
      already_checked_in: alreadyCheckedIn,
      message: alreadyCheckedIn
        ? `Peserta ${registration.full_name} sudah presensi${persistedAt ? ` pada ${formatJakartaDateTime(persistedAt)}` : ''}.`
        : undefined,
      data: {
        visitor_type: 'peserta',
        registration_code: registration.registration_code,
        full_name: registration.full_name,
        competition_id: registration.competition_id,
        checked_in_at: persistedAt,
        gate_name: 'Braga Main Gate',
      },
    });
  } catch (err) {
    console.error('[CHECKIN_ERROR]', err);
    return errorResponse('Presensi belum tersimpan. Silakan coba lagi.', 'SERVER_ERROR', 500);
  }
}
