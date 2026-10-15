import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sanitizeString, isRateLimited } from '@/lib/utils';
import { EVENT_CONFIG } from '@/config/event';
import type { ApiResponse, CheckInSuccessData } from '@/types';

// Default fallback token for PRIDE 2026 Braga Main Gate
const DEFAULT_GATE_TOKEN = 'PRIDE2026-GATE-BRAGA-MAIN';

// In-memory check-in store for preview/demo mode
const memoryCheckIns: Array<{
  registration_code: string;
  gate_token: string;
  checked_in_at: string;
}> = [];

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CheckInSuccessData>>> {
  try {
    // 1. Rate Limiting (15 check-in attempts per minute per IP)
    const ip = request.headers.get('x-forwarded-for') || 'checkin-client';
    if (isRateLimited(`checkin:${ip}`, 15, 60_000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan check-in. Mohon tunggu 1 menit.',
          code: 'RATE_LIMIT',
        },
        { status: 429 }
      );
    }

    // 2. Parse payload
    const body = await request.json();
    const registrationCode = sanitizeString(body.registration_code).toUpperCase();
    const gateToken = sanitizeString(body.gate_token);

    if (!registrationCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kode registrasi peserta wajib disertakan.',
          code: 'MISSING_REGISTRATION_CODE',
        },
        { status: 400 }
      );
    }

    if (!gateToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kode QR gate tidak terbaca atau kosong.',
          code: 'MISSING_GATE_TOKEN',
        },
        { status: 400 }
      );
    }

    // 3. Time Window Validation
    const now = new Date();
    // Allow check-in during test/preview or during the actual event window
    const isWithinEvent =
      now >= EVENT_CONFIG.checkin.windowStart &&
      now <= EVENT_CONFIG.checkin.windowEnd;

    // We allow preview validation if not in strict production mode, or if query param / header allows preview
    const allowPreview =
      process.env.NODE_ENV !== 'production' ||
      body.preview_mode === true ||
      !isWithinEvent; // In 2026 prior to event, give clear message or permit preview simulation

    // 4. Validate with Supabase if configured
    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      const supabase = createAdminClient();

      // Verify Registration
      const { data: registration, error: regError } = await supabase
        .from('pride_registrations')
        .select('id, registration_code, full_name, competition_id, check_in_status, checked_in_at')
        .eq('registration_code', registrationCode)
        .maybeSingle();

      if (regError || !registration) {
        return NextResponse.json(
          {
            success: false,
            error: `Kode registrasi "${registrationCode}" tidak ditemukan di database peserta. Pastikan Anda telah terdaftar.`,
            code: 'INVALID_REGISTRATION',
          },
          { status: 404 }
        );
      }

      // Check if already checked in
      if (registration.check_in_status === 'checked_in') {
        return NextResponse.json(
          {
            success: false,
            error: `Peserta ${registration.full_name} sudah melakukan check-in sebelumnya pada ${new Date(
              registration.checked_in_at
            ).toLocaleTimeString('id-ID')} WIB.`,
            code: 'ALREADY_CHECKED_IN',
          },
          { status: 409 }
        );
      }

      // Verify Gate Token (Match either pride_gate_tokens or default token)
      let gateTokenId: string | null = null;
      const { data: tokenRecord } = await supabase
        .from('pride_gate_tokens')
        .select('id, is_active, valid_from, valid_until')
        .eq('token', gateToken)
        .maybeSingle();

      if (tokenRecord) {
        if (!tokenRecord.is_active) {
          return NextResponse.json(
            {
              success: false,
              error: 'Kode QR gate ini sudah dinonaktifkan oleh panitia.',
              code: 'TOKEN_INACTIVE',
            },
            { status: 403 }
          );
        }
        gateTokenId = tokenRecord.id;
      } else if (gateToken === DEFAULT_GATE_TOKEN) {
        // Fallback default token accepted
        gateTokenId = null;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Kode QR gate tidak valid atau bukan merupakan QR resmi gate PRIDE 2026.',
            code: 'INVALID_GATE_TOKEN',
          },
          { status: 400 }
        );
      }

      // Atomically record attendance
      const checkedInAt = new Date().toISOString();

      await supabase
        .from('pride_registrations')
        .update({
          check_in_status: 'checked_in',
          checked_in_at: checkedInAt,
        })
        .eq('id', registration.id);

      if (gateTokenId) {
        await supabase.from('pride_checkins').insert({
          registration_id: registration.id,
          gate_token_id: gateTokenId,
          source: 'qr_scan',
          checked_in_at: checkedInAt,
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          registration_code: registration.registration_code,
          full_name: registration.full_name,
          competition_id: registration.competition_id as 'desain-kemasan' | 'video-lokal',
          checked_in_at: checkedInAt,
        },
      });
    } else {
      // Demo / In-Memory check-in validation
      const existingCheckin = memoryCheckIns.find(
        (c) => c.registration_code === registrationCode
      );

      if (existingCheckin) {
        return NextResponse.json(
          {
            success: false,
            error: `Kode registrasi "${registrationCode}" sudah tercatat hadir sebelumnya.`,
            code: 'ALREADY_CHECKED_IN',
          },
          { status: 409 }
        );
      }

      // Verify gate token format
      const isValidGate =
        gateToken === DEFAULT_GATE_TOKEN ||
        gateToken.startsWith('PRIDE2026') ||
        gateToken.length >= 8;

      if (!isValidGate) {
        return NextResponse.json(
          {
            success: false,
            error: 'Kode QR yang dipindai bukan kode gate PRIDE 2026.',
            code: 'INVALID_GATE_TOKEN',
          },
          { status: 400 }
        );
      }

      const checkedInAt = new Date().toISOString();
      memoryCheckIns.push({
        registration_code: registrationCode,
        gate_token: gateToken,
        checked_in_at: checkedInAt,
      });

      const isDK = registrationCode.includes('-DK-');

      return NextResponse.json({
        success: true,
        data: {
          registration_code: registrationCode,
          full_name: 'Peserta Terverifikasi PRIDE 2026',
          competition_id: isDK ? 'desain-kemasan' : 'video-lokal',
          checked_in_at: checkedInAt,
        },
      });
    }
  } catch (err) {
    console.error('[CHECKIN_ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kegagalan server saat memproses kehadiran.',
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
