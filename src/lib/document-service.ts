'use client';

import QRCode from 'qrcode';

/**
 * Downloads a high-resolution, valid PNG QR code image for QR Generator page.
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
