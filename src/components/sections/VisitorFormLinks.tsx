import Link from 'next/link';

export default function VisitorFormLinks() {
  return (
    <section id="visitor-forms" aria-label="Form visitor PRIDE Industri 2026" className="relative px-4 pb-10 sm:px-6 sm:pb-14">
      <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:px-8">
        <Link href="/visitor-booth" className="flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-emerald-700/15 bg-emerald-50 px-5 py-4 text-emerald-900 hover:bg-emerald-100">
          <span><span className="block text-xs font-semibold">Isi Form</span><span className="mt-1 block text-lg font-bold">Visitor Booth</span></span>
          <span aria-hidden="true" className="text-2xl">↗</span>
        </Link>
        <Link href="/visitor-umum" className="flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-blue-700/15 bg-blue-50 px-5 py-4 text-blue-900 hover:bg-blue-100">
          <span><span className="block text-xs font-semibold">Isi Form</span><span className="mt-1 block text-lg font-bold">Visitor Umum</span></span>
          <span aria-hidden="true" className="text-2xl">↗</span>
        </Link>
      </div>
    </section>
  );
}
