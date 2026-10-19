import { SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
  'community-assets';

/**
 * Sanitizes a filename to prevent path traversal or invalid characters in Supabase Storage.
 */
export function sanitizeStorageFileName(rawName: string): string {
  if (!rawName) return 'file';
  // Strip path segments
  const base = rawName.split(/[\\/]/).pop() || rawName;
  // Replace disallowed characters with underscores
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Builds the canonical Supabase Storage object path for a registration asset.
 * Example: "registrations/PRIDE-VL-20261017-ABC123/dokumen_persyaratan.pdf"
 */
export function buildRegistrationStoragePath(
  registrationCode: string,
  fileName: string
): string {
  const safeCode = registrationCode.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeName = sanitizeStorageFileName(fileName);
  return `registrations/${safeCode}/${safeName}`;
}

/**
 * Maps filenames and MIME types to Supabase bucket allowed content types.
 * Prevents "mime type ... is not supported" errors for .docx, .doc, .rar, .jpg, etc.
 */
export function getSafeStorageContentType(fileOrType: string | { name?: string; type?: string }): string {
  const type = typeof fileOrType === 'string' ? fileOrType : fileOrType?.type || '';
  const name = typeof fileOrType === 'string' ? fileOrType : fileOrType?.name || '';
  const ext = name.split('.').pop()?.toLowerCase() || '';

  if (ext === 'jpg' || ext === 'jpeg' || type === 'image/jpg' || type === 'image/jpeg') return 'image/jpeg';
  if (ext === 'png' || type === 'image/png') return 'image/png';
  if (ext === 'webp' || type === 'image/webp') return 'image/webp';
  if (ext === 'pdf' || type === 'application/pdf') return 'application/pdf';
  if (ext === 'zip' || type === 'application/zip' || type === 'application/x-zip-compressed') return 'application/zip';
  return 'application/octet-stream';
}

/**
 * Uploads a binary buffer or Blob to Supabase Storage with automatic contentType inference.
 */
export async function uploadRegistrationFileToSupabase(
  supabase: SupabaseClient,
  fileBody: Buffer | Blob | Uint8Array | ArrayBuffer,
  objectPath: string,
  contentType: string,
  bucketName = DEFAULT_STORAGE_BUCKET
): Promise<{ path: string | null; error: Error | null }> {
  try {
    const safeContentType = getSafeStorageContentType(contentType || objectPath);
    let { data, error } = await supabase.storage
      .from(bucketName)
      .upload(objectPath, fileBody, {
        contentType: safeContentType,
        upsert: true,
      });

    // Fallback if Supabase bucket rejects MIME type
    if (error && error.message?.toLowerCase().includes('mime type')) {
      const retry = await supabase.storage
        .from(bucketName)
        .upload(objectPath, fileBody, {
          contentType: 'application/octet-stream',
          upsert: true,
        });
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return { path: null, error: new Error(error.message) };
    }

    return { path: data?.path || objectPath, error: null };
  } catch (err: any) {
    return { path: null, error: err };
  }
}

/**
 * Deletes objects from Supabase Storage (used for rollback if registration DB write fails).
 */
export async function deleteRegistrationFilesFromSupabase(
  supabase: SupabaseClient,
  objectPaths: string[],
  bucketName = DEFAULT_STORAGE_BUCKET
): Promise<void> {
  if (!objectPaths.length) return;
  try {
    await supabase.storage.from(bucketName).remove(objectPaths);
  } catch (err) {
    console.warn('[STORAGE_ROLLBACK_WARN] Failed to delete orphaned storage files:', err);
  }
}

/**
 * Attempts to download an asset from Supabase Storage by trying canonical and legacy path formats.
 */
export async function downloadRegistrationFileFromSupabase(
  supabase: SupabaseClient,
  registrationCode: string,
  fileName: string,
  bucketName = DEFAULT_STORAGE_BUCKET
): Promise<{ buffer: Buffer | null; contentType: string; fileName: string; error: Error | null }> {
  const safeCode = registrationCode.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeName = sanitizeStorageFileName(fileName);

  // Candidate paths in order of preference
  const candidatePaths = [
    `registrations/${safeCode}/${safeName}`,
    `registrations/${safeCode}/${fileName}`,
    `${safeCode}/${safeName}`,
    `${safeCode}/${fileName}`,
    safeName,
    fileName,
  ];

  for (const objPath of candidatePaths) {
    try {
      const { data: blob, error } = await supabase.storage
        .from(bucketName)
        .download(objPath);

      if (blob && !error) {
        const arrayBuf = await blob.arrayBuffer();
        return {
          buffer: Buffer.from(arrayBuf),
          contentType: blob.type || 'application/octet-stream',
          fileName: safeName,
          error: null,
        };
      }
    } catch {}
  }

  return {
    buffer: null,
    contentType: 'application/octet-stream',
    fileName: safeName,
    error: new Error(`Berkas "${safeName}" tidak ditemukan di Supabase Storage bucket "${bucketName}".`),
  };
}

export function isConvertibleImage(fileName: string, mimeType?: string): boolean {
  if (mimeType && mimeType.startsWith('image/') && !mimeType.includes('svg')) {
    return true;
  }
  const ext = fileName.toLowerCase().split('.').pop() || '';
  return ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'].includes(ext);
}

