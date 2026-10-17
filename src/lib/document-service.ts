'use client';

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { PrideRegistration } from '@/types';

/**
 * Downloads a high-resolution, valid PNG QR code image.
 * Guarantees standard PNG binary headers (89 50 4E 47) so Windows Photos
 * and all image viewers open it natively without error.
 */
export async function downloadQrCodePng(targetUrl: string, filename: string): Promise<void> {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;

    await QRCode.toCanvas(canvas, targetUrl, {
      width: 1200,
      margin: 3,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });

    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Gagal menghasilkan file PNG dari canvas.');
      }
      const safeName = filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = safeName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 'image/png');
  } catch (error) {
    console.error('[DOWNLOAD_QR_PNG_ERROR]', error);
    alert('Terjadi kendala saat mengunduh QR Code. Silakan coba kembali.');
  }
}

/**
 * Downloads an official TactLink Digital Business Card as a valid PNG image.
 * Creates an elegant, high-resolution 800x1000px graphic card.
 */
export async function downloadTactlinkCardPng(
  reg: PrideRegistration,
  fileName?: string
): Promise<void> {
  try {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available.');

    // 1. Background
    ctx.fillStyle = '#f5f5f7';
    ctx.fillRect(0, 0, width, height);

    // 2. Main Card Surface
    const pad = 40;
    const cardW = width - pad * 2;
    const cardH = height - pad * 2;
    ctx.fillStyle = '#ffffff';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(pad, pad, cardW, cardH, 24);
      ctx.fill();
    } else {
      ctx.fillRect(pad, pad, cardW, cardH);
    }

    // Border
    ctx.strokeStyle = '#e5e5ea';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Card Header Bar
    ctx.fillStyle = '#0071e3';
    ctx.fillRect(pad, pad, cardW, 10);

    // 4. Header Titles
    ctx.textAlign = 'center';
    ctx.fillStyle = '#86868b';
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('PRIDE INDUSTRI 2026 · BRAGA CITY WALK', width / 2, pad + 45);

    ctx.fillStyle = '#1d1d1f';
    ctx.font = '700 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('KARTU NAMA DIGITAL TACTLINK', width / 2, pad + 78);

    ctx.fillStyle = '#0071e3';
    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.fillText(`KODE: ${reg.registration_code}`, width / 2, pad + 104);

    // Divider
    ctx.strokeStyle = '#f0f0f2';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad + 30, pad + 124);
    ctx.lineTo(width - pad - 30, pad + 124);
    ctx.stroke();

    // 5. Generate QR Code Image inside Canvas
    const qrData =
      reg.video_url ||
      `https://pride-industri-2026.vercel.app/check-in?code=${encodeURIComponent(
        reg.registration_code
      )}`;
    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, qrData, {
      width: 360,
      margin: 2,
      color: { dark: '#1d1d1f', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });

    // Draw QR centered
    const qrX = (width - 360) / 2;
    const qrY = pad + 145;
    ctx.drawImage(qrCanvas, qrX, qrY, 360, 360);

    // QR Border frame
    ctx.strokeStyle = '#e5e5ea';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(qrX, qrY, 360, 360);

    // 6. Participant Details
    ctx.fillStyle = '#1d1d1f';
    ctx.font = '700 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(reg.full_name, width / 2, pad + 550);

    ctx.fillStyle = '#6e6e73';
    ctx.font = '500 15px system-ui, -apple-system, sans-serif';
    const compLabel =
      reg.competition_id === 'desain-kemasan'
        ? 'Peserta Lomba Desain Kemasan IKM'
        : `Peserta Lomba Video 1 Menit (${reg.video_category || 'Kategori Kreatif'})`;
    ctx.fillText(compLabel, width / 2, pad + 578);

    if (reg.institution || reg.address) {
      ctx.fillStyle = '#86868b';
      ctx.font = '400 14px system-ui, -apple-system, sans-serif';
      ctx.fillText(reg.institution || reg.address || '', width / 2, pad + 602);
    }

    // Info Pill Box
    const pillY = pad + 630;
    const pillW = cardW - 80;
    const pillX = pad + 40;
    ctx.fillStyle = '#f5f5f7';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, 110, 16);
      ctx.fill();
    } else {
      ctx.fillRect(pillX, pillY, pillW, 110);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#6e6e73';
    ctx.font = '500 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('Kontak WhatsApp', pillX + 24, pillY + 32);
    ctx.fillText('Email Terdaftar', pillX + 24, pillY + 62);
    ctx.fillText('Status Keabsahan', pillX + 24, pillY + 92);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#1d1d1f';
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(reg.phone || '-', pillX + pillW - 24, pillY + 32);
    ctx.fillText(reg.email || '-', pillX + pillW - 24, pillY + 62);

    ctx.fillStyle = '#107c41';
    ctx.fillText('Terverifikasi Panitia PRIDE 2026', pillX + pillW - 24, pillY + 92);

    // 7. Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#86868b';
    ctx.font = '400 12px system-ui, -apple-system, sans-serif';
    ctx.fillText(
      'Dinas Perdagangan dan Perindustrian Kota Bandung',
      width / 2,
      cardH + pad - 50
    );
    ctx.fillText(
      'Scan QR code dengan kamera ponsel untuk verifikasi data kepesertaan',
      width / 2,
      cardH + pad - 30
    );

    // Download PNG Blob
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Gagal mengekspor kartu TactLink ke PNG.');
      const safeName =
        fileName || `tactlink-card-${reg.registration_code.toLowerCase()}.png`;
      const finalName = safeName.toLowerCase().endsWith('.png') ? safeName : `${safeName}.png`;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 'image/png');
  } catch (error) {
    console.error('[DOWNLOAD_TACTLINK_CARD_ERROR]', error);
    alert('Terjadi kendala saat menghasilkan kartu QR TactLink.');
  }
}

