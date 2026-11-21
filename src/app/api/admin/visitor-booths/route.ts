import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isOrganizerAdmin } from '@/lib/admin-access';
import { sanitizeString } from '@/lib/utils';
import { boothAssetExtension, boothAssetRules, boothBucket, boothColumns, isBoothCategory, normalizeBoothWhatsApp, type BoothAsset, type VisitorBooth } from '@/lib/visitor-booths';

type Supabase = Awaited<ReturnType<typeof createClient>>;
const uuidPattern = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const uuid = new RegExp(`^${uuidPattern}$`);
const assetPaths = {
  logo: new RegExp(`^${uuidPattern}/logo-${uuidPattern}\\.(png|jpg|webp)$`),
  catalog: new RegExp(`^${uuidPattern}/catalog-${uuidPattern}\\.pdf$`),
};

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

async function withAdmin(request: Request, action: (supabase: Supabase, body: Record<string, unknown>, id: string) => Promise<Response>) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !isOrganizerAdmin(data.user)) return fail('Masuk sebagai admin untuk mengelola booth.', 401);

    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== 'string' || !uuid.test(body.id)) return fail('ID booth tidak valid.', 400);
    return await action(supabase, body, body.id);
  } catch (error) {
    console.error('[VISITOR_BOOTHS_ADMIN]', error);
    return fail('Perubahan booth gagal diproses. Silakan coba lagi.', 503);
  }
}

function matchesPath(path: unknown, id: string, asset: BoothAsset): path is string {
  return typeof path === 'string' && path.startsWith(id + '/') && assetPaths[asset].test(path);
}

async function removeAssets(supabase: Supabase, paths: string[]) {
  if (!paths.length) return;
  try {
    const { error } = await supabase.storage.from(boothBucket).remove(paths);
    if (error) console.error('[VISITOR_BOOTH_STORAGE_CLEANUP]', error);
  } catch (error) {
    console.error('[VISITOR_BOOTH_STORAGE_CLEANUP]', error);
  }
}

