import { BinaryBitmap, DecodeHintType, HybridBinarizer, QRCodeReader, RGBLuminanceSource } from '@zxing/library';
import sharp from 'sharp';

export const registrationQrMaxBytes = 2 * 1024 * 1024;
export const registrationQrError = 'Unggah foto JPG atau PNG yang memuat QR TactLink yang jelas dan bisa dipindai (maksimal 2 MB).';

export async function hasReadableRegistrationQr(photo: Blob): Promise<boolean> {
  if (photo.size < 1 || photo.size > registrationQrMaxBytes) return false;

  try {
    const image = sharp(Buffer.from(await photo.arrayBuffer()), { limitInputPixels: 24_000_000 });
    const { format } = await image.metadata();
    if (format !== 'jpeg' && format !== 'png') return false;

    const { data, info } = await image.rotate()
      .resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#fff' })
      .toColourspace('b-w')
      .raw()
      .toBuffer({ resolveWithObject: true });
    const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    const luminance = new RGBLuminanceSource(pixels, info.width, info.height);
    const reader = new QRCodeReader();
    const hints = new Map([[DecodeHintType.TRY_HARDER, true]]);

    for (const source of [luminance, luminance.invert()]) {
      try {
        const result = reader.decode(new BinaryBitmap(new HybridBinarizer(source)), hints);
        if (result.getText().trim()) return true;
      } catch {
        // Try the opposite contrast for dark mode screenshots.
      }
    }
  } catch {
    // An unreadable or malformed image cannot be verified.
  }
  return false;
}
