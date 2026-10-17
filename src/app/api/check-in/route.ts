import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sanitizeString, isRateLimited } from '@/lib/utils';
import { getSharedRegistrations, updateSharedRegistration, addSharedRegistration, addSharedVisitor } from '@/lib/store';

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

    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    // ─── ALUR 1: VISITOR UMUM (PENGUNJUNG UMUM FESTIVAL) ───
    if (visitorType === 'umum') {
      const fullName = sanitizeString(body.full_name) || 'Pengunjung Umum';
      const city = sanitizeString(body.city) || 'Kota Bandung';
      const groupSize = Number(body.group_size) || 1;
      const checkedInAt = new Date().toISOString();

      const newVisitor = addSharedVisitor({
        full_name: fullName,
        city,
        group_size: groupSize,
        visitor_type: 'umum',
      });

      const ticketCode = newVisitor.ticket_code;

      // Persist Visitor Presensi to Supabase pride_registrations
      if (hasSupabase) {
        try {
          const supabase = createAdminClient();
          const { error: visInsertErr } = await supabase.from('pride_registrations').insert({
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

          if (visInsertErr) {
            console.error('[PRIDE_VISITOR_INSERT_ERROR]', visInsertErr);
          } else {
            console.log('[PRIDE_VISITOR_INSERT_SUCCESS]', ticketCode);
          }
        } catch (err) {
          console.error('[PRIDE_VISITOR_PERSIST_ERROR]', err);
        }
      }

      // Also mirror to shared in-memory registrations for instantaneous local reflections
      addSharedRegistration({
        id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        registration_code: ticketCode,
        competition_id: 'pengunjung-umum',
        full_name: fullName,
        email: `${ticketCode.toLowerCase()}@festival.prideindustri.id`,
        phone: city,
        address: city,
        status: 'confirmed',
        check_in_status: 'checked_in',
        checked_in_at: checkedInAt,
        created_at: checkedInAt,
        updated_at: checkedInAt,
        declaration_original: true,
        declaration_terms: true,
      });

      return NextResponse.json({
        success: true,
        data: {
          visitor_type: 'umum',
          ticket_code: ticketCode,
          full_name: newVisitor.full_name,
          city: newVisitor.city,
          group_size: newVisitor.group_size,
          checked_in_at: checkedInAt,
          gate_name: 'Main Entrance Braga City Walk',
        },
      });
    }

    // ─── ALUR 2: VISITOR PESERTA (PESERTA LOMBA PRIDE 2026) ───
    const inputCode = sanitizeString(body.registration_code || '').trim().toUpperCase();

    if (!inputCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kode registrasi peserta wajib dimasukkan. Presensi hanya berlaku untuk diri sendiri dan tidak dapat diwakilkan.',
          code: 'MISSING_CREDENTIALS',
        },
        { status: 400 }
      );
    }

    if (hasSupabase) {
      const supabase = createAdminClient();

      // Match on official registration code (case-insensitive)
      const { data: registration, error: regError } = await supabase
        .from('pride_registrations')
        .select('*')
        .ilike('registration_code', inputCode)
        .maybeSingle();

      if (regError) {
        console.error('[PRIDE_CHECKIN_SUPABASE_ERROR]', regError.code, regError.message, regError.hint);
      }

      if (regError || !registration) {
        // Fallback to in-memory check with exact code match
        const memTarget = getSharedRegistrations().find(
          (r) => r.registration_code.toUpperCase() === inputCode
        );

        if (!memTarget) {
          return NextResponse.json(
            {
              success: false,
              error: `Kode registrasi "${inputCode}" tidak sesuai atau tidak terdaftar di database peserta resmi. Pastikan kode yang Anda masukkan sesuai persis dengan bukti pendaftaran Anda. Presensi hanya untuk diri sendiri dan tidak dapat diwakilkan.`,
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

      const { error: updateError } = await supabase
        .from('pride_registrations')
        .update({
          check_in_status: 'checked_in',
          checked_in_at: checkedInAt,
        })
        .eq('id', registration.id);

      if (updateError) {
        console.error('[PRIDE_CHECKIN_UPDATE_ERROR]', updateError.code, updateError.message, updateError.hint);
      }

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
      // In-memory evaluation with exact code match
      const memTarget = getSharedRegistrations().find(
        (r) => r.registration_code.toUpperCase() === inputCode
      );

      if (!memTarget) {
        return NextResponse.json(
          {
            success: false,
            error: `Kode registrasi "${inputCode}" tidak sesuai atau tidak terdaftar di database peserta resmi. Pastikan kode yang Anda masukkan sesuai persis dengan bukti pendaftaran Anda. Presensi hanya untuk diri sendiri dan tidak dapat diwakilkan.`,
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
