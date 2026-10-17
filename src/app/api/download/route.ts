import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const file = request.nextUrl.searchParams.get('file');

    if (!code || !file) {
      return NextResponse.json(
        { success: false, error: 'Parameter code dan file wajib disertakan.' },
        { status: 400 }
      );
    }

    const safeCode = code.replace(/[^a-zA-Z0-9_-]/g, '');
    const safeFile = path.basename(file); // Prevent directory traversal

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', safeCode);
    const directPath = path.join(uploadsDir, safeFile);

    let foundPath: string | null = null;
    if (fs.existsSync(/*turbopackIgnore: true*/ directPath)) {
      foundPath = directPath;
    } else if (fs.existsSync(/*turbopackIgnore: true*/ uploadsDir)) {
      const filesInFolder = fs.readdirSync(/*turbopackIgnore: true*/ uploadsDir);
      const match = filesInFolder.find(
        (f) => f.toLowerCase() === safeFile.toLowerCase()
      );
      if (match) {
        foundPath = path.join(uploadsDir, match);
      }
    }

    if (!foundPath) {
      return NextResponse.json(
        {
          success: false,
          error: `Berkas "${safeFile}" tidak ditemukan pada penyimpanan server untuk kode ${safeCode}.`,
        },
        { status: 404 }
      );
    }

    // Determine MIME type
    const ext = path.extname(foundPath).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.pdf') mimeType = 'application/pdf';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.ai') mimeType = 'application/postscript';
    else if (ext === '.psd') mimeType = 'image/vnd.adobe.photoshop';
    else if (ext === '.zip') mimeType = 'application/zip';

    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ foundPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${safeFile}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    if (error?.digest?.startsWith?.('NEXT_')) {
      throw error;
    }
    console.error('[DOWNLOAD_API_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat mengunduh berkas.' },
      { status: 500 }
    );
  }
}
