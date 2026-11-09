import { NextRequest, NextResponse } from 'next/server';
import { EVENT_CONFIG } from '@/config/event';
import { createAdminClient } from '@/lib/supabase/server';
import {
  generateRegistrationCode,
  isValidEmail,
  isValidPhone,
  sanitizeString,
  isRateLimited,
} from '@/lib/utils';
import {
  uploadRegistrationFileToSupabase,
  deleteRegistrationFilesFromSupabase,
  sanitizeStorageFileName,
  buildRegistrationStoragePath,
  DEFAULT_STORAGE_BUCKET,
} from '@/lib/storage';
import { isRegistrationFileField, registrationFileLimits, registrationUploadName, type RegistrationFileField } from '@/lib/registration-upload';
import type { ApiResponse, RegistrationSuccessData } from '@/types';

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

    // 2. Parse & Sanitize Request (Supports both FormData with binary files and JSON)
    const contentType = request.headers.get('content-type') || '';
    const body: Record<string, unknown> = Object.create(null);
    const uploadedFiles: Record<string, File> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          if (value.size > 0) {
            if (!isRegistrationFileField(key) || value.size > registrationFileLimits[key]) {
              return NextResponse.json({ success: false, error: 'Berkas tidak sesuai ketentuan.' }, { status: 400 });
            }
            uploadedFiles[key] = value;
            body[`${key}_name`] = value.name;
          }
        } else {
          if (value === 'true') body[key] = true;
          else if (value === 'false') body[key] = false;
          else body[key] = value;
        }
      }
    } else {
      const json = await request.json();
      Object.assign(body, json);
    }

    const competitionId = sanitizeString(body.competition_id);
    const fullName = sanitizeString(body.full_name);
    const email = sanitizeString(body.email).toLowerCase();
    const phone = sanitizeString(body.phone);

    // 3. Common Validations
    if (competitionId !== 'desain-kemasan' && competitionId !== 'video-lokal') {
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

    const fileName = (field: RegistrationFileField, supplied: unknown) => {
      const file = uploadedFiles[field];
      if (file) return registrationUploadName(field, file.name);
      const name = sanitizeString(supplied);
      return name ? sanitizeStorageFileName(name) : '';
    };
    const requiredFiles: [RegistrationFileField, string][] = [];

    // 4. Competition Specific Validations & Data Extraction
    let specificData: Record<string, unknown> = {};

    if (competitionId === 'desain-kemasan') {
      const productName = sanitizeString(body.product_name);
      const brandName = sanitizeString(body.brand_name);
      const address = sanitizeString(body.address);
      const institution = sanitizeString(body.institution || '');
      const localIngredients = sanitizeString(body.local_ingredients);
      const designConcept = sanitizeString(body.design_concept || body.description || '');
      const { registrationOpen, registrationClose } = EVENT_CONFIG.competitions.desainKemasan.schedule;
      const now = Date.now();
      if (now < registrationOpen.getTime() || now > registrationClose.getTime()) {
        return NextResponse.json({ success: false, error: 'Pendaftaran Desain Kemasan di luar jadwal.' }, { status: 403 });
      }

      const designFileName = fileName('design_file', body.design_file_name);
      const masterFileName = fileName('master_file', body.master_file_name);
      const paktaFileName = fileName('pakta_integritas_file', body.pakta_integritas_file_name);
      const persetujuanFileName = fileName('surat_persetujuan_file', body.surat_persetujuan_file_name) || paktaFileName;
      if (!designFileName || !(paktaFileName || persetujuanFileName)) {
        return NextResponse.json({ success: false, error: 'File karya dan dokumen persyaratan wajib diunggah.' }, { status: 400 });
      }
      requiredFiles.push(['design_file', designFileName]);
      if (masterFileName) requiredFiles.push(['master_file', masterFileName]);
      if (paktaFileName) requiredFiles.push(['pakta_integritas_file', paktaFileName]);
      if (persetujuanFileName !== paktaFileName) requiredFiles.push(['surat_persetujuan_file', persetujuanFileName]);

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
        body.declaration_original !== true ||
        body.declaration_unpublished !== true ||
        body.declaration_terms !== true ||
        body.declaration_usage_rights !== true
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

      // TactLink Digital Business Card QR upload (Wajib Step 5)
      const tactlinkQrName = fileName('tactlink_qr_file', body.tactlink_qr_name);
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

      requiredFiles.push(['tactlink_qr_file', tactlinkQrName]);
      specificData = {
        product_name: productName,
        brand_name: brandName,
        address,
        institution,
        local_ingredients: localIngredients,
        design_concept: designConcept,
        design_file_name: designFileName,
        master_file_name: masterFileName,
        pakta_integritas_file_name: paktaFileName,
        surat_persetujuan_file_name: persetujuanFileName,
        tactlink_qr_name: tactlinkQrName,
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
      if (body.declaration_original !== true) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Persetujuan bahwa karya bersifat orisinal dan tidak melanggar hak pihak lain wajib dicentang.',
          },
          { status: 400 }
        );
      }

      if (body.declaration_terms !== true || body.declaration_usage_rights !== true) {
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
      const documentFileName = fileName(
        'document_file', body.document_file_name || body.pakta_integritas_name || body.pakta_integritas_file_name
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
      const tactlinkQrName = fileName(
        'tactlink_qr_file', body.tactlink_qr_name || body.surat_persetujuan_name || body.surat_persetujuan_file_name
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

      requiredFiles.push(['document_file', documentFileName], ['tactlink_qr_file', tactlinkQrName]);
      specificData = {
        address: sanitizeString(body.address || ''),
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
        declaration_usage_rights: true,
      };
    }

    const registrationCode = sanitizeString(body.registration_code) || generateRegistrationCode(competitionId);
    if (!/^[A-Za-z0-9_-]{6,80}$/.test(registrationCode)) {
      return NextResponse.json({ success: false, error: 'Kode pendaftaran tidak valid.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: existing, error: duplicateError } = await supabase
      .from('pride_registrations')
      .select('id')
      .eq('email', email)
      .eq('competition_id', competitionId)
      .not('status', 'in', '(cancelled,disqualified)')
      .maybeSingle();
    if (duplicateError) throw duplicateError;
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email sudah terdaftar pada kompetisi ini.', code: 'DUPLICATE_REGISTRATION' },
        { status: 409 }
      );
    }

    const uploadedPaths: string[] = [];
    let saved = false;
    try {
      for (const [field, name] of requiredFiles) {
        const objectPath = buildRegistrationStoragePath(registrationCode, name);
        const file = uploadedFiles[field];
        if (file) {
          const { path, error } = await uploadRegistrationFileToSupabase(
            supabase, file, objectPath, file.type, DEFAULT_STORAGE_BUCKET
          );
          if (error || !path) throw error || new Error('Upload failed.');
          uploadedPaths.push(objectPath);
        } else {
          const { data, error } = await supabase.storage.from(DEFAULT_STORAGE_BUCKET).info(objectPath);
          const size = data?.size ?? Number(data?.metadata?.size);
          if (error || !data || !Number.isFinite(size) || size < 1 || size > registrationFileLimits[field]) {
            return NextResponse.json(
              { success: false, error: `Berkas "${name}" belum tersedia atau ukurannya tidak sesuai.` },
              { status: 400 }
            );
          }
        }
      }

      const { error } = await supabase.from('pride_registrations').insert({
        registration_code: registrationCode,
        competition_id: competitionId,
        full_name: fullName,
        email,
        phone,
        ...specificData,
        declaration_original: true,
        declaration_secondary: true,
        declaration_terms: true,
        status: 'confirmed',
        check_in_status: 'not_checked_in',
      });
      if (error?.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Pendaftaran sudah ada atau kode tidak tersedia. Silakan periksa data Anda.', code: 'DUPLICATE_REGISTRATION' },
          { status: 409 }
        );
      }
      if (error) throw error;
      saved = true;

      return NextResponse.json({
        success: true,
        data: { registration_code: registrationCode, full_name: fullName, competition_id: competitionId, email },
      });
    } finally {
      if (!saved && uploadedPaths.length) {
        await deleteRegistrationFilesFromSupabase(supabase, uploadedPaths, DEFAULT_STORAGE_BUCKET);
      }
    }
  } catch (err) {
    console.error('[REGISTER_INTERNAL_ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Pendaftaran belum tersimpan. Silakan coba lagi atau hubungi panitia.' },
      { status: 500 }
    );
  }
}
