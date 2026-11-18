'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { boothAssetExtension, boothAssetRules, boothBucket, boothCatalogMaxMb, boothColumns, normalizeBoothWhatsApp, type BoothAsset, type VisitorBooth } from '@/lib/visitor-booths';

const endpoint = '/api/admin/visitor-booths';
const pageSize = 8;
const button = 'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium disabled:cursor-default disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
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

function BoothFileInput({ asset, label, accept, currentUrl }: { asset: BoothAsset; label: string; accept: string; currentUrl?: string }) {
  const [fileName, setFileName] = useState('');
  const id = `booth-${asset}`;
  const fileLabel = fileName || (currentUrl ? 'File sudah tersimpan' : 'Belum ada file dipilih');

  return (
    <div className="min-w-0 text-sm font-medium">
      <label htmlFor={id}>{label}</label>
      <div className="relative mt-1.5 flex min-h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 focus-within:border-blue-600">
        <input
          id={id}
          name={asset}
          type="file"
          accept={accept}
          required={!currentUrl}
          aria-describedby={`${id}-file-name`}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
          onChange={event => setFileName(event.currentTarget.files?.[0]?.name ?? '')}
        />
        <span aria-hidden="true" className="shrink-0 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-semibold">
          {fileName || currentUrl ? 'Ganti file' : 'Pilih file'}
        </span>
        <span id={`${id}-file-name`} className="min-w-0 break-all text-neutral-600">{fileLabel}</span>
      </div>
      {currentUrl && (
        <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-700 underline">
          {asset === 'logo' ? 'Lihat logo saat ini' : 'Lihat katalog saat ini'}
        </a>
      )}
    </div>
  );
}

