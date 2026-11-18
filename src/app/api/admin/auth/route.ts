import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isOrganizerAdmin } from '@/lib/admin-access';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const inputEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (inputEmail && typeof password === 'string' && password) {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email: inputEmail, password });
      if (!error && isOrganizerAdmin(data.user)) {
        return NextResponse.json({
          success: true,
          data: { email: inputEmail, role: 'organizer_admin' },
        });
      }
      if (!error && data.session) await supabase.auth.signOut({ scope: 'local' });
    }

    return NextResponse.json(
      { success: false, error: 'Email atau password administrator salah.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Kesalahan otentikasi server.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal keluar dari sesi admin.' },
      { status: 500 }
    );
  }
  (await cookies()).delete('pride_admin_session');
  return NextResponse.json({ success: true });
}
