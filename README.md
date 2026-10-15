# PRIDE Industri 2026 — Digital Festival Experience

> **Production-Ready Interactive Festival Website & Operational Portal**  
> **Event:** PRIDE Industri 2026 (Pagelaran Ragam Inovasi dan Eksistensi)  
> **Tanggal:** 27–28 November 2026  
> **Lokasi:** Braga City Walk & Ballroom Hotel Papandayan, Kota Bandung  
> **Penyelenggara:** PT Rahman Ramadhan Diandra (RRD Organizer) & Dinas Perdagangan dan Perindustrian Kota Bandung  

---

## 1. Ringkasan Fitur yang Telah Diimplementasikan

### A. Front-Facing Experience (Digital Fashion Editorial)
- **Cinematic Camera-Inspired Opening (`CinematicIntro.tsx`):**
  - Animasi aperture ring & view finder terinspirasi fashion editorial photography.
  - Efek shutter flash halus dan transisi logo resmi PRIDE 2026.
  - Mematuhi `prefers-reduced-motion` dan otomatis skip pada sesi kunjungan berulang (`sessionStorage`).
- **Hero Composition dengan Efek Kedalaman Braga (`HeroSection.tsx`):**
  - Menggunakan foto asli koridor Braga (`LANDING_BG.jpg`) dengan teknik parallax berbobot ringan.
  - Logo resmi PRIDE 2026 (`LOGO_PRIDE_INDUSTRI.png`) tampil menyatu dengan kedalaman siluet arsitektur ala depth-effect lockscreen modern smartphone.
  - Micro-badge resmi, editorial subheading, dan tombol Call-To-Action terarah.
- **Hitung Mundur Acara Presisi (`CountdownSection.tsx` & `Countdown.tsx`):**
  - Jam presisi berbasis Waktu Indonesia Barat (`Asia/Jakarta`).
  - Mendukung 3 status siklus: **Sebelum Acara (Upcoming)**, **Saat Berlangsung (LIVE SEKARANG)**, dan **Setelah Acara Berakhir (Selesai)**.
  - Animasi spring digit tanpa blocking prerender Next.js 16.
- **Editorial Brand Storytelling & Program Timeline:**
  - Penjelasan program kurasi IKM (Fesyen, Kriya, Kuliner), sertifikasi Halal (100), SNI (3), Uji Mutu (100), dan penganugerahan SIINAS di Ballroom Hotel Papandayan.
  - Tab switcher interaktif jadwal Hari 1 (27 Nov) dan Hari 2 (28 Nov).
- **Fitur Khusus Dua Kompetisi Resmi:**
  - Ringkasan tema, total hadiah per kategori, linimasa penjurian.
  - Tautan unduhan langsung file PDF syarat ketentuan asli yang tersimpan lokal (`/syarat-desain-kemasan.pdf` dan `/syarat-video-lokal.pdf`).
  - Tombol pendaftaran terpisah menuju form spesifik masing-masing lomba.
- **Panduan Lokasi & Peta:**
  - Alamat terkonfirmasi Braga City Walk (Jl. Braga No. 99–101) & Ballroom Papandayan.
  - Akses transportasi dan tombol langsung petunjuk arah Google Maps.
- **FAQ Interaktif & Kebijakan Privasi:**
  - Tanya jawab akurat berdasarkan aturan resmi.
  - Halaman transparansi data `/privacy`.

---

### B. Formulir Pendaftaran Terpisah (2 Halaman Mandiri)
- **1. Lomba Desain Kemasan (`/competition/desain-kemasan`):**
  - Mengakomodasi produk kuliner olahan berbahan dasar lokal (umbi-umbian, tahu, tempe, oncom, dll).
  - Deklarasi penggunaan Artificial Intelligence (AI) sesuai pasal lomba (hanya untuk final mockup dengan bukti proses kreatif).
  - Konfirmasi Pakta Integritas, Surat Pernyataan Persetujuan, dan kepatuhan keputusan juri mutlak.
