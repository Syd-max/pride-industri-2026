import { catalogLink } from '@/lib/check-in-visitors';
import { sanitizeString } from '@/lib/utils';

export const consultationTopics = [
  'Sertifikat Halal',
  'Sertifikat Uji Mutu',
  'SNI',
  'Desain Kemasan',
  'Desain Fashion',
  'Pelatihan',
  'Pameran',
  'Surat keterangan Asal (SKA)',
] as const;

export type VisitorFormType = 'booth' | 'umum';

export const visitorFormTitles: Record<VisitorFormType, string> = {
  booth: 'Visitor Booth',
  umum: 'Visitor Umum',
};

export interface VisitorFormSubmission {
  id: string;
  visitor_type: VisitorFormType;
  full_name: string;
  brand_name: string | null;
  product_name: string | null;
  consultation_topic: string | null;
  domicile: string | null;
  age: number | null;
  whatsapp_url: string | null;
  catalog_url: string | null;
  created_at: string;
}

export type VisitorFormValues = Omit<VisitorFormSubmission, 'id' | 'created_at'>;

export function visitorWhatsAppLink(value: string): string | undefined {
  const link = catalogLink(value);
  if (!link) return undefined;
  const url = new URL(link);
  if (url.protocol !== 'https:') return undefined;
  if (url.hostname === 'wa.me' && (/^\/[1-9][0-9]{7,14}\/?$/.test(url.pathname)
    || /^\/message\/[a-z0-9]+\/?$/i.test(url.pathname))) return url.href;
  if (['api.whatsapp.com', 'web.whatsapp.com', 'www.whatsapp.com', 'whatsapp.com'].includes(url.hostname)
    && /^\/send\/?$/.test(url.pathname) && /^[1-9][0-9]{7,14}$/.test(url.searchParams.get('phone') ?? '')) return url.href;
  return undefined;
}

export function validateVisitorForm(body: unknown): { values: VisitorFormValues; error?: never } | { error: string; values?: never } {
  if (!body || typeof body !== 'object') return { error: 'Data formulir tidak valid.' };
  const fields = body as Record<string, unknown>;
  const type = fields.visitor_type;
  if (type !== 'booth' && type !== 'umum') return { error: 'Jenis visitor tidak valid.' };
  const name = sanitizeString(fields.full_name);
  if (!name || name.length > 160) return { error: 'Isi nama lengkap, maksimal 160 karakter.' };
  const whatsappInput = sanitizeString(fields.whatsapp_url);
  const catalogInput = sanitizeString(fields.catalog_url);
  const whatsapp = whatsappInput ? visitorWhatsAppLink(whatsappInput) : null;
  const catalog = catalogInput ? catalogLink(catalogInput) : null;
  if (whatsappInput && (!whatsapp || whatsapp.length > 2048)) return { error: 'Link PO WhatsApp tidak valid.' };
  if (catalogInput && (!catalog || catalog.length > 2048)) return { error: 'Link E-Katalog tidak valid.' };

  const common = { visitor_type: type, full_name: name, whatsapp_url: whatsapp ?? null, catalog_url: catalog ?? null };
  if (type === 'booth') {
    const brand = sanitizeString(fields.brand_name);
    const product = sanitizeString(fields.product_name);
    const topic = sanitizeString(fields.consultation_topic);
    if (!brand || brand.length > 160) return { error: 'Isi nama brand usaha, maksimal 160 karakter.' };
    if (!product || product.length > 500) return { error: 'Isi produk usaha, maksimal 500 karakter.' };
    if (!consultationTopics.some(option => option === topic)) return { error: 'Pilih salah satu topik konsultasi yang tersedia.' };
    return { values: { ...common, visitor_type: type, brand_name: brand, product_name: product, consultation_topic: topic, domicile: null, age: null } };
  }
  const domicile = sanitizeString(fields.domicile);
  if (!domicile || domicile.length > 300) return { error: 'Isi domisili, maksimal 300 karakter.' };
  if (typeof fields.age !== 'number' || !Number.isInteger(fields.age) || fields.age < 0 || fields.age > 120) {
    return { error: 'Isi umur dengan bilangan bulat antara 0 dan 120 tahun.' };
  }
  return { values: { ...common, visitor_type: type, brand_name: null, product_name: null, consultation_topic: null, domicile, age: fields.age } };
}
