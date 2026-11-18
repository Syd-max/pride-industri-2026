'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { boothAssetExtension, boothAssetRules, boothBucket, boothCatalogMaxMb, boothColumns, normalizeBoothWhatsApp, type BoothAsset, type VisitorBooth } from '@/lib/visitor-booths';

const endpoint = '/api/admin/visitor-booths';
const button = 'inline-flex min-h-10 items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
const input = 'mt-1.5 block w-full min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-[#0071e3] focus:outline-none';

function mutate(method: 'POST' | 'PUT' | 'DELETE', data: object) {
  return fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function errorFrom(response: Response) {
  const body = await response.json().catch(() => null);
  return new Error(body?.error || 'Perubahan booth gagal diproses. Silakan coba lagi.');
}

export default function AdminVisitorBoothsPage() {
  const [booths, setBooths] = useState<VisitorBooth[] | null>(null);
  const [editing, setEditing] = useState<VisitorBooth | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const { data, error } = await createClient().from('visitor_booths').select(boothColumns)
          .order('created_at').order('id').abortSignal(controller.signal).returns<VisitorBooth[]>();
        if (error) throw error;
        if (!controller.signal.aborted) setBooths(data);
      } catch {
        if (!controller.signal.aborted) setLoadFailed(true);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !booths) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const brandName = String(form.get('brand_name') || '').trim();
    const whatsapp = normalizeBoothWhatsApp(String(form.get('whatsapp_number') || ''));
    if (!brandName || !whatsapp) {
      setError('Isi nama brand dan nomor WhatsApp yang valid.');
      return;
    }

    const files: [BoothAsset, FormDataEntryValue | null][] = [['logo', form.get('logo')], ['catalog', form.get('catalog')]];
    for (const [asset, file] of files) {
      const label = asset === 'logo' ? 'Logo' : 'Katalog PDF';
      if (!(file instanceof File) || !file.size) {
        if (editing) continue;
        setError(`${label} wajib diunggah.`);
        return;
      }
      const tooLarge = file.size > boothAssetRules[asset].limit;
      if (tooLarge || !boothAssetExtension(asset, file.type)) {
        setError(tooLarge && asset === 'catalog'
          ? `Katalog PDF maksimal ${boothCatalogMaxMb} MB.`
          : `${label} melebihi batas ukuran atau formatnya tidak sesuai.`);
        return;
      }
    }

    const id = editing?.id ?? crypto.randomUUID();
    const assets: { logo_path?: string; catalog_path?: string } = {};
    let canDiscard = true;
    setBusy(true);
    setError('');
    try {
      const storage = createClient().storage.from(boothBucket);
      for (const [asset, file] of files) {
        if (!(file instanceof File) || !file.size) continue;
        const access = await mutate('POST', { id, asset, contentType: file.type, size: file.size });
        if (!access.ok) throw await errorFrom(access);
        const { path, token } = await access.json();
        assets[asset === 'logo' ? 'logo_path' : 'catalog_path'] = path;
        const { error } = await storage.uploadToSignedUrl(path, token, file, { contentType: file.type });
        if (error) throw new Error('Unggahan gagal. Coba unggah kembali.');
      }

      canDiscard = false;
      const response = await mutate('PUT', { id, editing: Boolean(editing), brand_name: brandName, whatsapp_number: whatsapp, ...assets });
      if (!response.ok) {
        canDiscard = response.status < 500;
        throw await errorFrom(response);
      }
      const { booth }: { booth: VisitorBooth } = await response.json();
      setBooths(previous => previous && (editing
        ? previous.map(row => row.id === booth.id ? booth : row)
        : [...previous, booth]));
      formElement.reset();
      setEditing(null);
    } catch (error) {
      if (canDiscard && Object.keys(assets).length) {
        await mutate('DELETE', { id, discard: true, ...assets }).catch(() => {});
      }
      setError(error instanceof Error ? error.message : 'Booth gagal disimpan.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(booth: VisitorBooth) {
    if (busy || !window.confirm(`Hapus booth "${booth.brand_name}"?`)) return;
    setBusy(true);
    setError('');
    try {
      const response = await mutate('DELETE', { id: booth.id });
      if (!response.ok) throw await errorFrom(response);
      setBooths(previous => previous?.filter(row => row.id !== booth.id) ?? null);
      if (editing?.id === booth.id) setEditing(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Booth gagal dihapus.');
    } finally {
      setBusy(false);
    }
  }

  const editingStorage = editing ? createClient().storage.from(boothBucket) : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">Visitor Booth</h1>
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {loadFailed ? (
        <p role="alert" className="rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm text-neutral-700">Daftar booth gagal dimuat. Segarkan halaman untuk mencoba lagi.</p>
      ) : !booths ? (
        <p role="status" className="text-sm text-neutral-600">Memuat booth…</p>
      ) : (
        <>
          <form key={editing?.id ?? 'create'} onSubmit={save} className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs sm:p-5">
            <h2 className="mb-4 text-base font-semibold">{editing ? 'Edit Brand' : 'Tambah Brand'}</h2>
            <fieldset disabled={busy} className="grid min-w-0 gap-4 sm:grid-cols-2">
              <label className="min-w-0 text-sm font-medium">
                Nama brand
                <input name="brand_name" defaultValue={editing?.brand_name} className={input} maxLength={120} required />
              </label>
              <label className="min-w-0 text-sm font-medium">
                Nomor WhatsApp
                <input name="whatsapp_number" type="tel" defaultValue={editing ? '+' + editing.whatsapp_number : undefined} placeholder="08… atau +62…" className={input} required />
              </label>
              <div className="min-w-0 text-sm font-medium">
                <label htmlFor="booth-logo">Logo brand (JPG, PNG, WebP, maks. 2 MB)</label>
                <input id="booth-logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp" className={input} required={!editing} />
                {editing && editingStorage && (
                  <a href={editingStorage.getPublicUrl(editing.logo_path).data.publicUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-700 underline">Lihat logo saat ini</a>
                )}
              </div>
              <div className="min-w-0 text-sm font-medium">
                <label htmlFor="booth-catalog">Katalog brand (PDF, maks. {boothCatalogMaxMb} MB)</label>
                <input id="booth-catalog" name="catalog" type="file" accept="application/pdf,.pdf" className={input} required={!editing} />
                {editing && editingStorage && (
                  <a href={editingStorage.getPublicUrl(editing.catalog_path).data.publicUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-700 underline">Lihat katalog saat ini</a>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button type="submit" className={button + ' border-blue-700 bg-blue-700 text-white'}>{busy ? 'Memproses…' : 'Simpan'}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setError(''); }} className={button}>Batal</button>}
              </div>
            </fieldset>
          </form>
          {booths.length === 0 ? (
            <p className="rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm text-neutral-600">Belum ada booth tersedia.</p>
          ) : (
            <ul aria-label="Daftar brand" className="divide-y divide-neutral-200/80 rounded-2xl border border-neutral-200/80 bg-white">
              {booths.map(booth => (
                <li key={booth.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold">{booth.brand_name}</h3>
                    <p className="mt-0.5 text-sm text-neutral-600">+{booth.whatsapp_number}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" disabled={busy} className={button} onClick={() => { setEditing(booth); setError(''); }}>Edit</button>
                    <button type="button" disabled={busy} className={button + ' text-rose-700'} onClick={() => void remove(booth)}>Hapus</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
