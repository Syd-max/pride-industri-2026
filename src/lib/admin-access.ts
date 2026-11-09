import type { User } from '@supabase/supabase-js';

export function isOrganizerAdmin(user: User | null | undefined): boolean {
  return user?.app_metadata.pride_role === 'organizer_admin';
}
