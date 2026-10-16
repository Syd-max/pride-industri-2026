import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  generateRegistrationCode,
  isValidEmail,
  isValidPhone,
  sanitizeString,
  isRateLimited,
} from '@/lib/utils';
import { getSharedRegistrations, addSharedRegistration } from '@/lib/store';
import type { ApiResponse, RegistrationSuccessData, PrideRegistration } from '@/types';

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
      const designConcept = sanitizeString(body.design_concept || body.description || '');
      const designFileName = sanitizeString(body.design_file_name || '');
      const masterFileName = sanitizeString(body.master_file_name || '');
      const paktaFileName = sanitizeString(body.pakta_integritas_file_name || '');
      const persetujuanFileName = sanitizeString(body.surat_persetujuan_file_name || '');

      if (!productName || !brandName || !address) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Nama produk kuliner, nama merek produk, dan alamat domisili lengkap wajib diisi.',
          },
          { status: 400 }
        );
      }

      if (!localIngredients) {
        return NextResponse.json(
          {
            success: false,
            error: 'Bahan dasar lokal yang digunakan wajib diisi.',
          },
          { status: 400 }
        );
      }

      if (
        !body.declaration_original ||
        !body.declaration_unpublished ||
        !body.declaration_terms ||
        !body.declaration_usage_rights
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Anda wajib mencentang seluruh persyaratan dan komitmen lomba desain kemasan.',
          },
          { status: 400 }
        );
      }

      specificData = {
        product_name: productName,
        brand_name: brandName,
        address,
        local_ingredients: localIngredients,
        design_concept: designConcept,
        design_file_name: designFileName,
        master_file_name: masterFileName,
        pakta_integritas_file_name: paktaFileName,
        surat_persetujuan_file_name: persetujuanFileName,
        declaration_original: Boolean(body.declaration_original),
        declaration_unpublished: Boolean(body.declaration_unpublished),
        declaration_terms: Boolean(body.declaration_terms),
        declaration_usage_rights: Boolean(body.declaration_usage_rights),
      };
    } else if (competitionId === 'video-lokal') {
      // 1. Instansi / asal (wajib)
      const institution = sanitizeString(body.institution);
      if (!institution || institution.length < 2) {
        return NextResponse.json(
          { success: false, error: 'Instansi / asal peserta wajib diisi.' },
          { status: 400 }
        );
      }

      // 2. Kategori lomba (wajib)
      const videoCategory = sanitizeString(body.video_category);
      if (
        !['Fesyen', 'Kuliner', 'Kriya', 'PRIDE Industri 2026'].includes(
          videoCategory
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Pilih salah satu kategori lomba yang valid (Fesyen, Kuliner, Kriya, atau PRIDE Industri 2026).',
          },
          { status: 400 }
        );
      }

      // 3. Judul karya video (wajib)
      const videoTitle = sanitizeString(body.video_title);
      if (!videoTitle || videoTitle.length < 3) {
        return NextResponse.json(
          {
            success: false,
            error: 'Judul karya video wajib diisi minimal 3 karakter.',
          },
          { status: 400 }
        );
      }

      // 4. Deskripsi singkat karya (opsional)
      const videoDescription = sanitizeString(body.video_description);

      // 5. Platform publikasi & Handle (opsional / didukung untuk fleksibilitas format)
      const platformInstagram = Boolean(body.platform_instagram);
      const platformTiktok = Boolean(body.platform_tiktok);
      const igHandle = sanitizeString(body.instagram_handle || '').replace(/^@/, '');
      const tiktokHandle = sanitizeString(body.tiktok_handle || '').replace(/^@/, '');
      const igVideoUrl = sanitizeString(body.instagram_video_url || '');
      const tiktokVideoUrl = sanitizeString(body.tiktok_video_url || '');

      // 6. Persetujuan (wajib)
      if (!body.declaration_original) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Persetujuan bahwa karya bersifat orisinal dan tidak melanggar hak pihak lain wajib dicentang.',
          },
          { status: 400 }
        );
      }

      if (!body.declaration_terms) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Persetujuan terhadap seluruh syarat dan ketentuan lomba wajib dicentang.',
          },
          { status: 400 }
        );
      }

      // 7. Dokumen Persyaratan Lomba (maks 5 MB)
      const documentFileName = sanitizeString(
        body.document_file_name || body.pakta_integritas_name || body.pakta_integritas_file_name || ''
      );
      if (!documentFileName) {
        return NextResponse.json(
          {
            success: false,
            error: 'Upload dokumen persyaratan (maksimal 5 MB) wajib dilakukan.',
          },
          { status: 400 }
        );
      }

      // 8. Foto QR / Barcode Kartu Nama Digital TactLink (maks 2 MB)
      const tactlinkQrName = sanitizeString(
        body.tactlink_qr_name || body.surat_persetujuan_name || body.surat_persetujuan_file_name || ''
      );
      if (!tactlinkQrName) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Upload foto barcode / QR kartu nama digital TactLink (maksimal 2 MB) wajib dilakukan.',
          },
          { status: 400 }
        );
      }

      specificData = {
        institution,
        video_category: videoCategory,
        video_title: videoTitle,
        video_description: videoDescription,
        platform_instagram: platformInstagram,
        platform_tiktok: platformTiktok,
        instagram_handle: igHandle,
        tiktok_handle: tiktokHandle,
        instagram_video_url: igVideoUrl,
        tiktok_video_url: tiktokVideoUrl,
        video_url: igVideoUrl || tiktokVideoUrl || '',
        pakta_integritas_file_name: documentFileName,
        surat_persetujuan_file_name: tactlinkQrName,
        document_file_name: documentFileName,
        tactlink_qr_name: tactlinkQrName,
        declaration_usage_rights: Boolean(body.declaration_usage_rights ?? true),
      };
    }

    // 5. Generate Unique Public Registration Code (Does not leak DB IDs)
    const registrationCode = generateRegistrationCode(competitionId);

    // 6. Check duplicates in Shared Store (In-Memory baseline)
    const sharedList = getSharedRegistrations();
    const isDuplicateInMemory = sharedList.some(
      (r) =>
        r.email.toLowerCase() === email &&
        r.competition_id === competitionId &&
        r.status !== 'cancelled' &&
        r.status !== 'disqualified'
    );

    if (isDuplicateInMemory) {
      return NextResponse.json(
        {
          success: false,
          error: `Email ${email} telah terdaftar pada kompetisi ini sebelumnya. Setiap peserta hanya diperkenankan mendaftar satu kali per kompetisi.`,
          code: 'DUPLICATE_REGISTRATION',
        },
        { status: 409 }
      );
    }

    // 7. Persist to Supabase if credentials are provided
    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      try {
        const supabase = createAdminClient();

        // Check for duplicate active registration in database
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
            declaration_secondary: Boolean(
              body.declaration_secondary ||
                body.declaration_public_account ||
                body.declaration_usage_rights
            ),
            declaration_terms: Boolean(body.declaration_terms),
            status: 'confirmed',
            check_in_status: 'not_checked_in',
          });

        if (insertError) {
          console.error('[PRIDE_REGISTRATION_SUPABASE_ERROR]', insertError);
        }
      } catch (err) {
        console.error('[SUPABASE_CLIENT_ERROR]', err);
      }
    }

    // 8. Always synchronize to shared in-memory store so admin & check-in immediately reflect new registrations
    const newRecord: PrideRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      registration_code: registrationCode,
      competition_id: competitionId as 'desain-kemasan' | 'video-lokal',
      full_name: fullName,
      email,
      phone,
      status: 'confirmed',
      check_in_status: 'not_checked_in',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      declaration_original: Boolean(body.declaration_original),
      declaration_terms: Boolean(body.declaration_terms),
      declaration_usage_rights: Boolean(body.declaration_usage_rights),
      ...specificData,
    };

    addSharedRegistration(newRecord);

    // 9. Return Verified Success Response
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
