import sharp from 'sharp';
import { hasReadableQr, registrationQrMaxBytes, registrationQrMaxDimension } from './registration-qr-image';

export { registrationQrError, registrationQrMaxBytes } from './registration-qr-image';

export async function hasReadableRegistrationQr(photo: Blob): Promise<boolean> {
  if (photo.size < 1 || photo.size > registrationQrMaxBytes) return false;

  try {
    const image = sharp(Buffer.from(await photo.arrayBuffer()), { limitInputPixels: 24_000_000 });
    const { format } = await image.metadata();
    if (format !== 'jpeg' && format !== 'png') return false;

    const { data, info } = await image.rotate()
      .resize({ width: registrationQrMaxDimension, height: registrationQrMaxDimension, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#fff' })
      .toColourspace('b-w')
      .raw()
      .toBuffer({ resolveWithObject: true });
    const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    return hasReadableQr(pixels, info.width, info.height);
  } catch {
    // An unreadable or malformed image cannot be verified.
  }
  return false;
}
