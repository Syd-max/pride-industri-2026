import type { SupabaseClient } from '@supabase/supabase-js';
import { getSafeStorageContentType, sanitizeStorageFileName } from '@/lib/storage';

const MB = 1024 * 1024;

export const registrationFileLimits = {
  design_file: 10 * MB,
  master_file: 8 * MB,
  pakta_integritas_file: 2 * MB,
  surat_persetujuan_file: 2 * MB,
  document_file: 5 * MB,
  tactlink_qr_file: 2 * MB,
} as const;

export type RegistrationFileField = keyof typeof registrationFileLimits;

export function isRegistrationFileField(value: unknown): value is RegistrationFileField {
  return typeof value === 'string' && Object.hasOwn(registrationFileLimits, value);
}

export function registrationUploadName(field: RegistrationFileField, name: string) {
  return `${field}__${sanitizeStorageFileName(name)}`;
}

export function displayRegistrationFileName(name: string) {
  const separator = name.indexOf('__');
  return separator !== -1 && isRegistrationFileField(name.slice(0, separator))
    ? name.slice(separator + 2)
    : name;
}

export async function uploadRegistrationFile(
  supabase: SupabaseClient,
  code: string,
  field: RegistrationFileField,
  file: File
) {
  const response = await fetch('/api/register/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, field, name: file.name, size: file.size }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Gagal menyiapkan unggahan.');

  const { error } = await supabase.storage.from(result.bucket).uploadToSignedUrl(
    result.path, result.token, file, { contentType: getSafeStorageContentType(file) },
  );
  if (error) throw new Error(`Gagal mengunggah berkas "${file.name}": ${error.message}`);
  return result.fileName as string;
}
