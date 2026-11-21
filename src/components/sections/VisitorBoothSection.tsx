'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { boothBucket, boothCategories, boothColumns, isBoothCategory, type BoothCategory, type VisitorBooth } from '@/lib/visitor-booths';

type PublicBooth = VisitorBooth & { logoUrl: string; catalogUrl: string };
type BoothList = { booths: PublicBooth[]; count: number };
type BoothOverlay = { kind: 'gallery' } | { kind: 'brand'; booth: PublicBooth; fromGallery: boolean };

const galleryPageSize = 100;
const button = 'flex min-h-11 items-center justify-center rounded-xl px-3 py-2 text-center text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

async function loadBooths(start: number, size: number, signal: AbortSignal, category: BoothCategory | 'All'): Promise<BoothList> {
  const supabase = createClient();
  let query = supabase.from('visitor_booths').select(boothColumns, start === 0 ? { count: 'exact' } : undefined);
  if (category !== 'All') query = query.eq('category', category);
  const { data, count, error } = await query
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

function CategoryFilter({ value, onChange, inDialog = false }: { value: BoothCategory | 'All'; onChange: (value: string) => void; inDialog?: boolean }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    container.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
    function dismiss(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return (
    <div ref={container} className="relative w-11 shrink-0" onKeyDown={event => {
      if (!open) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus();
      } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const options = Array.from(container.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []);
        const index = options.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[next]?.focus();
      }
    }}>
      <button ref={trigger} type="button" aria-label="Kategori Showcase" title={`Kategori Showcase: ${value}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)} className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${open || value !== 'All' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
          <path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z" />
        </svg>
      </button>
      {open && (
        <div id={menuId} role="listbox" aria-label="Kategori Showcase" className={`${inDialog ? 'relative right-[calc(12rem-2.75rem)]' : 'absolute right-0 top-full'} z-30 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10`}>
          {(['All', ...boothCategories] as const).map(category => (
            <button key={category} type="button" role="option" aria-selected={value === category} onClick={() => {
              onChange(category);
              setOpen(false);
              trigger.current?.focus();
            }} className={`flex min-h-11 w-full cursor-pointer items-center justify-between rounded-xl px-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${value === category ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              {category}
              {value === category && <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  const [category, setCategory] = useState<BoothCategory | 'All'>('All');
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
        const response = await fetch(`/api/visitor-booths/preview?category=${encodeURIComponent(category)}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Showcase belum bisa dimuat.');
        const data: BoothList = await response.json();
        if (!controller.signal.aborted) setPreview(data);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    }
    void readPreview();
    return () => controller.abort();
  }, [category]);

  useEffect(() => {
    if (!galleryOpen || !preview || galleryBooths || galleryFailed) return;
    const controller = new AbortController();
    async function readGallery(initial: BoothList) {
      try {
        const booths: PublicBooth[] = [];
        for (let start = 0; start < initial.count; start += galleryPageSize) {
          const page = await loadBooths(start, galleryPageSize, controller.signal, category);
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
  }, [galleryOpen, preview, galleryBooths, galleryFailed, category]);

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

  function changeCategory(value: string) {
    if (value === category) return;
    if (value !== 'All' && !isBoothCategory(value)) return;
    setCategory(value);
    setPreview(null);
    setFailed(false);
    setAllBooths(null);
    setGalleryFailed(false);
  }

  function closeOverlay() {
    dialog.current?.close();
    setOverlay(null);
  }

  return (
    <section id="visitor-booth" aria-labelledby="visitor-booth-heading" className="relative py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-2 sm:mb-8">
          <h2 id="visitor-booth-heading" className="col-start-2 text-center text-4xl leading-tight tracking-tight text-slate-900 sm:text-6xl" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 500, fontStyle: 'italic' }}>
            Showcase
          </h2>
          <CategoryFilter value={category} onChange={changeCategory} />
        </div>
        {category !== 'All' && <p className="mb-4 text-center text-sm font-semibold text-blue-700">{category}</p>}
        {failed ? (
          <p role="status" className="text-center text-sm text-slate-700">Booth belum bisa dimuat. Segarkan halaman untuk mencoba lagi.</p>
        ) : !preview ? (
          <p role="status" className="text-center text-sm text-slate-600">Memuat booth…</p>
        ) : preview.booths.length === 0 ? (
          <p className="text-center text-sm text-slate-600">{preview.count ? 'Brand dengan data lengkap belum tersedia.' : category === 'All' ? 'Belum ada booth tersedia.' : `Belum ada brand kategori ${category}.`}</p>
        ) : (
          <BoothLogoGrid booths={preview.booths} preview onSelect={booth => setOverlay({ kind: 'brand', booth, fromGallery: false })} />
        )}
        {preview && !failed && preview.count > Math.min(6, preview.booths.length) && (
          <div className={`mt-4 flex justify-center ${preview.count <= preview.booths.length ? (preview.count <= 8 ? 'sm:hidden' : preview.count <= 10 ? 'lg:hidden' : '') : ''}`}>
            <button type="button" aria-haspopup="dialog" className={button + ' cursor-pointer border border-slate-200 bg-white px-5 text-slate-800 hover:bg-slate-50'} onClick={openGallery}>View All</button>
          </div>
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
              <h3 ref={dialogTitle} id="visitor-booth-dialog-title" tabIndex={-1} className="min-w-0 break-words pt-2 text-lg font-bold text-slate-900 focus:outline-none">{selected?.brand_name ?? (category === 'All' ? 'Showcase' : `Showcase · ${category}`)}</h3>
              <div className="flex shrink-0 items-start gap-2">
                {galleryOpen && <CategoryFilter value={category} onChange={changeCategory} inDialog />}
                {overlay.kind === 'brand' && overlay.fromGallery && (
                  <button type="button" onClick={openGallery} className={button + ' cursor-pointer text-slate-700 hover:bg-slate-100'}>Kembali</button>
                )}
                <button type="button" onClick={closeOverlay} aria-label="Tutup" className={button + ' h-11 w-11 shrink-0 cursor-pointer border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
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
                galleryBooths.length ? <BoothLogoGrid booths={galleryBooths} onSelect={booth => setOverlay({ kind: 'brand', booth, fromGallery: true })} /> : <p role="status" className="py-4 text-center text-sm text-slate-600">Belum ada brand kategori {category}.</p>
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