async function validAsset(supabase: Supabase, path: string, asset: BoothAsset) {
  const bucket = supabase.storage.from(boothBucket);
  const { data, error } = await bucket.info(path);
  if (error || !data) return false;
  const size = Number(data.size ?? data.metadata?.size);
  const contentType = data.contentType ?? data.metadata?.mimetype;
  const extension = typeof contentType === 'string' ? boothAssetExtension(asset, contentType) : undefined;
  if (!extension || !path.endsWith('.' + extension) || !Number.isSafeInteger(size) || size < 1 || size > boothAssetRules[asset].limit) return false;

  const { data: { publicUrl } } = bucket.getPublicUrl(path);
  const response = await fetch(publicUrl, { headers: { Range: 'bytes=0-15' }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
  const reader = response.body?.getReader();
  if (!reader) return false;
  try {
    if (!response.ok) return false;
    const bytes = new Uint8Array(16);
    let length = 0;
    while (length < bytes.length) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = value.subarray(0, bytes.length - length);
      bytes.set(chunk, length);
      length += chunk.length;
    }
    const header = Buffer.from(bytes.subarray(0, length));
    if (extension === 'pdf') return header.subarray(0, 5).toString() === '%PDF-';
    if (extension === 'png') return header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    if (extension === 'jpg') return header[0] === 255 && header[1] === 216 && header[2] === 255;
    return header.subarray(0, 4).toString() === 'RIFF' && header.subarray(8, 12).toString() === 'WEBP';
  } finally {
    await reader.cancel().catch(() => {});
  }
}

export async function POST(request: Request) {
  return withAdmin(request, async (supabase, body, id) => {
    const { asset, contentType, size } = body;
    if ((asset !== 'logo' && asset !== 'catalog') || typeof contentType !== 'string'
      || typeof size !== 'number' || !Number.isSafeInteger(size) || size < 1 || size > boothAssetRules[asset].limit) {
      return fail('Ukuran atau jenis berkas booth tidak sesuai.', 400);
    }
    const extension = boothAssetExtension(asset, contentType);
    if (!extension) return fail('Format berkas booth tidak didukung.', 400);
    const path = `${id}/${asset}-${randomUUID()}.${extension}`;
    const { data, error } = await supabase.storage.from(boothBucket).createSignedUploadUrl(path);
    if (error) throw error;
    return NextResponse.json({ path, token: data.token });
  });
}

export async function PUT(request: Request) {
  return withAdmin(request, async (supabase, body, id) => {
    const brandName = sanitizeString(body.brand_name);
    const whatsapp = typeof body.whatsapp_number === 'string' ? normalizeBoothWhatsApp(body.whatsapp_number) : undefined;
    if (!brandName || brandName.length > 120 || !whatsapp || typeof body.editing !== 'boolean') {
      return fail('Isi nama brand dan nomor WhatsApp yang valid.', 400);
    }

    const { data: previous, error: lookupError } = await supabase.from('visitor_booths')
      .select(boothColumns).eq('id', id).maybeSingle<VisitorBooth>();
    if (lookupError) throw lookupError;
    if (body.editing !== Boolean(previous)) return fail('Data booth sudah berubah. Muat ulang halaman.', 409);

    const category = body.category === undefined ? previous?.category ?? null : body.category;
    if (body.category !== undefined && !isBoothCategory(category)) return fail('Pilih kategori Kuliner, Fesyen, atau Kriya.', 400);

    const logoPath = body.logo_path ?? previous?.logo_path;
    const catalogPath = body.catalog_path ?? previous?.catalog_path;
    if (!matchesPath(logoPath, id, 'logo') || !matchesPath(catalogPath, id, 'catalog')) {
      return fail('Unggah logo dan katalog PDF untuk booth ini.', 400);
    }
    const fresh = [
      { asset: 'logo', path: logoPath, previous: previous?.logo_path },
      { asset: 'catalog', path: catalogPath, previous: previous?.catalog_path },
    ] as const;
    for (const file of fresh) {
      if (file.path !== file.previous && !(await validAsset(supabase, file.path, file.asset))) {
        return fail(file.asset === 'logo' ? 'Logo tidak dapat dibaca sebagai gambar.' : 'Katalog tidak dapat dibaca sebagai PDF.', 400);
      }
    }

    const values = { brand_name: brandName, logo_path: logoPath, catalog_path: catalogPath, whatsapp_number: whatsapp, category };
    const table = supabase.from('visitor_booths');
    let mutation = previous
      ? table.update(values).eq('id', id).eq('logo_path', previous.logo_path).eq('catalog_path', previous.catalog_path)
        .eq('brand_name', previous.brand_name).eq('whatsapp_number', previous.whatsapp_number)
      : table.insert({ id, ...values });
    if (previous) mutation = previous.category === null ? mutation.is('category', null) : mutation.eq('category', previous.category);
    const { data, error } = await mutation.select(boothColumns).maybeSingle<VisitorBooth>();
    if (error?.code === '23505' || (!error && !data)) return fail('Data booth sudah berubah. Muat ulang halaman.', 409);
    if (error || !data) throw error;

    await removeAssets(supabase, fresh.flatMap(file => file.previous && file.previous !== file.path ? [file.previous] : []));
    return NextResponse.json({ booth: data });
  });
}

export async function DELETE(request: Request) {
  return withAdmin(request, async (supabase, body, id) => {
    if (body.discard === true) {
      const { data, error } = await supabase.from('visitor_booths')
        .select('logo_path, catalog_path').eq('id', id).maybeSingle();
      if (error) throw error;
      const paths = [];
      if (matchesPath(body.logo_path, id, 'logo') && data?.logo_path !== body.logo_path) paths.push(body.logo_path);
      if (matchesPath(body.catalog_path, id, 'catalog') && data?.catalog_path !== body.catalog_path) paths.push(body.catalog_path);
      await removeAssets(supabase, paths);
      return new Response(null, { status: 204 });
    }

    const { data, error } = await supabase.from('visitor_booths')
      .delete().eq('id', id).select('logo_path, catalog_path').maybeSingle();
    if (error) throw error;
    if (!data) return fail('Booth sudah dihapus atau tidak ditemukan.', 404);
    await removeAssets(supabase, [data.logo_path, data.catalog_path]);
    return new Response(null, { status: 204 });
  });
}