- **2. Lomba Video 1 Menit (60 Detik) (`/competition/video-lokal`):**
  - Pilihan 4 kategori resmi: *Fesyen*, *Kuliner*, *Kriya*, atau *PRIDE Industri 2026*.
  - Input akun Instagram / TikTok publik.
  - Panduan durasi maksimal 60 detik Reels dan tagar wajib `#disdaginkotabandung #kemilau #prideindustri2026 #bdg #eventbandung #bandung` serta tag akun resmi.
- **Keamanan & Validasi Server (`/api/register`):**
  - Validasi ketat format email, nomor telepon Indonesia (`+62` / `08`), dan pencegahan registrasi ganda per email per kompetisi.
  - Pembuatan kode unik registrasi publik (contoh: `PRIDE-DK-20261021-AB12CD` / `PRIDE-VL-...`) tanpa mengekspos ID database internal.
  - Perlindungan Rate Limiting terhadap serangan form submission spam.

---

### C. Presensi Real-Time Kamera Browser (`/check-in`)
- **Workflow Pindai QR Gate Nyata (`QrScanner` via `@zxing/browser`):**
  - Peserta membuka halaman `/check-in` di smartphone.
  - Sistem meminta izin kamera browser secara eksplisit (*user-initiated*).
  - Kamera utama/belakang (*environment facing mode*) aktif dengan overlay viewfinder dan garis laser scan animasi.
  - Memindai QR Code resmi yang terpasang di gate Braga City Walk.
  - Validasi atomic di backend (`/api/check-in`): mencocokkan kode peserta, keabsahan token gate, serta mencegah pemindaian ganda.
  - Tampilan tiket/lencana hadir digital secara instan.
  - Tersedia opsi fallback input manual jika kamera smartphone bermasalah/ditolak izinnya.

---

### D. Private Admin Dashboard (`/admin`)
- **Autentikasi Terproteksi:**
  - Dilindungi middleware dan session cookie HTTP-only (`/admin/login`).
- **Dashboard Ringkasan Operasional (`/admin`):**
  - Metrik live: Total pendaftar, jumlah per lomba, jumlah peserta hadir di Braga, persentase kehadiran, dan peserta yang belum check-in.
  - Feed real-time aktivitas pendaftaran dan pemindaian gate terkini (auto-refresh).
- **Direktori Peserta & Pencarian (`/admin/participants`):**
  - Pencarian multi-kolom (nama, email, no HP, kode unik).
  - Filter kategori lomba dan status presensi.
  - Modal detail lengkap melihat seluruh isian data dan deklarasi Pakta Integritas.
  - Tombol manual toggle check-in (bisa menandai hadir manual jika diperlukan panitia).
  - **Fitur Ekspor CSV** data peserta secara instan.
- **Verifikasi Status Registrasi (`/admin/registrations`):**
  - Seleksi status: `pending`, `confirmed`, `finalist` (lolos grand final), atau `disqualified`.
- **Log Presensi Gate (`/admin/check-ins`):**
  - Riwayat presensi waktu nyata per gate dengan timestamp WIB.
- **Generator & Cetak QR Gate (`/admin/competitions`):**
  - Panel generator QR token gate untuk panitia.
  - Tombol cetak langsung standee/poster QR gate beresolusi tinggi untuk ditempel di pintu masuk Braga City Walk.

---

## 2. Struktur Proyek