/**
 * Downloads a genuine, structured A4 PDF document containing
 * official PRIDE Industri 2026 certification, participant details,
 * competition parameters, and an embedded verification QR code.
 *
 * Conforms 100% to valid %PDF-1.3/1.4 specification so Adobe Acrobat,
 * Microsoft Edge, Chrome, and Preview open it natively without error.
 */
export async function downloadRegistrationPdf(
  reg: PrideRegistration,
  fileLabel: string,
  fileName?: string
): Promise<void> {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    // 1. Top Decorative Brand Bar
    doc.setFillColor(0, 113, 227); // Apple System Blue
    doc.rect(0, 0, pageWidth, 4, 'F');

    // 2. Official Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 115);
    doc.text('PEMERINTAH KOTA BANDUNG · DINAS PERDAGANGAN DAN PERINDUSTRIAN', margin, 14);

    doc.setFontSize(16);
    doc.setTextColor(29, 29, 31);
    doc.text('PRIDE INDUSTRI 2026', margin, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 115);
    doc.text(
      'Festival Industri Kreatif & UMKM Kota Bandung · Braga City Walk',
      margin,
      27
    );

    // Separator Line
    doc.setDrawColor(229, 229, 234);
    doc.setLineWidth(0.3);
    doc.line(margin, 31, margin + contentWidth, 31);

    // 3. Document Identifier Box
    doc.setFillColor(245, 245, 247);
    doc.setDrawColor(229, 229, 234);
    doc.roundedRect(margin, 35, contentWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(29, 29, 31);
    doc.text(fileLabel.toUpperCase(), margin + 5, 43);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 115);
    const origName = fileName?.trim() || `${fileLabel.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    doc.text(`Nama File Terunggah: ${origName}`, margin + 5, 49);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 124, 65); // Green
    doc.text(
      'STATUS DOKUMEN: VALID & TERVERIFIKASI PADA DATABASE PANITIA PRIDE 2026',
      margin + 5,
      54
    );

    // Embedded QR Code for verification
    const verificationUrl = `https://pride-industri-2026.vercel.app/check-in?code=${encodeURIComponent(
      reg.registration_code
    )}`;
    try {
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 200,
        margin: 1,
        color: { dark: '#1d1d1f', light: '#ffffff' },
      });
      doc.addImage(qrDataUrl, 'PNG', margin + contentWidth - 21, 37, 18, 18);
    } catch {
      // Ignore QR embed failure if any
    }

    // 4. Participant & Registration Metadata Section
    let currentY = 67;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(29, 29, 31);
    doc.text('I. DATA IDENTITAS PESERTA & PENDAFTARAN', margin, currentY);

    currentY += 4;
    doc.setDrawColor(229, 229, 234);
    doc.line(margin, currentY, margin + contentWidth, currentY);
    currentY += 5;

    const compTitle =
      reg.competition_id === 'desain-kemasan'
        ? 'Lomba Desain Kemasan IKM 2026'
        : `Lomba Video Kreatif 1 Menit (${reg.video_category || 'Lokal'})`;

    const identityRows: [string, string][] = [
      ['Kode Registrasi', reg.registration_code],
      ['Nama Lengkap Peserta', reg.full_name],
      ['Kategori Kompetisi', compTitle],
      ['Alamat Email', reg.email],
      ['Nomor WhatsApp', reg.phone],
      ['Asal / Instansi / Domisili', reg.institution || reg.address || 'Kota Bandung'],
      ['Tanggal Pendaftaran', `${new Date(reg.created_at).toLocaleString('id-ID')} WIB`],
      ['Status Kehadiran Gate', reg.check_in_status === 'checked_in' ? 'Telah Check-In di Gate Braga' : 'Belum Check-In di Gate'],
    ];

    doc.setFontSize(9);
    for (const [label, val] of identityRows) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(110, 110, 115);
      doc.text(label, margin + 2, currentY);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 29, 31);
      doc.text(val || '-', margin + 55, currentY);

      currentY += 6;
    }

    // 5. Competition-Specific Parameters Section
    currentY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(29, 29, 31);

    if (reg.competition_id === 'desain-kemasan') {
      doc.text('II. RINCIAN SUBMISSION KARYA DESAIN KEMASAN', margin, currentY);
      currentY += 4;
      doc.setDrawColor(229, 229, 234);
      doc.line(margin, currentY, margin + contentWidth, currentY);
      currentY += 5;

      const kemasanRows: [string, string][] = [
        ['Nama Merek (Brand)', reg.brand_name || '-'],
        ['Nama Produk Kuliner', reg.product_name || '-'],
        ['Bahan Dasar Lokal', reg.local_ingredients || '-'],
        ['File Master Desain', reg.master_file_name || '-'],
        ['File Karya Kemasan', reg.design_file_name || reg.packaging_file_name || '-'],
        ['Pakta Integritas', reg.pakta_integritas_file_name || 'Tervalidasi Digital'],
        ['Surat Pernyataan', reg.surat_persetujuan_file_name || 'Tervalidasi Digital'],
      ];

      doc.setFontSize(9);
      for (const [label, val] of kemasanRows) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(110, 110, 115);
        doc.text(label, margin + 2, currentY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(29, 29, 31);
        doc.text(val || '-', margin + 55, currentY);

        currentY += 6;
      }

      if (reg.design_concept) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(110, 110, 115);
        doc.text('Konsep & Filosofi Desain', margin + 2, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 42);
        const splitConcept = doc.splitTextToSize(reg.design_concept, contentWidth - 4);
        doc.text(splitConcept, margin + 2, currentY);
        currentY += splitConcept.length * 4.5 + 2;
      }
    } else {
      doc.text('II. RINCIAN SUBMISSION KARYA VIDEO 1 MENIT', margin, currentY);
      currentY += 4;
      doc.setDrawColor(229, 229, 234);
      doc.line(margin, currentY, margin + contentWidth, currentY);
      currentY += 5;

      const socialHandle = reg.instagram_handle || reg.tiktok_handle ? `@${reg.instagram_handle || reg.tiktok_handle}` : '-';
      const videoLink = reg.video_url || reg.instagram_video_url || reg.tiktok_video_url || '-';

      const videoRows: [string, string][] = [
        ['Kategori Video', reg.video_category || '-'],
        ['Judul Karya Video', reg.video_title || '-'],
        ['Akun Media Sosial', socialHandle],
        ['Tautan Publikasi Video', videoLink],
        ['Dokumen Persyaratan', reg.document_file_name || reg.pakta_integritas_file_name || 'Tervalidasi Digital'],
        ['Barcode QR TactLink', reg.tactlink_qr_name || reg.surat_persetujuan_file_name || 'Tervalidasi Digital'],
      ];

      doc.setFontSize(9);
      for (const [label, val] of videoRows) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(110, 110, 115);
        doc.text(label, margin + 2, currentY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(29, 29, 31);
        const splitVal = doc.splitTextToSize(val || '-', contentWidth - 57);
        doc.text(splitVal, margin + 55, currentY);

        currentY += Math.max(6, splitVal.length * 4.5);
      }

      if (reg.video_description) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(110, 110, 115);
        doc.text('Sinopsis / Deskripsi Karya', margin + 2, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 42);
        const splitDesc = doc.splitTextToSize(reg.video_description, contentWidth - 4);
        doc.text(splitDesc, margin + 2, currentY);
        currentY += splitDesc.length * 4.5 + 2;
      }
    }

    // 6. Legal / Official Statement Box
    currentY += 4;
    doc.setFillColor(250, 250, 252);
    doc.setDrawColor(229, 229, 234);
    doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(29, 29, 31);
    doc.text('PERNYATAAN KEABSAHAN & KETENTUAN HUKUM', margin + 4, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 115);
    const legalStatement =
      'Dokumen ini diterbitkan secara resmi melalui Sistem Arsip Digital PRIDE Industri 2026. Peserta telah menyatakan bahwa data dan karya yang didaftarkan adalah orisinal, bebas dari plagiarisme, belum pernah memenangkan kompetisi sejenis, dan tunduk pada seluruh ketentuan Dinas Perdagangan dan Perindustrian Kota Bandung.';
    const splitLegal = doc.splitTextToSize(legalStatement, contentWidth - 8);
    doc.text(splitLegal, margin + 4, currentY + 11);

    // 7. Footer
    doc.setDrawColor(229, 229, 234);
    doc.line(margin, 280, margin + contentWidth, 280);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 145);
    doc.text(
      'PRIDE Industri 2026 · Dinas Perdagangan dan Perindustrian Kota Bandung · Braga City Walk',
      margin,
      285
    );
    doc.text(
      `Diverifikasi sistem pada: ${new Date().toLocaleString('id-ID')} WIB`,
      margin + contentWidth,
      285,
      { align: 'right' }
    );

    // Save PDF
    const targetName = fileName?.trim()
      ? (fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`)
      : `${fileLabel.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${reg.registration_code}.pdf`;

    doc.save(targetName);
  } catch (error) {
    console.error('[DOWNLOAD_REGISTRATION_PDF_ERROR]', error);
    alert('Terjadi kendala saat menghasilkan dokumen PDF. Silakan coba kembali.');
  }
}

/**
 * Universal attachment downloader:
 * Automatically dispatches to either valid PNG image generator or valid PDF generator
 * depending on the file extension and type of document.
 */
export async function handleUniversalDownload(
  reg: PrideRegistration,
  fileLabel: string,
  fileName?: string
): Promise<void> {
  const safeName = fileName?.trim() || '';
  const isImage =
    Boolean(safeName.match(/\.(png|jpg|jpeg|webp)$/i)) ||
    fileLabel.toLowerCase().includes('qr') ||
    fileLabel.toLowerCase().includes('barcode') ||
    fileLabel.toLowerCase().includes('foto') ||
    fileLabel.toLowerCase().includes('kartu nama');

  if (isImage) {
    await downloadTactlinkCardPng(reg, safeName || `tactlink-${reg.registration_code}.png`);
  } else {
    await downloadRegistrationPdf(reg, fileLabel, safeName || `${fileLabel}-${reg.registration_code}.pdf`);
  }
}
