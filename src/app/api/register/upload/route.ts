import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { DEFAULT_STORAGE_BUCKET, buildRegistrationStoragePath } from '@/lib/storage';
import { isRegistrationFileField, registrationFileLimits, registrationUploadName } from '@/lib/registration-upload';
import { isRateLimited } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'upload-client';
  if (isRateLimited(`registration-upload:${ip}`, 80, 60_000)) {
    return NextResponse.json({ error: 'Terlalu banyak unggahan. Silakan coba lagi.' }, { status: 429 });
  }

  try {
    const { code, field, name, size } = await request.json();
    if (
      typeof code !== 'string' || !/^PRIDE-(DK|VL)-[0-9]{8}-[A-Z0-9]{6}$/.test(code) ||
      !isRegistrationFileField(field) || typeof name !== 'string' || !name.trim() ||
      name.length > 240 || !Number.isSafeInteger(size) || size < 1 || size > registrationFileLimits[field]
    ) {
      return NextResponse.json({ error: 'Berkas atau kode pendaftaran tidak valid.' }, { status: 400 });
    }

    const fileName = registrationUploadName(field, name);
    const path = buildRegistrationStoragePath(code, fileName);
    const { data, error } = await createAdminClient().storage
      .from(DEFAULT_STORAGE_BUCKET).createSignedUploadUrl(path);
    if (error) throw error;
    return NextResponse.json({ bucket: DEFAULT_STORAGE_BUCKET, path, fileName, token: data.token });
  } catch (error) {
    console.error('[REGISTRATION_UPLOAD_TOKEN_ERROR]', error);
    return NextResponse.json({ error: 'Penyimpanan berkas belum tersedia. Silakan coba lagi.' }, { status: 503 });
  }
}
