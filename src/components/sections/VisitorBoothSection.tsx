'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { boothBucket, boothColumns, type VisitorBooth } from '@/lib/visitor-booths';

type PublicBooth = VisitorBooth & { logoUrl: string; catalogUrl: string };
type BoothList = { booths: PublicBooth[]; count: number };
type BoothOverlay = { kind: 'gallery' } | { kind: 'brand'; booth: PublicBooth; fromGallery: boolean };

const previewSize = 10;
const galleryPageSize = 100;
const button = 'flex min-h-11 items-center justify-center rounded-xl px-3 py-2 text-center text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

async function loadBooths(start: number, size: number, signal: AbortSignal): Promise<BoothList> {
  const supabase = createClient();
  const { data, count, error } = await supabase.from('visitor_booths').select(boothColumns, start === 0 ? { count: 'exact' } : undefined)
    .order('created_at').order('id').range(start, start + size - 1).abortSignal(signal).returns<VisitorBooth[]>();
  if (error) throw error;
  const storage = supabase.storage.from(boothBucket);
  return {
    booths: data.map(booth => ({
      ...booth,
      logoUrl: storage.getPublicUrl(booth.logo_path).data.publicUrl,
      catalogUrl: storage.getPublicUrl(booth.catalog_path).data.publicUrl,
    })),
    count: count ?? data.length,
  };
}

function BoothLogoGrid({ booths, preview, onSelect }: { booths: PublicBooth[]; preview?: boolean; onSelect: (booth: PublicBooth) => void }) {
  return (
    <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 lg:gap-4">
      {booths.map((booth, index) => (
        <li key={booth.id} className={preview && index >= 6 ? (index >= 8 ? 'hidden lg:block' : 'hidden sm:block') : undefined}>
          <button type="button" aria-label={booth.brand_name} aria-haspopup="dialog" onClick={() => onSelect(booth)} className="flex h-20 w-full min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-200/90 bg-white p-2 shadow-2xs hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:h-24 sm:p-3 lg:h-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={booth.logoUrl} alt="" loading="lazy" decoding="async" width={160} height={96} className="w-full object-contain" style={{ height: '100%' }} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function VisitorBoothSection() {
  const [preview, setPreview] = useState<BoothList | null>(null);
  const [failed, setFailed] = useState(false);
  const [overlay, setOverlay] = useState<BoothOverlay | null>(null);
  const [allBooths, setAllBooths] = useState<PublicBooth[] | null>(null);
  const [galleryFailed, setGalleryFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dialogTitle = useRef<HTMLHeadingElement>(null);
  const galleryOpen = overlay?.kind === 'gallery';
  const selected = overlay?.kind === 'brand' ? overlay.booth : null;
  const galleryBooths = allBooths ?? (preview && preview.count <= preview.booths.length ? preview.booths : null);

  useEffect(() => {
    const controller = new AbortController();
    async function readPreview() {
      try {
        const data = await loadBooths(0, previewSize, controller.signal);
        if (!controller.signal.aborted) setPreview(data);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    }
    void readPreview();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!galleryOpen || !preview || galleryBooths || galleryFailed) return;
    const controller = new AbortController();
    async function readGallery(initial: BoothList) {
      try {
        const booths = [...initial.booths];
        for (let start = booths.length; start < initial.count; start += galleryPageSize) {
          const page = await loadBooths(start, galleryPageSize, controller.signal);
          if (controller.signal.aborted) return;
          booths.push(...page.booths);
          if (page.booths.length < galleryPageSize) break;
        }
        setAllBooths(booths);
      } catch {
        if (!controller.signal.aborted) setGalleryFailed(true);
      }
    }
    void readGallery(preview);
    return () => controller.abort();
  }, [galleryOpen, preview, galleryBooths, galleryFailed]);

  useEffect(() => {
    const modal = dialog.current;
    if (!overlay || !modal) return;
    if (!modal.open) modal.showModal();
    modal.scrollTop = 0;
    dialogTitle.current?.focus({ preventScroll: true });
  }, [overlay]);

  function openGallery() {
    setGalleryFailed(false);
    setOverlay({ kind: 'gallery' });
  }

  function closeOverlay() {
    dialog.current?.close();
    setOverlay(null);
  }

  return (
    <section id="visitor-booth" aria-labelledby="visitor-booth-heading" className="relative py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 id="visitor-booth-heading" className="mb-6 text-center text-3xl font-black leading-tight tracking-tight text-slate-900 sm:mb-8 sm:text-4xl lg:text-5xl">
          Visitor Booth
        </h2>
        {failed ? (
          <p role="status" className="text-center text-sm text-slate-700">Booth belum bisa dimuat. Segarkan halaman untuk mencoba lagi.</p>
        ) : !preview ? (
          <p role="status" className="text-center text-sm text-slate-600">Memuat booth…</p>
        ) : preview.booths.length === 0 ? (
          <p className="text-center text-sm text-slate-600">Belum ada booth tersedia.</p>
        ) : (
          <>
            <BoothLogoGrid booths={preview.booths} preview onSelect={booth => setOverlay({ kind: 'brand', booth, fromGallery: false })} />
            {preview.count > 6 && (
              <div className={`mt-4 flex justify-center ${preview.count <= 8 ? 'sm:hidden' : preview.count <= 10 ? 'lg:hidden' : ''}`}>
                <button type="button" aria-haspopup="dialog" className={button + ' cursor-pointer border border-slate-200 bg-white px-5 text-slate-800 hover:bg-slate-50'} onClick={openGallery}>View All</button>
              </div>
            )}
          </>
        )}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="visitor-booth-dialog-title"
        data-lenis-prevent
        onCancel={event => {
          event.preventDefault();
          closeOverlay();
        }}
        className={`fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/90 bg-white shadow-xl backdrop:bg-slate-950/50 ${galleryOpen ? 'max-w-5xl' : 'max-w-md'}`}
      >
        {overlay && (
          <>
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
              <h3 ref={dialogTitle} id="visitor-booth-dialog-title" tabIndex={-1} className="min-w-0 self-center break-words text-lg font-bold text-slate-900 focus:outline-none">{selected?.brand_name ?? 'Visitor Booth'}</h3>
              <div className="flex shrink-0 gap-2">
                {overlay.kind === 'brand' && overlay.fromGallery && (
                  <button type="button" onClick={openGallery} className={button + ' cursor-pointer text-slate-700 hover:bg-slate-100'}>Kembali</button>
                )}
                <button type="button" onClick={closeOverlay} className={button + ' cursor-pointer border border-slate-200 text-slate-700 hover:bg-slate-100'}>Tutup</button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {selected ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.logoUrl} alt="" decoding="async" width={240} height={128} className="mx-auto mb-4 w-full object-contain" style={{ height: '8rem' }} />
                  <div className="grid gap-2">
                    <a href={selected.catalogUrl} target="_blank" rel="noopener noreferrer" className={button + ' border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'}>View Catalog</a>
                    <a href={`https://wa.me/${selected.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className={button + ' bg-emerald-700 text-white hover:bg-emerald-800'}>Pre-Order via WhatsApp</a>
                  </div>
                </>
              ) : galleryFailed ? (
                <p role="status" className="py-4 text-center text-sm text-slate-700">Galeri belum bisa dimuat. Tutup dan buka kembali untuk mencoba lagi.</p>
              ) : galleryBooths ? (
                <BoothLogoGrid booths={galleryBooths} onSelect={booth => setOverlay({ kind: 'brand', booth, fromGallery: true })} />
              ) : (
                <p role="status" className="py-4 text-center text-sm text-slate-600">Memuat booth…</p>
              )}
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
