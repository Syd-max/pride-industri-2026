import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  getSharedRegistrations,
  updateSharedRegistration,
  getSharedVisitors,
  deleteSharedRegistration,
  deleteSharedVisitor,
} from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeVisitors = searchParams.get('visitors') === 'true';

  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    (Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (hasSupabase) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('pride_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[PRIDE_ADMIN_DATA_FETCH_ERROR]', error);
      } else if (data) {
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
      (Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) &&
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

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
        let query = supabase.from('pride_registrations').update(updatePayload);
        if (isUuid) {
          query = query.eq('id', id);
        } else {
          query = query.eq('registration_code', id);
        }

        const { error } = await query;

        if (!error) {
          updateSharedRegistration(id, {
            status,
            check_in_status,
            checked_in_at: check_in_status === 'checked_in' ? new Date().toISOString() : undefined,
          });
          return NextResponse.json({ success: true });
        } else {
          console.error('[PRIDE_ADMIN_DATA_PATCH_ERROR]', error);
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

export async function DELETE(request: NextRequest) {
  try {
    let id: string | null = null;
    const { searchParams } = new URL(request.url);
    id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id || null;
      } catch {
        // Body might be empty
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID atau kode registrasi wajib disertakan.' },
        { status: 400 }
      );
    }

    const hasSupabase =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (hasSupabase) {
      try {
        const supabase = createAdminClient();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));

        // 1. Fetch record first to know real UUID & code
        let targetUuid: string | null = null;
        let targetCode: string | null = null;

        if (isUuid) {
          targetUuid = id;
          const { data: rec } = await supabase
            .from('pride_registrations')
            .select('id, registration_code')
            .eq('id', id)
            .maybeSingle();
          if (rec) targetCode = rec.registration_code;
        } else {
          targetCode = id;
          const { data: rec } = await supabase
            .from('pride_registrations')
            .select('id, registration_code')
            .eq('registration_code', id)
            .maybeSingle();
          if (rec) targetUuid = rec.id;
        }

        // 2. Clean up foreign keys in pride_checkins if targetUuid exists
        if (targetUuid) {
          await supabase
            .from('pride_checkins')
            .delete()
            .eq('registration_id', targetUuid);
        }

        // 3. Delete from pride_registrations
        let deleteQuery = supabase.from('pride_registrations').delete();
        if (targetUuid) {
          deleteQuery = deleteQuery.eq('id', targetUuid);
        } else if (targetCode) {
          deleteQuery = deleteQuery.eq('registration_code', targetCode);
        } else {
          deleteQuery = deleteQuery.eq('id', id);
        }

        const { error: deleteErr } = await deleteQuery;
        if (deleteErr) {
          console.error('[PRIDE_ADMIN_DATA_DELETE_ERROR]', deleteErr);
          return NextResponse.json(
            { success: false, error: deleteErr.message || 'Gagal menghapus data dari database.' },
            { status: 500 }
          );
        }
      } catch (err) {
        console.warn('Supabase delete error, attempting memory fallback:', err);
      }
    }

    // Clean up memory store
    deleteSharedRegistration(id);
    deleteSharedVisitor(id);

    return NextResponse.json({
      success: true,
      message: 'Data berhasil dihapus secara permanen.',
    });
  } catch (err) {
    console.error('Delete handler fatal error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat menghapus data.' },
      { status: 500 }
    );
  }
}
