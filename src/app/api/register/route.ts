import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  generateRegistrationCode,
  isValidEmail,
  isValidPhone,
  sanitizeString,
  isRateLimited,
} from '@/lib/utils';
import type { ApiResponse, RegistrationSuccessData } from '@/types';

// In-memory demo store if Supabase is not configured yet
const memoryRegistrations: Array<{
  id: string;
  registration_code: string;
  competition_id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  status: string;
  check_in_status: string;
}> = [];

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<RegistrationSuccessData>>> {
  try {
    // 1. Rate Limiting (10 requests per minute per IP)
    const ip = request.headers.get('x-forwarded-for') || 'unknown-client';
    if (isRateLimited(`register:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan pendaftaran. Silakan coba kembali dalam 1 menit.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        { status: 429 }
      );
    }

    // 2. Parse & Sanitize Request
    const body = await request.json();
    const competitionId = sanitizeString(body.competition_id);
    const fullName = sanitizeString(body.full_name);
    const email = sanitizeString(body.email).toLowerCase();
    const phone = sanitizeString(body.phone);

    // 3. Common Validations
    if (!['desain-kemasan', 'video-lokal'].includes(competitionId)) {
      return NextResponse.json(
        { success: false, error: 'Kategori kompetisi tidak valid.' },
        { status: 400 }
      );
    }

    if (!fullName || fullName.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap wajib diisi minimal 3 karakter.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Format alamat email tidak valid.' },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nomor telepon/WhatsApp harus format Indonesia yang valid (08... atau +62...).',
        },
        { status: 400 }
      );
    }

    // 4. Competition Specific Validations & Data Extraction
    let specificData: Record<string, unknown> = {};

    if (competitionId === 'desain-kemasan') {
      const productName = sanitizeString(body.product_name);
      const brandName = sanitizeString(body.brand_name);
      const address = sanitizeString(body.address);
      const localIngredients = sanitizeString(body.local_ingredients);

      if (!productName || !brandName || !address) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Nama produk, nama merek, dan alamat domisili wajib dilengkapi.',
          },
          { status: 400 }
        );
      }

      if (!body.declaration_original || !body.declaration_terms) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Anda wajib menyetujui Pakta Integritas dan Surat Pernyataan Persetujuan.',
          },
          { status: 400 }
        );
      }

      specificData = {
        product_name: productName,
        brand_name: brandName,
        address,
        local_ingredients: localIngredients,
        ai_used: Boolean(body.ai_used),
      };
    } else if (competitionId === 'video-lokal') {
      const igHandle = sanitizeString(body.instagram_handle);
      const tiktokHandle = sanitizeString(body.tiktok_handle);
      const videoCategory = sanitizeString(body.video_category);
      const videoUrl = sanitizeString(body.video_url);

      if (!igHandle && !tiktokHandle) {
        return NextResponse.json(
          {
            success: false,
            error: 'Wajib menyertakan minimal salah satu akun: Instagram atau TikTok.',
          },
          { status: 400 }
        );
      }

      if (
        !['Fesyen', 'Kuliner', 'Kriya', 'PRIDE Industri 2026'].includes(
          videoCategory
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Pilih salah satu kategori video yang valid (Fesyen, Kuliner, Kriya, atau PRIDE Industri 2026).',
          },
          { status: 400 }
        );
      }

      if (!body.declaration_original || !body.declaration_terms) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Anda wajib menyetujui Pakta Integritas dan Surat Pernyataan Persetujuan.',
          },
          { status: 400 }
        );
      }

      specificData = {
        instagram_handle: igHandle,
        tiktok_handle: tiktokHandle,
        video_category: videoCategory,
        video_url: videoUrl,
      };
    }

    // 5. Generate Unique Public Registration Code (Does not leak DB IDs)
    const registrationCode = generateRegistrationCode(competitionId);

    // 6. Persist to Supabase if credentials are provided
    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      try {
        const supabase = createAdminClient();

        // Check for duplicate active registration
        const { data: existing } = await supabase
          .from('pride_registrations')
          .select('id')
          .eq('email', email)
          .eq('competition_id', competitionId)
          .not('status', 'in', '("cancelled","disqualified")')
          .maybeSingle();

        if (existing) {
          return NextResponse.json(
            {
              success: false,
              error: `Email ${email} telah terdaftar pada kompetisi ini sebelumnya. Setiap peserta hanya diperkenankan mendaftar satu kali per kompetisi.`,
              code: 'DUPLICATE_REGISTRATION',
            },
            { status: 409 }
          );
        }

        const { error: insertError } = await supabase
          .from('pride_registrations')
          .insert({
            registration_code: registrationCode,
            competition_id: competitionId,
            full_name: fullName,
            email,
            phone,
            ...specificData,
            declaration_original: Boolean(body.declaration_original),
            declaration_secondary: Boolean(body.declaration_secondary || body.declaration_public_account),
            declaration_terms: Boolean(body.declaration_terms),
            status: 'confirmed',
            check_in_status: 'not_checked_in',
          });

        if (insertError) {
          console.error('[PRIDE_REGISTRATION_ERROR]', insertError);
          return NextResponse.json(
            {
              success: false,
              error:
                'Gagal menyimpan data pendaftaran ke server. Silakan coba kembali.',
            },
            { status: 500 }
          );
        }
      } catch (err) {
        console.error('[SUPABASE_CLIENT_ERROR]', err);
        // Fallback to memory store if database is momentarily unreachable
        memoryRegistrations.push({
          id: Math.random().toString(),
          registration_code: registrationCode,
          competition_id: competitionId,
          full_name: fullName,
          email,
          phone,
          created_at: new Date().toISOString(),
          status: 'confirmed',
          check_in_status: 'not_checked_in',
        });
      }
    } else {
      // Demo / preview mode fallback: store in memory
      // Check duplicate
      const duplicate = memoryRegistrations.find(
        (r) => r.email === email && r.competition_id === competitionId
      );
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: `Email ${email} telah terdaftar pada kompetisi ini.`,
            code: 'DUPLICATE_REGISTRATION',
          },
          { status: 409 }
        );
      }

      memoryRegistrations.push({
        id: Math.random().toString(),
        registration_code: registrationCode,
        competition_id: competitionId,
        full_name: fullName,
        email,
        phone,
        created_at: new Date().toISOString(),
        status: 'confirmed',
        check_in_status: 'not_checked_in',
      });
    }

    // 7. Return Verified Success Response
    return NextResponse.json({
      success: true,
      data: {
        registration_code: registrationCode,
        full_name: fullName,
        competition_id: competitionId as 'desain-kemasan' | 'video-lokal',
        email,
      },
    });
  } catch (err) {
    console.error('[REGISTER_INTERNAL_ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan sistem internal. Silakan hubungi panitia.',
      },
      { status: 500 }
    );
  }
}
