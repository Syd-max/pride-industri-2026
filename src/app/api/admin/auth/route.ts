import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Default admin credentials (Organizer can configure via ADMIN_EMAIL and ADMIN_PASSWORD env vars)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@prideindustri.id';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pride2026admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set secure session cookie
      const cookieStore = await cookies();
      cookieStore.set('pride_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({
        success: true,
        data: { email: ADMIN_EMAIL, role: 'organizer_admin' },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Email atau password administrator salah.',
      },
      { status: 401 }
    );
  } catch (err) {
    console.error('Admin auth error:', err);
    return NextResponse.json(
      { success: false, error: 'Kesalahan otentikasi server.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('pride_admin_session');
  return NextResponse.json({ success: true });
}