```
pride-industri-2026/
├── public/
│   ├── LANDING_BG.jpg              # Foto asli pemandangan koridor Braga
│   ├── LOGO_PRIDE_INDUSTRI.png     # Logo resmi PRIDE Industri 2026
│   ├── syarat-desain-kemasan.pdf   # Dokumen asli S&K Lomba Desain Kemasan
│   └── syarat-video-lokal.pdf      # Dokumen asli S&K Lomba Video 1 Menit
├── src/
│   ├── app/
│   │   ├── page.tsx                # Homepage utama (SPA sections)
│   │   ├── layout.tsx              # Root layout & Google Fonts Playfair + Inter
│   │   ├── globals.css             # Design tokens, typography, glassmorphism
│   │   ├── privacy/page.tsx        # Kebijakan privasi data peserta
│   │   ├── check-in/page.tsx       # Pemindai QR gate kamera browser
│   │   ├── competition/
│   │   │   ├── desain-kemasan/page.tsx # Form Lomba Desain Kemasan
│   │   │   └── video-lokal/page.tsx    # Form Lomba Video 1 Menit
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Sidebar navigasi admin
│   │   │   ├── login/page.tsx      # Login autentikasi panitia
│   │   │   ├── page.tsx            # Dashboard overview & metrik operasional
│   │   │   ├── participants/page.tsx # Direktori peserta & ekspor CSV
│   │   │   ├── registrations/page.tsx# Verifikasi & seleksi finalis
│   │   │   ├── check-ins/page.tsx  # Monitoring presensi gate
│   │   │   └── competitions/page.tsx # Katalog lomba & cetak QR Gate
│   │   └── api/
│   │       ├── register/route.ts   # Endpoint pendaftaran + deduplikasi
│   │       ├── check-in/route.ts   # Endpoint validasi QR gate
│   │       ├── admin/auth/route.ts # Endpoint sesi panitia
│   │       └── admin/data/route.ts # Endpoint data peserta & update status
│   ├── components/
│   │   ├── ui/
│   │   │   ├── CinematicIntro.tsx  # Intro pembuka kamera sinematik
│   │   │   ├── Navbar.tsx          # Navbar sticky editorial responsif
│   │   │   └── Countdown.tsx       # Hitung mundur presisi WIB
│   │   └── sections/
│   │       ├── HeroSection.tsx     # Hero Braga depth-effect
│   │       ├── CountdownSection.tsx# Section hitung mundur
│   │       ├── AboutSection.tsx    # Narasi festival, IKM & SIINAS
│   │       ├── ProgramSection.tsx  # Rundown acara Hari 1 & 2
│   │       ├── CompetitionSection.tsx # Kartu 2 kompetisi resmi
│   │       ├── LocationSection.tsx # Info venue & petunjuk peta
│   │       ├── FaqSection.tsx      # Accordion FAQ
│   │       └── Footer.tsx          # Footer & kanal resmi
│   ├── config/
│   │   └── event.ts                # Single source of truth seluruh data acara
│   ├── lib/
│   │   ├── utils.ts                # Helper kode registrasi, sanitasi, rate limit
│   │   └── supabase/
│   │       ├── client.ts           # Browser client (public anon key)
│   │       └── server.ts           # Server client & admin service-role client
│   ├── types/
│   │   └── index.ts                # TypeScript strict schema definitions
│   └── middleware.ts               # Proteksi rute /admin/* via session cookie
├── supabase/
│   └── migrations/
│       └── 001_pride_initial_schema.sql # Skema database terisolasi prefix pride_
├── .env.example                    # Template variabel lingkungan
└── README.md                       # Dokumentasi lengkap
```

---

## 3. Skema & Isolasi Supabase (Indscript Coexistence)

Database dirancang dengan **isolasi ketat** agar dapat berjalan di dalam proyek Supabase Indscript yang sudah ada tanpa konflik nama tabel, trigger, atau hak akses:

### Tabel Baru yang Dibuat (Prefix `pride_`):
1. `pride_competitions`: Katalog kompetisi resmi (*desain-kemasan* & *video-lokal*).
2. `pride_registrations`: Penyimpanan seluruh data pendaftaran peserta, alamat, media sosial, dan status persetujuan Pakta Integritas. Dilengkapi indeks unik email per lomba untuk mencegah pendaftaran berulang.
3. `pride_gate_tokens`: Token QR gerbang masuk acara beserta jendela masa berlaku tanggal.
4. `pride_checkins`: Catatan presensi atomik per peserta dengan referensi gate token.
5. `pride_admin_audit_log`: Pencatatan log aktivitas perubahan status oleh panitia.

