'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { consultationTopics, validateVisitorForm, visitorFormTitles, type VisitorFormType } from '@/lib/visitor-forms';

const inputClass = 'mt-2 block min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600';

export default function VisitorForm({ type }: { type: VisitorFormType }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const submissionId = useRef<string | null>(null);
  const inFlight = useRef(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = new FormData(event.currentTarget);
    const fields = Object.fromEntries(form);
    const values = validateVisitorForm({
      ...fields,
      visitor_type: type,
      age: type === 'umum' && String(fields.age).trim() !== '' ? Number(fields.age) : null,
    });
    if (!values.values) {
      setError(values.error);
      return;
    }
    submissionId.current ??= crypto.randomUUID();
    inFlight.current = true;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/visitor-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId.current, ...values.values }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Data belum tersimpan. Silakan coba lagi.');
      setSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Koneksi terputus. Silakan coba lagi.');
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#edf4f8] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" aria-label="PRIDE Industri 2026, beranda">
            <Image src="/LOGO_PRIDE_INDUSTRI.png" alt="PRIDE Industri 2026" width={160} height={95} style={{ height: '64px', width: 'auto', objectFit: 'contain' }} priority />
          </Link>
          <Link href="/#visitor-forms" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
            <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Kembali
          </Link>
        </header>
        <main className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-8">
          <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Form {visitorFormTitles[type]}</h1>
          {sent ? (
            <div role="status" className="space-y-5">
              <p className="text-base font-semibold text-emerald-800">Data berhasil dikirim.</p>
              <Link href="/#visitor-forms" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">Kembali ke beranda</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
              <fieldset disabled={busy} className="grid min-w-0 gap-5">
                <label className="min-w-0 text-sm font-semibold">
                  Nama
                  <input name="full_name" autoComplete="name" maxLength={160} className={inputClass} required />
                </label>
                {type === 'booth' ? (
                  <>
                    <label className="min-w-0 text-sm font-semibold">
                      Nama Brand Usaha
                      <input name="brand_name" autoComplete="organization" maxLength={160} className={inputClass} required />
                    </label>
                    <label className="min-w-0 text-sm font-semibold">
                      Produk Usaha
                      <input name="product_name" maxLength={500} className={inputClass} required />
                    </label>
                    <label className="min-w-0 text-sm font-semibold">
                      Konsultasi tentang
                      <select name="consultation_topic" defaultValue="" className={inputClass} required>
                        <option value="" disabled>Pilih konsultasi</option>
                        {consultationTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                      </select>
                    </label>
                  </>
                ) : (
                  <div className="grid min-w-0 gap-5 sm:grid-cols-[1fr_9rem]">
                    <label className="min-w-0 text-sm font-semibold">
                      Domisili
                      <input name="domicile" autoComplete="address-level2" maxLength={300} className={inputClass} required />
                    </label>
                    <label className="min-w-0 text-sm font-semibold">
                      Umur (tahun)
                      <input name="age" type="number" inputMode="numeric" min={0} max={120} step={1} className={inputClass} required />
                    </label>
                  </div>
                )}
                <label className="min-w-0 text-sm font-semibold">
                  Link PO WhatsApp
                  <input name="whatsapp_url" type="url" inputMode="url" maxLength={2048} placeholder="https://wa.me/..." autoCapitalize="none" spellCheck={false} className={inputClass} required />
                </label>
                <label className="min-w-0 text-sm font-semibold">
                  Link E-Katalog
                  <input name="catalog_url" type="url" inputMode="url" maxLength={2048} autoCapitalize="none" spellCheck={false} className={inputClass} required />
                </label>
                <button type="submit" className="mt-1 min-h-12 cursor-pointer rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">{busy ? 'Mengirim…' : 'Kirim'}</button>
              </fieldset>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
