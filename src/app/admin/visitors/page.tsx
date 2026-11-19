'use client';

import { useEffect, useRef, useState } from 'react';
import { formatJakartaDateTime } from '@/lib/utils';
import { visitorFormTitles, type VisitorFormSubmission, type VisitorFormType } from '@/lib/visitor-forms';

const button = 'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50 disabled:cursor-default disabled:opacity-50';

export default function AdminVisitorsPage() {
  const [query, setQuery] = useState<{ type: VisitorFormType; page: number }>({ type: 'booth', page: 0 });
  const [listing, setListing] = useState<{ data: VisitorFormSubmission[]; count: number } | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<VisitorFormSubmission | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const pages = Math.max(1, Math.ceil((listing?.count ?? 0) / 20));

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/api/admin/visitor-forms?' + new URLSearchParams({ type: query.type, page: String(query.page) }), {
          signal: controller.signal,
          cache: 'no-store',
        });
        const body = await response.json();
        if (!response.ok || !body.success) throw new Error(body.error || 'Data visitor gagal dimuat.');
        if (!controller.signal.aborted) setListing({ data: body.data, count: body.count });
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Data visitor gagal dimuat.');
      }
    }
    void load();
    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [selected]);

  function navigate(type: VisitorFormType, page = 0) {
    setListing(null);
    setError('');
    setQuery({ type, page });
  }

  function closeDetails() {
    dialog.current?.close();
    setSelected(null);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-12">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Data Visitor</h1>
      <div role="tablist" aria-label="Jenis form visitor" className="flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1">
        {(['booth', 'umum'] as const).map(type => (
          <button key={type} id={'visitor-tab-' + type} type="button" role="tab" aria-selected={query.type === type} aria-controls="visitor-data-panel" className={'min-h-11 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ' + (query.type === type ? 'bg-white text-blue-800 shadow-2xs' : 'text-neutral-600 hover:bg-white/60')} onClick={() => navigate(type)}>
            {visitorFormTitles[type]}
          </button>
        ))}
      </div>
      <div id="visitor-data-panel" role="tabpanel" aria-labelledby={'visitor-tab-' + query.type} className="rounded-2xl border border-neutral-200/80 bg-white">
        {error ? (
          <div className="space-y-3 p-5"><p role="alert" className="text-sm text-rose-700">{error}</p><button type="button" className={button} onClick={() => navigate(query.type, query.page)}>Coba lagi</button></div>
        ) : !listing ? (
          <p role="status" className="p-5 text-sm text-neutral-600">Memuat data visitor…</p>
        ) : listing.data.length === 0 ? (
          <p className="p-5 text-sm text-neutral-600">Belum ada isian form {visitorFormTitles[query.type]}.</p>
        ) : (
          <>
            <ul aria-label={'Daftar ' + visitorFormTitles[query.type]} className="divide-y divide-neutral-200/80">
              {listing.data.map(row => (
                <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
                  <div className="min-w-0">
                    <h2 className="break-words text-sm font-semibold">{row.full_name}</h2>
                    <p className="mt-1 break-words text-sm text-neutral-600">{row.visitor_type === 'booth' ? row.brand_name : row.domicile}</p>
                    <p className="mt-1 text-xs text-neutral-500">{formatJakartaDateTime(row.created_at)}</p>
                  </div>
                  <button type="button" aria-haspopup="dialog" className={button} onClick={() => setSelected(row)}>Detail</button>
                </li>
              ))}
            </ul>
            {pages > 1 && (
              <nav aria-label="Halaman data visitor" className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3">
                <span className="text-sm text-neutral-600">Halaman {query.page + 1} dari {pages}</span>
                <div className="flex gap-2">
                  <button type="button" className={button} disabled={query.page === 0} onClick={() => navigate(query.type, query.page - 1)}>Sebelumnya</button>
                  <button type="button" className={button} disabled={query.page + 1 >= pages} onClick={() => navigate(query.type, query.page + 1)}>Berikutnya</button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
      <dialog ref={dialog} aria-labelledby="visitor-details-heading" onCancel={event => { event.preventDefault(); closeDetails(); }} className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-white p-5 text-[#1d1d1f] shadow-xl backdrop:bg-black/45 sm:p-6">
        {selected && (
          <>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id="visitor-details-heading" className="text-lg font-semibold">{visitorFormTitles[selected.visitor_type]}</h2>
              <button type="button" onClick={closeDetails} className={button}>Tutup</button>
            </div>
            <dl className="space-y-4 text-sm">
              <div><dt className="text-neutral-500">Nama</dt><dd className="mt-1 break-words font-medium">{selected.full_name}</dd></div>
              {selected.visitor_type === 'booth' ? (
                <>
                  <div><dt className="text-neutral-500">Nama Brand Usaha</dt><dd className="mt-1 break-words font-medium">{selected.brand_name}</dd></div>
                  <div><dt className="text-neutral-500">Produk Usaha</dt><dd className="mt-1 break-words font-medium">{selected.product_name}</dd></div>
                  <div><dt className="text-neutral-500">Konsultasi tentang</dt><dd className="mt-1 break-words font-medium">{selected.consultation_topic}</dd></div>
                </>
              ) : (
                <>
                  <div><dt className="text-neutral-500">Domisili</dt><dd className="mt-1 break-words font-medium">{selected.domicile}</dd></div>
                  <div><dt className="text-neutral-500">Umur (tahun)</dt><dd className="mt-1 font-medium">{selected.age}</dd></div>
                </>
              )}
              <div><dt className="text-neutral-500">Link PO WhatsApp</dt><dd className="mt-1 break-all"><a href={selected.whatsapp_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{selected.whatsapp_url}</a></dd></div>
              <div><dt className="text-neutral-500">Link E-Katalog</dt><dd className="mt-1 break-all"><a href={selected.catalog_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{selected.catalog_url}</a></dd></div>
              <div><dt className="text-neutral-500">Waktu pengiriman</dt><dd className="mt-1 font-medium">{formatJakartaDateTime(selected.created_at)}</dd></div>
            </dl>
          </>
        )}
      </dialog>
    </div>
  );
}
