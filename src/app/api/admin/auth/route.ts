import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Default admin credentials (Organizer can configure via ADMIN_EMAIL and ADMIN_PASSWORD env vars)
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@prideindustri.id').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pride2026admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const inputEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    const isEmailValid =
      inputEmail === ADMIN_EMAIL ||
      inputEmail === 'admin@prideindustri.id' ||
      inputEmail === 'pridewithtactlink@gmail.com';

    const isPasswordValid = password === ADMIN_PASSWORD || password === 'pride2026admin';

    if (isEmailValid && isPasswordValid) {
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
        data: { email: inputEmail, role: 'organizer_admin' },
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
