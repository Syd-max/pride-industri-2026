import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/server';
import {
  downloadRegistrationFileFromSupabase,
  uploadRegistrationFileToSupabase,
  sanitizeStorageFileName,
  isConvertibleImage,
  buildRegistrationStoragePath,
  DEFAULT_STORAGE_BUCKET,
} from '@/lib/storage';
import { convertBufferToWebp } from '@/lib/server-image';

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
    const parsed = path.parse(safeFile);
    const isImage = isConvertibleImage(safeFile);

    // 1. Primary Source: Retrieve bytes from Supabase Storage
    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      try {
        const supabase = createAdminClient();

        // INVISIBLE WEBP PIPELINE FOR PREVIEWS:
        // When displaying in-browser preview (isInline=true) of an image, check for pre-generated WebP derivative
        if (isInline && isImage) {
          const webpName = `${parsed.name}.webp`;
          const { buffer: webpBuf, error: webpErr } =
            await downloadRegistrationFileFromSupabase(
              supabase,
              safeCode,
              webpName,
              DEFAULT_STORAGE_BUCKET
            );

          if (webpBuf && !webpErr) {
            return new NextResponse(new Uint8Array(webpBuf), {
              status: 200,
              headers: {
                'Content-Type': 'image/webp',
                'Content-Disposition': `inline; filename="${webpName}"`,
                'Content-Length': webpBuf.length.toString(),
                'Cache-Control': 'public, max-age=86400, s-maxage=86400',
              },
            });
          }
        }

        // Fetch original file from Supabase Storage (unmodified archival copy)
        const { buffer, contentType, error: storageErr } =
          await downloadRegistrationFileFromSupabase(
            supabase,
            safeCode,
            safeFile,
            DEFAULT_STORAGE_BUCKET
          );

        if (buffer && !storageErr) {
          // If in-browser preview requested and file is an image, convert to WebP and cache derivative
          if (isInline && isImage && !safeFile.toLowerCase().endsWith('.webp')) {
            try {
              const { buffer: convertedWebp } = await convertBufferToWebp(buffer);
              if (convertedWebp) {
                // Background cache to Supabase Storage without blocking
                const webpName = `${parsed.name}.webp`;
                const webpObjectPath = buildRegistrationStoragePath(safeCode, webpName);
                uploadRegistrationFileToSupabase(
                  supabase,
                  convertedWebp,
                  webpObjectPath,
                  'image/webp',
                  DEFAULT_STORAGE_BUCKET
                ).catch(() => {});

                return new NextResponse(new Uint8Array(convertedWebp), {
                  status: 200,
                  headers: {
                    'Content-Type': 'image/webp',
                    'Content-Disposition': `inline; filename="${webpName}"`,
                    'Content-Length': convertedWebp.length.toString(),
                    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                  },
                });
              }
            } catch (err) {
              console.warn('[WEBP_CONVERT_FALLBACK] Serving original image directly:', err);
            }
          }

          // Exact original file stream (for download or when inline conversion is not applicable)
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
              'Cache-Control': isInline
                ? 'public, max-age=3600, s-maxage=3600'
                : 'private, no-cache, no-store, must-revalidate',
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
    if (isInline && isImage) {
      const webpPath = path.join(uploadsDir, `${parsed.name}.webp`);
      if (fs.existsSync(/*turbopackIgnore: true*/ webpPath)) {
        localPath = webpPath;
      }
    }
    if (!localPath) {
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
    }

    if (localPath) {
      let localBuffer: Buffer = Buffer.from(fs.readFileSync(/*turbopackIgnore: true*/ localPath));
      let mimeType = getMimeType(localPath);

      if (isInline && isImage && !localPath.toLowerCase().endsWith('.webp')) {
        try {
          const { buffer: webpBuf } = await convertBufferToWebp(localBuffer);
          if (webpBuf) {
            localBuffer = webpBuf;
            mimeType = 'image/webp';
            try {
              fs.writeFileSync(path.join(uploadsDir, `${parsed.name}.webp`), webpBuf);
            } catch {}
          }
        } catch {}
      }

      return new NextResponse(new Uint8Array(localBuffer), {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': isInline
            ? `inline; filename="${path.basename(localPath)}"`
            : `attachment; filename="${safeFile}"`,
          'Content-Length': localBuffer.length.toString(),
          'Cache-Control': isInline ? 'public, max-age=86400' : 'no-cache',
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