### Keamanan Row Level Security (RLS):
- Seluruh tabel mengaktifkan RLS (`ENABLE ROW LEVEL SECURITY`).
- `pride_competitions`: Terbuka dibaca publik (`SELECT`), hanya dapat diubah oleh `service_role`.
- `pride_registrations`, `pride_gate_tokens`, `pride_checkins`: Dibatasi secara ketat hanya dapat diakses melalui server API menggunakan `service_role`. Browser publik tidak dapat melakukan query langsung untuk melihat data peserta lain.

### Cara Menjalankan Migrasi di Supabase:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) proyek Anda.
2. Masuk ke menu **SQL Editor**.
3. Buat query baru, salin seluruh isi file:
   `supabase/migrations/001_pride_initial_schema.sql`
4. Klik tombol **Run**. Migrasi akan otomatis membuat tabel-tabel ber-prefix `pride_` beserta index dan RLS tanpa memengaruhi tabel Indscript yang sudah ada.

---

## 4. Variabel Lingkungan (`.env.local`)

Buat file `.env.local` di dalam folder `pride-industri-2026`:

```env
# URL & Anon Key Supabase (Dari Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service Role Key (SERVER ONLY - Jangan pernah ekspos ke client!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Kredensial Login Panitia (Admin Dashboard)
ADMIN_EMAIL=admin@prideindustri.id
ADMIN_PASSWORD=pride2026admin

# URL Domain
NEXT_PUBLIC_SITE_URL=https://pride-industri-2026.vercel.app
```

> **Catatan Pengujian:** Sistem telah dilengkapi *graceful memory fallback*. Jika variabel Supabase belum diisi, pendaftaran dan check-in tetap dapat diuji secara penuh di mode lokal/preview tanpa error!

---

## 5. Menjalankan di Lokal

```bash
# Masuk ke folder proyek
cd "c:\TACTLINK\PRIDE INDUSTRI\pride-industri-2026"

# Jalankan server pengembangan
npm run dev

# Buka di browser:
# Website Publik: http://localhost:3000
# Dashboard Panitia: http://localhost:3000/admin (Login: admin@prideindustri.id / pride2026admin)
```

Untuk menguji build produksi:
```bash
npm run build
npm run start
```

---

## 6. Panduan Deployment ke GitHub & Vercel

### Langkah 1: Push ke GitHub
```bash
cd "c:\TACTLINK\PRIDE INDUSTRI\pride-industri-2026"
git add .
git commit -m "feat: complete production-ready PRIDE Industri 2026 digital experience"
git branch -M main
git remote add origin https://github.com/USERNAME/pride-industri-2026.git
git push -u origin main
```

### Langkah 2: Deploy ke Vercel
1. Masuk ke [Vercel Dashboard](https://vercel.com) dan klik **Add New Project**.
2. Pilih repositori GitHub `pride-industri-2026`.
3. Pada bagian **Root Directory**, pastikan mengarah ke `pride-industri-2026` (jika repo berada di subfolder) atau root.
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
5. Klik **Deploy**. Vercel akan otomatis melakukan proses build Next.js dan menghasilkan URL produksi siap pakai.

---

## 7. Status Pengujian & Verifikasi

- **Next.js Production Build:** `✓ Compiled successfully (18/18 static & dynamic routes)`
- **TypeScript Strict Checking:** Lulus tanpa error tipe (`TS2339 / TS2353 resolved`).
- **Verifikasi Download PDF:** Berkas `syarat-desain-kemasan.pdf` dan `syarat-video-lokal.pdf` terverifikasi aktif dengan ukuran penuh (~4.4 MB).
- **Verifikasi Pendaftaran:** Endpoint `/api/register` berhasil menghasilkan kode unik peserta, memvalidasi input, dan mencegah duplikasi email.
- **Verifikasi QR Check-In:** Endpoint `/api/check-in` memvalidasi token gate dan mencegah check-in berulang.
- **Verifikasi Admin:** Proteksi rute `/admin` melalui middleware bekerja dengan benar.
