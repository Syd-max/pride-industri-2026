import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAdminClient, hasAdminSession } from '@/lib/supabase/server';
import { DEFAULT_STORAGE_BUCKET, buildRegistrationStoragePath, sanitizeStorageFileName } from '@/lib/storage';
import { displayRegistrationFileName } from '@/lib/registration-upload';

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.pdf':
      return 'application/pdf';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.ai':
      return 'application/postscript';
    case '.psd':
      return 'image/vnd.adobe.photoshop';
    case '.zip':
      return 'application/zip';
    case '.rar':
      return 'application/x-rar-compressed';
    default:
      return 'application/octet-stream';
  }
}

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function GET(request: NextRequest) {
  if (!(await hasAdminSession())) return fail('Silakan login sebagai admin.', 401);

  const code = request.nextUrl.searchParams.get('code') || '';
  const file = request.nextUrl.searchParams.get('file')?.trim() || '';
  const inline = request.nextUrl.searchParams.get('inline') === 'true';
  if (!/^[A-Za-z0-9_-]{6,80}$/.test(code) || !file || /[\\/\x00-\x1F]/.test(file) || file === '.' || file === '..') {
    return fail('Kode pendaftaran atau nama berkas tidak valid.', 400);
  }

  const safeName = sanitizeStorageFileName(file);
  const downloadName = displayRegistrationFileName(file);
  try {
    const bucket = createAdminClient().storage.from(DEFAULT_STORAGE_BUCKET);
    const paths = new Set([
      buildRegistrationStoragePath(code, safeName),
      `registrations/${code}/${file}`,
      `${code}/${safeName}`,
      `${code}/${file}`,
      safeName,
      file,
    ]);
    for (const objectPath of paths) {
      const { data } = await bucket.createSignedUrl(objectPath, 120, {
        download: inline ? false : downloadName,
      });
      if (data?.signedUrl) {
        return NextResponse.redirect(data.signedUrl, {
          headers: { 'Cache-Control': 'private, no-store' },
        });
      }
    }
  } catch (error) {
    console.error('[DOWNLOAD_API_ERROR]', error);
    if (process.env.NODE_ENV === 'production') {
      return fail('Berkas belum bisa diunduh. Silakan coba lagi.', 503);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', code);
    const localPath = path.join(uploadsDir, safeName);
    if (fs.existsSync(/*turbopackIgnore: true*/ localPath)) {
      const buffer = fs.readFileSync(/*turbopackIgnore: true*/ localPath);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': getMimeType(safeName),
          'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${displayRegistrationFileName(safeName)}"`,
          'Cache-Control': 'private, no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
  }

  return fail('Berkas tidak ditemukan di penyimpanan.', 404);
}
