import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { boothAssetRules, boothBucket, boothColumns, isBoothCategory, normalizeBoothWhatsApp, type VisitorBooth } from '@/lib/visitor-booths';

// The existing empty catalog is a valid PDF, so MIME checks alone accept it.
const emptyCatalogHash = '9b8d681dc7f9df3f106582b2094775ed1879108b2506e963506b5f17737bcffe';

async function hasCatalog(url: string) {
  const response = await fetch(url, { headers: { Range: 'bytes=0-4095' }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
  const reader = response.body?.getReader();
  if (!reader) return false;
  try {
    if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) return false;
    const chunks: Buffer[] = [];
    let size = 0;
    while (size < 4096) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = Buffer.from(value.subarray(0, 4096 - size));
      chunks.push(chunk);
      size += chunk.length;
    }
    const prefix = Buffer.concat(chunks);
    return prefix.subarray(0, 5).toString() === '%PDF-'
      && createHash('sha256').update(prefix).digest('hex') !== emptyCatalogHash;
  } finally {
    await reader.cancel().catch(() => {});
  }
}

async function hasVisibleLogo(url: string) {
  const response = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) return false;
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length || bytes.length > boothAssetRules.logo.limit) return false;
  const thumbnail = await sharp(bytes, { limitInputPixels: 24_000_000 })
    .resize({ width: 128, height: 128, fit: 'inside' }).flatten({ background: '#fff' }).png().toBuffer();
  const { channels } = await sharp(thumbnail).stats();
  return channels.slice(0, 3).some(channel => channel.max - channel.min > 2);
}

export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get('category');
  if (category && category !== 'All' && !isBoothCategory(category)) {
    return NextResponse.json({ error: 'Kategori tidak valid.' }, { status: 400 });
  }
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!, { auth: { persistSession: false, autoRefreshToken: false } });
    const storage = supabase.storage.from(boothBucket);
    const booths: VisitorBooth[] = [];
    const fallback: VisitorBooth[] = [];
    let count = 0;
    for (let start = 0; start === 0 || start < count; start += 100) {
      let query = supabase.from('visitor_booths').select(boothColumns, { count: 'exact' });
      if (isBoothCategory(category)) query = query.eq('category', category);
      const result = await query.order('created_at').order('id').range(start, start + 99).returns<VisitorBooth[]>();
      if (result.error || !result.data || result.count === null) throw result.error ?? new Error('Daftar booth tidak tersedia.');
      count = result.count;
      for (let offset = 0; offset < result.data.length; offset += 10) {
        const ready = await Promise.all(result.data.slice(offset, offset + 10).map(async booth => {
          if (!booth.brand_name.trim() || !booth.logo_path?.trim() || !booth.catalog_path?.trim() || !normalizeBoothWhatsApp(booth.whatsapp_number)) return null;
          try {
            const catalog = storage.getPublicUrl(booth.catalog_path).data.publicUrl;
            const logo = storage.getPublicUrl(booth.logo_path).data.publicUrl;
            const complete = await hasCatalog(catalog);
            if (!complete && fallback.length >= 10) return null;
            return await hasVisibleLogo(logo) ? { booth, complete } : null;
          } catch {
            return null;
          }
        }));
        for (const entry of ready) {
          if (entry?.complete) booths.push(entry.booth);
          else if (entry && fallback.length < 10) fallback.push(entry.booth);
        }
        if (booths.length >= 10) break;
      }
      if (booths.length >= 10 || result.data.length < 100) break;
    }
    return NextResponse.json({
      booths: [...booths, ...fallback].slice(0, 10).map(booth => ({ ...booth, logoUrl: storage.getPublicUrl(booth.logo_path).data.publicUrl, catalogUrl: storage.getPublicUrl(booth.catalog_path).data.publicUrl })),
      count,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[VISITOR_BOOTH_PREVIEW]', error);
    return NextResponse.json({ error: 'Showcase belum bisa dimuat.' }, { status: 503 });
  }
}
