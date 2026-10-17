import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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

    // 2. Parse & Sanitize Request (Supports both FormData with binary files and JSON)
    const contentType = request.headers.get('content-type') || '';
    const body: Record<string, any> = {};
    const uploadedFiles: Record<string, File> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          if (value.size > 0) {
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
      const designFileName = sanitizeString(
        uploadedFiles['design_file']?.name || body.design_file_name || ''
      );
      const masterFileName = sanitizeString(
        uploadedFiles['master_file']?.name || body.master_file_name || ''
      );
      const paktaFileName = sanitizeString(
        uploadedFiles['pakta_integritas_file']?.name || body.pakta_integritas_file_name || ''
      );
      const persetujuanFileName = sanitizeString(
        uploadedFiles['surat_persetujuan_file']?.name || body.surat_persetujuan_file_name || ''
      );

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
        uploadedFiles['document_file']?.name ||
          body.document_file_name ||
          body.pakta_integritas_name ||
          body.pakta_integritas_file_name ||
          ''
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
        uploadedFiles['tactlink_qr_file']?.name ||
          body.tactlink_qr_name ||
          body.surat_persetujuan_name ||
          body.surat_persetujuan_file_name ||
          ''
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

    // 7. Check credentials and prepare Supabase client
    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    const uploadedStoragePaths: string[] = [];

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

        // Upload actual uploaded binary files to Supabase Storage
        if (Object.keys(uploadedFiles).length > 0) {
          for (const [key, file] of Object.entries(uploadedFiles)) {
            if (file && file.size > 0) {
              const safeName = sanitizeStorageFileName(file.name);
              const objectPath = buildRegistrationStoragePath(registrationCode, safeName);
              const arrayBuffer = await file.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);

              const { path: uploadedPath, error: uploadErr } =
                await uploadRegistrationFileToSupabase(
                  supabase,
                  buffer,
                  objectPath,
                  file.type || 'application/octet-stream',
                  DEFAULT_STORAGE_BUCKET
                );

              if (uploadErr || !uploadedPath) {
                console.error(
                  `[SUPABASE_STORAGE_ERROR] Failed to upload ${key} (${safeName}):`,
                  uploadErr
                );

                // Roll back any already-uploaded files for this registration
                if (uploadedStoragePaths.length > 0) {
                  await deleteRegistrationFilesFromSupabase(
                    supabase,
                    uploadedStoragePaths,
                    DEFAULT_STORAGE_BUCKET
                  );
                }

                return NextResponse.json(
                  {
                    success: false,
                    error: `Gagal mengunggah berkas "${file.name}" ke Supabase Storage: ${
                      uploadErr?.message || 'Upload error'
                    }. Pastikan berkas sesuai ketentuan.`,
                    code: 'STORAGE_UPLOAD_FAILED',
                  },
                  { status: 500 }
                );
              }

              uploadedStoragePaths.push(objectPath);
              console.log(
                `[SUPABASE_STORAGE_SAVED] Successfully uploaded ${key} -> ${objectPath} (${file.size} bytes)`
              );
            }
          }
        }

        // Also save to local uploads directory in local development for offline access
        if (Object.keys(uploadedFiles).length > 0) {
          try {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', registrationCode);
            await fs.promises.mkdir(uploadDir, { recursive: true });
            for (const [, file] of Object.entries(uploadedFiles)) {
              if (file && file.size > 0) {
                const safeName = sanitizeStorageFileName(file.name);
                const targetFilePath = path.join(uploadDir, safeName);
                const buffer = Buffer.from(await file.arrayBuffer());
                await fs.promises.writeFile(targetFilePath, buffer);
              }
            }
          } catch {}
        }

        const insertPayload: Record<string, unknown> = {
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
        };

        const { error: insertError } = await supabase
          .from('pride_registrations')
          .insert(insertPayload);

        if (insertError) {
          console.error(
            '[PRIDE_REGISTRATION_SUPABASE_ERROR]',
            insertError.code,
            insertError.message,
            insertError.details,
            insertError.hint
          );

          // If a custom column is missing in the database table, retry with core schema columns
          let retrySuccess = false;
          if (insertError.code === '42703') {
            console.warn('[PRIDE_REGISTRATION] Retrying with core schema columns fallback...');
            const corePayload: Record<string, unknown> = {
              registration_code: registrationCode,
              competition_id: competitionId,
              full_name: fullName,
              email,
              phone,
              declaration_original: Boolean(body.declaration_original),
              declaration_secondary: Boolean(
                body.declaration_secondary ||
                  body.declaration_public_account ||
                  body.declaration_usage_rights
              ),
              declaration_terms: Boolean(body.declaration_terms),
              status: 'confirmed',
              check_in_status: 'not_checked_in',
            };

            if (specificData.address) corePayload.address = specificData.address;
            if (specificData.product_name) corePayload.product_name = specificData.product_name;
            if (specificData.brand_name) corePayload.brand_name = specificData.brand_name;
            if (specificData.local_ingredients) corePayload.local_ingredients = specificData.local_ingredients;
            if (specificData.video_category) corePayload.video_category = specificData.video_category;
            if (specificData.video_url) corePayload.video_url = specificData.video_url;
            if (specificData.instagram_handle) corePayload.instagram_handle = specificData.instagram_handle;
            if (specificData.tiktok_handle) corePayload.tiktok_handle = specificData.tiktok_handle;

            const { error: retryError } = await supabase
              .from('pride_registrations')
              .insert(corePayload);

            if (!retryError) {
              retrySuccess = true;
              console.log('[PRIDE_REGISTRATION_SUCCESS] Inserted with core columns');
            } else {
              console.error('[PRIDE_REGISTRATION_RETRY_ERROR]', retryError);
            }
          }

          if (!retrySuccess) {
            // Database insert failed: Roll back uploaded files in Supabase Storage!
            if (uploadedStoragePaths.length > 0) {
              await deleteRegistrationFilesFromSupabase(
                supabase,
                uploadedStoragePaths,
                DEFAULT_STORAGE_BUCKET
              );
            }

            return NextResponse.json(
              {
                success: false,
                error: `Gagal menyimpan data pendaftaran ke database: ${insertError.message}. Berkas yang diunggah telah dibatalkan secara aman.`,
                code: 'DATABASE_INSERT_FAILED',
              },
              { status: 500 }
            );
          }
        } else {
          console.log('[PRIDE_REGISTRATION_SUCCESS] Saved to Supabase:', registrationCode);
        }
      } catch (err: any) {
        console.error('[SUPABASE_CLIENT_ERROR]', err);
        if (uploadedStoragePaths.length > 0) {
          try {
            const supabase = createAdminClient();
            await deleteRegistrationFilesFromSupabase(
              supabase,
              uploadedStoragePaths,
              DEFAULT_STORAGE_BUCKET
            );
          } catch {}
        }
        return NextResponse.json(
          {
            success: false,
            error: `Terjadi kendala saat menghubungkan ke database Supabase: ${err?.message || err}.`,
            code: 'SUPABASE_CONNECTION_ERROR',
          },
          { status: 500 }
        );
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
