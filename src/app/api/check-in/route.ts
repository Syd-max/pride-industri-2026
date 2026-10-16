import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sanitizeString, isRateLimited } from '@/lib/utils';
import { getSharedRegistrations, updateSharedRegistration, addSharedVisitor } from '@/lib/store';

const DEFAULT_GATE_TOKEN = 'PRIDE2026-GATE-BRAGA-MAIN';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting (30 check-ins per minute per IP for busy gate scanning)
    const ip = request.headers.get('x-forwarded-for') || 'checkin-client';
    if (isRateLimited(`checkin:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan presensi. Mohon tunggu beberapa detik.',
          code: 'RATE_LIMIT',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const visitorType = body.visitor_type === 'umum' ? 'umum' : 'peserta';
    const gateToken = sanitizeString(body.gate_token) || DEFAULT_GATE_TOKEN;

    // ─── ALUR 1: VISITOR UMUM (PENGUNJUNG UMUM FESTIVAL) ───
    if (visitorType === 'umum') {
      const fullName = sanitizeString(body.full_name) || 'Pengunjung Umum';
      const city = sanitizeString(body.city) || 'Kota Bandung';
      const groupSize = Number(body.group_size) || 1;

      const newVisitor = addSharedVisitor({
        full_name: fullName,
        city,
        group_size: groupSize,
        visitor_type: 'umum',
      });

      return NextResponse.json({
        success: true,
        data: {
          visitor_type: 'umum',
          ticket_code: newVisitor.ticket_code,
          full_name: newVisitor.full_name,
          city: newVisitor.city,
          group_size: newVisitor.group_size,
          checked_in_at: newVisitor.checked_in_at,
          gate_name: 'Main Entrance Braga City Walk',
        },
      });
    }

    // ─── ALUR 2: VISITOR PESERTA (PESERTA LOMBA PRIDE 2026) ───
    const inputQuery = sanitizeString(body.registration_code || body.phone || '').toUpperCase();

    if (!inputQuery) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kode registrasi atau nomor telepon peserta wajib dimasukkan.',
          code: 'MISSING_CREDENTIALS',
        },
        { status: 400 }
      );
    }

    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      const supabase = createAdminClient();

      // Check by registration code or phone number
      const { data: registration, error: regError } = await supabase
        .from('pride_registrations')
        .select('*')
        .or(`registration_code.ilike.%${inputQuery}%,phone.eq.${inputQuery}`)
        .maybeSingle();

      if (regError || !registration) {
        // Fallback to in-memory check
        const memTarget = getSharedRegistrations().find(
          (r) =>
            r.registration_code.toUpperCase() === inputQuery ||
            r.phone === inputQuery
        );

        if (!memTarget) {
          return NextResponse.json(
            {
              success: false,
              error: `Kode "${inputQuery}" tidak ditemukan di daftar peserta resmi. Pastikan Anda telah terdaftar lomba.`,
              code: 'INVALID_REGISTRATION',
            },
            { status: 404 }
          );
        }

        // Already checked in?
        if (memTarget.check_in_status === 'checked_in') {
          return NextResponse.json({
            success: true,
            already_checked_in: true,
            message: `Peserta ${memTarget.full_name} sudah presensi sebelumnya.`,
            data: {
              visitor_type: 'peserta',
              registration_code: memTarget.registration_code,
              full_name: memTarget.full_name,
              competition_id: memTarget.competition_id,
              checked_in_at: memTarget.checked_in_at,
              gate_name: 'Braga Main Gate',
            },
          });
        }

        const checkedInAt = new Date().toISOString();
        updateSharedRegistration(memTarget.id, {
          check_in_status: 'checked_in',
          checked_in_at: checkedInAt,
        });

        return NextResponse.json({
          success: true,
          data: {
            visitor_type: 'peserta',
            registration_code: memTarget.registration_code,
            full_name: memTarget.full_name,
            competition_id: memTarget.competition_id,
            checked_in_at: checkedInAt,
            gate_name: 'Braga Main Gate',
          },
        });
      }

      // Check if already checked in in Supabase
      if (registration.check_in_status === 'checked_in') {
        return NextResponse.json({
          success: true,
          already_checked_in: true,
          message: `Peserta ${registration.full_name} sudah presensi sebelumnya pada ${new Date(
            registration.checked_in_at
          ).toLocaleTimeString('id-ID')} WIB.`,
          data: {
            visitor_type: 'peserta',
            registration_code: registration.registration_code,
            full_name: registration.full_name,
            competition_id: registration.competition_id,
            checked_in_at: registration.checked_in_at,
            gate_name: 'Braga Main Gate',
          },
        });
      }

      const checkedInAt = new Date().toISOString();

      await supabase
        .from('pride_registrations')
        .update({
          check_in_status: 'checked_in',
          checked_in_at: checkedInAt,
        })
        .eq('id', registration.id);

      updateSharedRegistration(registration.registration_code, {
        check_in_status: 'checked_in',
        checked_in_at: checkedInAt,
      });

      return NextResponse.json({
        success: true,
        data: {
          visitor_type: 'peserta',
          registration_code: registration.registration_code,
          full_name: registration.full_name,
          competition_id: registration.competition_id,
          checked_in_at: checkedInAt,
          gate_name: 'Braga Main Gate',
        },
      });
    } else {
      // In-memory evaluation
      const memTarget = getSharedRegistrations().find(
        (r) =>
          r.registration_code.toUpperCase() === inputQuery ||
          r.phone === inputQuery
      );

      if (!memTarget) {
        return NextResponse.json(
          {
            success: false,
            error: `Kode "${inputQuery}" tidak ditemukan di daftar peserta resmi. Periksa kembali atau tanyakan ke panitia registrasi.`,
            code: 'INVALID_REGISTRATION',
          },
          { status: 404 }
        );
      }

      if (memTarget.check_in_status === 'checked_in') {
        return NextResponse.json({
          success: true,
          already_checked_in: true,
          message: `Peserta ${memTarget.full_name} sudah presensi sebelumnya pada ${new Date(
            memTarget.checked_in_at || ''
          ).toLocaleTimeString('id-ID')} WIB.`,
          data: {
            visitor_type: 'peserta',
            registration_code: memTarget.registration_code,
            full_name: memTarget.full_name,
            competition_id: memTarget.competition_id,
            checked_in_at: memTarget.checked_in_at,
            gate_name: 'Braga Main Gate',
          },
        });
      }

      const checkedInAt = new Date().toISOString();
      updateSharedRegistration(memTarget.id, {
        check_in_status: 'checked_in',
        checked_in_at: checkedInAt,
      });

      return NextResponse.json({
        success: true,
        data: {
          visitor_type: 'peserta',
          registration_code: memTarget.registration_code,
          full_name: memTarget.full_name,
          competition_id: memTarget.competition_id,
          checked_in_at: checkedInAt,
          gate_name: 'Braga Main Gate',
        },
      });
    }
  } catch (err) {
    console.error('[CHECKIN_ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kegagalan server saat memproses presensi gate.',
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
