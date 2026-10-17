import sharp from 'sharp';

/**
 * Automatically converts an image buffer into an optimized WebP derivative.
 * Server-only execution. Preserves high visual fidelity while reducing payload size.
 */
export async function convertBufferToWebp(
  inputBuffer: Buffer,
  quality = 82
): Promise<{ buffer: Buffer | null; error: Error | null }> {
  try {
    const outputBuffer = await sharp(inputBuffer)
      .webp({ quality, effort: 4 })
      .toBuffer();
    return { buffer: outputBuffer, error: null };
  } catch (err: any) {
    return { buffer: null, error: err };
  }
}