export default function AdminVisitorBoothsPage() {
  const [listing, setListing] = useState<{ booths: VisitorBooth[]; count: number } | null>(null);
  const [listingRequest, setListingRequest] = useState({ page: 0 });
  const [editor, setEditor] = useState<{ booth: VisitorBooth | null } | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const { page } = listingRequest;
  const editing = editor?.booth;
  const pageCount = Math.ceil((listing?.count ?? 0) / pageSize);

  useEffect(() => {
    const controller = new AbortController();
    const start = listingRequest.page * pageSize;
    async function load() {
      try {
        const { data, count, error, status } = await createClient().from('visitor_booths').select(boothColumns, { count: 'exact' })
          .order('created_at').order('id').range(start, start + pageSize - 1).abortSignal(controller.signal).returns<VisitorBooth[]>();
        if (controller.signal.aborted) return;
        if (start > 0 && (status === 416 || (!error && !data?.length))) {
          setListingRequest({ page: 0 });
          return;
        }
        if (error || !data || count === null) throw error ?? new Error('Daftar booth tidak tersedia.');
        setListing({ booths: data, count });
      } catch {
        if (!controller.signal.aborted) setLoadFailed(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [listingRequest]);

  useEffect(() => {
    if (editor && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [editor]);

  function showPage(requestedPage: number) {
    setListing(null);
    setLoadFailed(false);
    setError('');
    setListingRequest({ page: requestedPage });
  }

  function openEditor(booth: VisitorBooth | null) {
    setError('');
    setEditor({ booth });
  }

  function closeEditor() {
    dialog.current?.close();
    setEditor(null);
    setError('');
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !listing || !editor) return;
    const form = new FormData(event.currentTarget);
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
      closeEditor();
      showPage(editing ? page : Math.floor(listing.count / pageSize));
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
    if (busy || !listing || !window.confirm(`Hapus booth "${booth.brand_name}"?`)) return;
    setBusy(true);
    setError('');
    try {
      const response = await mutate('DELETE', { id: booth.id });
      if (!response.ok) throw await errorFrom(response);
      showPage(page > 0 && listing.booths.length === 1 ? page - 1 : page);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Booth gagal dihapus.');
    } finally {
      setBusy(false);
    }
  }

  const editingStorage = editing ? createClient().storage.from(boothBucket) : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/admin" aria-label="Kembali ke Overview" className={button + ' shrink-0 gap-2 bg-white hover:bg-neutral-50'}>
            <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">Visitor Booth</h1>
        </div>
        <button type="button" aria-haspopup="dialog" disabled={busy || !listing} className={button + ' border-blue-700 bg-blue-700 text-white'} onClick={() => openEditor(null)}>Tambah Brand</button>
      </div>
      {!editor && error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {loadFailed ? (
        <p role="alert" className="rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm text-neutral-700">Daftar booth gagal dimuat. Segarkan halaman untuk mencoba lagi.</p>
      ) : !listing ? (
        <p role="status" className="text-sm text-neutral-600">Memuat booth…</p>
      ) : listing.booths.length === 0 ? (
        <p className="rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm text-neutral-600">Belum ada booth tersedia.</p>
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 bg-white">
          <ul aria-label="Daftar brand" className="divide-y divide-neutral-200/80">
            {listing.booths.map(booth => (
              <li key={booth.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <h2 className="break-words text-sm font-semibold">{booth.brand_name}</h2>
                  <p className="mt-0.5 text-sm text-neutral-600">+{booth.whatsapp_number}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" aria-haspopup="dialog" disabled={busy} className={button + ' hover:bg-neutral-50'} onClick={() => openEditor(booth)}>Edit</button>
                  <button type="button" disabled={busy} className={button + ' text-rose-700 hover:bg-rose-50'} onClick={() => void remove(booth)}>Hapus</button>
                </div>
              </li>
            ))}
          </ul>
          {pageCount > 1 && (
            <nav aria-label="Halaman daftar brand" className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/80 px-4 py-3">
              <span className="text-sm text-neutral-600">Halaman {page + 1} dari {pageCount}</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={busy || page === 0} className={button} onClick={() => showPage(page - 1)}>Sebelumnya</button>
                <button type="button" disabled={busy || page + 1 >= pageCount} className={button} onClick={() => showPage(page + 1)}>Berikutnya</button>
              </div>
            </nav>
          )}
        </div>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="booth-editor-title"
        onCancel={event => {
          event.preventDefault();
          if (!busy) closeEditor();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200/80 bg-white p-4 text-[#1d1d1f] shadow-xl backdrop:bg-black/45 sm:p-6"
      >
        {editor && (
          <form onSubmit={save}>
            <h2 id="booth-editor-title" className="mb-4 text-lg font-semibold">{editing ? 'Edit Brand' : 'Tambah Brand'}</h2>
            {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <fieldset disabled={busy} className="grid min-w-0 gap-4 sm:grid-cols-2">
              <label className="min-w-0 text-sm font-medium">
                Nama brand
                <input name="brand_name" defaultValue={editing?.brand_name} className={input} maxLength={120} required />
              </label>
              <label className="min-w-0 text-sm font-medium">
                Nomor WhatsApp
                <input name="whatsapp_number" type="tel" defaultValue={editing ? '+' + editing.whatsapp_number : undefined} placeholder="08… atau +62…" className={input} required />
              </label>
              <BoothFileInput
                asset="logo"
                label="Logo brand (JPG, PNG, WebP, maks. 2 MB)"
                accept="image/jpeg,image/png,image/webp"
                currentUrl={editing && editingStorage ? editingStorage.getPublicUrl(editing.logo_path).data.publicUrl : undefined}
              />
              <BoothFileInput
                asset="catalog"
                label={`Katalog brand (PDF, maks. ${boothCatalogMaxMb} MB)`}
                accept="application/pdf,.pdf"
                currentUrl={editing && editingStorage ? editingStorage.getPublicUrl(editing.catalog_path).data.publicUrl : undefined}
              />
              <div className="flex flex-wrap justify-end gap-2 sm:col-span-2">
                <button type="button" onClick={closeEditor} className={button}>Batal</button>
                <button type="submit" className={button + ' border-blue-700 bg-blue-700 text-white'}>{busy ? 'Memproses…' : 'Simpan'}</button>
              </div>
            </fieldset>
          </form>
        )}
      </dialog>
    </div>
  );
}
