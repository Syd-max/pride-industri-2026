import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getSharedRegistrations, updateSharedRegistration, getSharedVisitors } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeVisitors = searchParams.get('visitors') === 'true';

  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (hasSupabase) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('pride_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          data,
          visitors: includeVisitors ? getSharedVisitors() : undefined,
        });
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to memory store:', err);
    }
  }

  return NextResponse.json({
    success: true,
    data: getSharedRegistrations(),
    visitors: includeVisitors ? getSharedVisitors() : undefined,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, check_in_status } = await request.json();

    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      try {
        const supabase = createAdminClient();
        const updatePayload: Record<string, unknown> = {};
        if (status) updatePayload.status = status;
        if (check_in_status) {
          updatePayload.check_in_status = check_in_status;
          if (check_in_status === 'checked_in') {
            updatePayload.checked_in_at = new Date().toISOString();
          } else {
            updatePayload.checked_in_at = null;
          }
        }

        const { error } = await supabase
          .from('pride_registrations')
          .update(updatePayload)
          .eq('id', id);

        if (!error) {
          updateSharedRegistration(id, {
            status,
            check_in_status,
            checked_in_at: check_in_status === 'checked_in' ? new Date().toISOString() : undefined,
          });
          return NextResponse.json({ success: true });
        }
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    // Memory update fallback
    updateSharedRegistration(id, {
      status,
      check_in_status,
      checked_in_at: check_in_status === 'checked_in' ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui status data.' },
      { status: 500 }
    );
  }
}
