'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { boothBucket, boothColumns, type VisitorBooth } from '@/lib/visitor-booths';

type PublicBooth = VisitorBooth & { logoUrl: string; catalogUrl: string };

const button = 'flex min-h-11 items-center justify-center rounded-xl px-3 py-2 text-center text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

export default function VisitorBoothSection() {
  const [booths, setBooths] = useState<PublicBooth[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function readBooths() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('visitor_booths').select(boothColumns)
          .order('created_at').order('id').abortSignal(controller.signal).returns<VisitorBooth[]>();
        if (controller.signal.aborted) return;
        if (error) throw error;
        const storage = supabase.storage.from(boothBucket);
        setBooths(data.map(booth => ({
          ...booth,
          logoUrl: storage.getPublicUrl(booth.logo_path).data.publicUrl,
          catalogUrl: storage.getPublicUrl(booth.catalog_path).data.publicUrl,
        })));
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    }
    void readBooths();
    return () => controller.abort();
  }, []);

  return (
    <section id="visitor-booth" aria-labelledby="visitor-booth-heading" className="relative py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 id="visitor-booth-heading" className="mb-6 text-center text-3xl font-black leading-tight tracking-tight text-slate-900 sm:mb-8 sm:text-4xl lg:text-5xl">
          Visitor Booth
        </h2>
        {failed ? (
          <p role="status" className="text-center text-sm text-slate-700">Booth belum bisa dimuat. Segarkan halaman untuk mencoba lagi.</p>
        ) : !booths ? (
          <p role="status" className="text-center text-sm text-slate-600">Memuat booth…</p>
        ) : booths.length === 0 ? (
          <p className="text-center text-sm text-slate-600">Belum ada booth tersedia.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {booths.map(booth => (
              <li key={booth.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:p-5">
                {/* The uploaded image comes from the public Storage CDN. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={booth.logoUrl} alt="" loading="lazy" decoding="async" width={240} height={112} className="mx-auto h-28 w-full object-contain" />
                <h3 className="mb-4 mt-3 break-words text-center text-base font-bold text-slate-900">{booth.brand_name}</h3>
                <div className="mt-auto grid gap-2">
                  <a href={booth.catalogUrl} target="_blank" rel="noopener noreferrer" className={button + ' border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'}>
                    View Catalog
                  </a>
                  <a href={`https://wa.me/${booth.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className={button + ' bg-emerald-700 text-white hover:bg-emerald-800'}>
                    Pre-Order via WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
