import { BinaryBitmap, DecodeHintType, HybridBinarizer, QRCodeReader, RGBLuminanceSource } from '@zxing/library';

export const registrationQrMaxBytes = 2 * 1024 * 1024;
export const registrationQrMaxDimension = 2200;
export const registrationQrError = 'Unggah foto JPG atau PNG yang memuat QR TactLink yang jelas dan bisa dipindai (maksimal 2 MB).';

export function hasReadableQr(pixels: Uint8ClampedArray, width: number, height: number): boolean {
  const luminance = new RGBLuminanceSource(pixels, width, height);
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
  return false;
}

export async function readRegistrationQrPreview(file: File): Promise<string | null> {
  if (file.size < 1 || file.size > registrationQrMaxBytes) return null;

  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!isJpeg && !pngSignature.every((byte, index) => header[index] === byte)) return null;

  const preview = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const image = new Image();
  image.src = preview;
  await image.decode();

  const scale = Math.min(1, registrationQrMaxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = new Uint8ClampedArray(canvas.width * canvas.height);
  for (let index = 0; index < pixels.length; index++) {
    const offset = index * 4;
    pixels[index] = 0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2];
  }
  return hasReadableQr(pixels, canvas.width, canvas.height) ? preview : null;
}
