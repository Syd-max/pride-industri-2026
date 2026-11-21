export const boothBucket = 'pride-visitor-booths';
export const boothColumns = 'id, brand_name, logo_path, catalog_path, whatsapp_number, category';
export const boothCategories = ['Kuliner', 'Fesyen', 'Kriya'] as const;
export type BoothCategory = typeof boothCategories[number];

export function isBoothCategory(value: unknown): value is BoothCategory {
  return boothCategories.some(category => category === value);
}
export const boothCatalogMaxMb = 10;
export const boothAssetRules = {
  logo: { limit: 2 * 1024 * 1024, formats: { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' } },
  catalog: { limit: boothCatalogMaxMb * 1024 * 1024, formats: { 'application/pdf': 'pdf' } },
};

export type BoothAsset = keyof typeof boothAssetRules;

export interface VisitorBooth {
  id: string;
  brand_name: string;
  logo_path: string;
  catalog_path: string;
  whatsapp_number: string;
  category: BoothCategory | null;
}

export function boothSearchPattern(value: string): string {
  return '%' + value.trim().replace(/[\\%_]/g, '\\$&') + '%';
}

export function boothAssetExtension(asset: BoothAsset, contentType: string): string | undefined {
  const formats: Record<string, string> = boothAssetRules[asset].formats;
  return Object.hasOwn(formats, contentType) ? formats[contentType] : undefined;
}

export function normalizeBoothWhatsApp(input: string): string | undefined {
  const value = input.trim();
  if (!/^\+?[\d\s().-]+$/.test(value)) return undefined;
  let number = value.replace(/\D/g, '');
  if (value.startsWith('+')) {
    if (number.startsWith('0')) return undefined;
  } else if (number.startsWith('00')) {
    number = number.slice(2);
  } else if (number.startsWith('0')) {
    number = '62' + number.slice(1);
  }
  return /^[1-9][0-9]{7,14}$/.test(number) ? number : undefined;
}
