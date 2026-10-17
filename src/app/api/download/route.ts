import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/server';
import {
  downloadRegistrationFileFromSupabase,
  sanitizeStorageFileName,
  DEFAULT_STORAGE_BUCKET,
} from '@/lib/storage';

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

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const file = request.nextUrl.searchParams.get('file');
    const isInline = request.nextUrl.searchParams.get('inline') === 'true';

    if (!code || !file) {
      return NextResponse.json(
        { success: false, error: 'Parameter code dan file wajib disertakan.' },
        { status: 400 }
      );
    }

    const safeCode = code.replace(/[^a-zA-Z0-9_-]/g, '');
    const safeFile = sanitizeStorageFileName(file);

    // 1. Primary Source: Retrieve exact binary bytes from Supabase Storage
    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      try {
        const supabase = createAdminClient();
        const { buffer, contentType, error: storageErr } =
          await downloadRegistrationFileFromSupabase(
            supabase,
            safeCode,
            safeFile,
            DEFAULT_STORAGE_BUCKET
          );

        if (buffer && !storageErr) {
          const mimeType = contentType && contentType !== 'application/octet-stream'
            ? contentType
            : getMimeType(safeFile);

          return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
              'Content-Type': mimeType,
              'Content-Disposition': isInline
                ? `inline; filename="${safeFile}"`
                : `attachment; filename="${safeFile}"`,
              'Content-Length': buffer.length.toString(),
              'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
          });
        }
      } catch (err) {
        console.warn('[DOWNLOAD_SUPABASE_ERROR] Failed to fetch from Supabase Storage:', err);
      }
    }

    // 2. Secondary Fallback: Local filesystem (for local dev environments)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', safeCode);
    const directPath = path.join(uploadsDir, safeFile);

    let localPath: string | null = null;
    if (fs.existsSync(/*turbopackIgnore: true*/ directPath)) {
      localPath = directPath;
    } else if (fs.existsSync(/*turbopackIgnore: true*/ uploadsDir)) {
      const filesInFolder = fs.readdirSync(/*turbopackIgnore: true*/ uploadsDir);
      const match = filesInFolder.find(
        (f) => f.toLowerCase() === safeFile.toLowerCase()
      );
      if (match) {
        localPath = path.join(uploadsDir, match);
      }
    }

    if (localPath) {
      const localBuffer = fs.readFileSync(/*turbopackIgnore: true*/ localPath);
      const mimeType = getMimeType(safeFile);

      return new NextResponse(new Uint8Array(localBuffer), {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': isInline
            ? `inline; filename="${safeFile}"`
            : `attachment; filename="${safeFile}"`,
          'Content-Length': localBuffer.length.toString(),
        },
      });
    }

    // 3. Honest 404 Response: The file genuinely does not exist in Supabase Storage
    return NextResponse.json(
      {
        success: false,
        error: `Berkas "${safeFile}" tidak ditemukan pada Supabase Storage (bucket: ${DEFAULT_STORAGE_BUCKET}) untuk pendaftaran ${safeCode}.`,
        code: 'FILE_NOT_FOUND',
      },
      { status: 404 }
    );
  } catch (error: any) {
    if (error?.digest?.startsWith?.('NEXT_')) {
      throw error;
    }
    console.error('[DOWNLOAD_API_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat mengunduh berkas dari penyimpanan.' },
      { status: 500 }
    );
  }
}
